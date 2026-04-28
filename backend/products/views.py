import re

from rest_framework import viewsets, mixins, status
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    parser_classes,
    permission_classes,
)
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.db.models import Count, Q
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_headers

from .models import Category, Tag, Product, ProductSubmissionInvitation
from .serializers import (
    CategorySerializer,
    TagSerializer,
    ProductListSerializer,
    ProductDetailSerializer,
    ProductDataRequestCreateSerializer,
)
from .filters import ProductFilter

# Cache duration: 5 minutes for list views, 10 minutes for static data
CACHE_SHORT = 60 * 5
CACHE_LONG = 60 * 10


@method_decorator(cache_page(CACHE_LONG), name="list")
@method_decorator(vary_on_headers("Accept-Language"), name="list")
class CategoryViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    """GET /api/categories/ — list all categories with product counts."""
    queryset = Category.objects.annotate(product_count=Count("products", filter=Q(products__is_active=True)))
    serializer_class = CategorySerializer
    pagination_class = None


@method_decorator(cache_page(CACHE_LONG), name="list")
@method_decorator(vary_on_headers("Accept-Language"), name="list")
class TagViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    """GET /api/tags/ — list all tags."""
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    pagination_class = None


@method_decorator(cache_page(CACHE_SHORT), name="list")
@method_decorator(vary_on_headers("Accept-Language"), name="list")
class ProductViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    """
    GET /api/products/      — list with search, filter, sort, pagination
    GET /api/products/:slug/ — detail with nested images, links, contacts
    """
    queryset = Product.objects.filter(is_active=True).select_related("category").prefetch_related("tags")
    filterset_class = ProductFilter
    search_fields = ["name", "name_bg", "description", "description_bg", "tagline"]
    ordering_fields = ["name", "created_at", "is_featured"]
    ordering = ["-is_featured", "-created_at"]
    lookup_field = "slug"

    def get_serializer_class(self):
        if self.action == "retrieve":
            return ProductDetailSerializer
        return ProductListSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        if self.action == "retrieve":
            qs = qs.prefetch_related("images", "links", "contacts")
        return qs


_NESTED_KEY_RE = re.compile(r"^([a-zA-Z_]+)\[(\d+)\](?:\.|__)?([a-zA-Z_]+)?$")


def _shape_nested(form_data, list_keys):
    """
    Reshape bracket-indexed multipart keys into nested lists for DRF.
    """
    list_keys = set(list_keys)
    flat = {}
    grouped = {k: {} for k in list_keys}

    for key in form_data:
        match = _NESTED_KEY_RE.match(key)
        if not match:
            value = form_data.get(key)
            if value is not None:
                flat[key] = value
            continue
        prefix, idx, sub = match.group(1), int(match.group(2)), match.group(3)
        if prefix not in list_keys or not sub:
            continue
        bucket = grouped[prefix].setdefault(idx, {})
        # Use the raw value (works for both files and strings)
        bucket[sub] = form_data.get(key)

    for k, by_idx in grouped.items():
        flat[k] = [by_idx[i] for i in sorted(by_idx.keys())]

    return flat


@api_view(["GET"])
@authentication_classes([])
@permission_classes([AllowAny])
def validate_invitation_view(request, token):
    """GET /api/submit/<token>/validate/ — verify a submission link is usable."""
    inv = get_object_or_404(ProductSubmissionInvitation, token=token)
    if not inv.is_valid():
        return Response(
            {"detail": "invalid_or_expired"},
            status=status.HTTP_410_GONE,
        )
    return Response({"ok": True})


@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
@authentication_classes([])
@permission_classes([AllowAny])
def submit_product_data_view(request, token):
    """POST /api/submit/<token>/ — accept a multipart product-data submission."""
    inv = get_object_or_404(ProductSubmissionInvitation, token=token)
    if not inv.is_valid():
        return Response(
            {"detail": "invalid_or_expired"},
            status=status.HTTP_410_GONE,
        )

    data = _shape_nested(request.data, ("images", "links", "contacts"))
    data["suggested_tags"] = request.data.getlist("suggested_tags")
    serializer = ProductDataRequestCreateSerializer(data=data)
    serializer.is_valid(raise_exception=True)
    serializer.save(invitation=inv)

    inv.used_at = timezone.now()
    inv.save(update_fields=["used_at"])
    return Response({"ok": True}, status=status.HTTP_201_CREATED)


@api_view(["GET"])
@cache_page(CACHE_LONG)
@vary_on_headers("Accept-Language")
def stats_view(request):
    """GET /api/stats/ — aggregate counts for the hero page."""
    return Response({
        "products": Product.objects.filter(is_active=True).count(),
        "categories": Category.objects.count(),
        "tags": Tag.objects.count(),
    })
