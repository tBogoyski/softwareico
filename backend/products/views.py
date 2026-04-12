from rest_framework import viewsets, mixins
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Count, Q

from .models import Category, Tag, Product
from .serializers import (
    CategorySerializer,
    TagSerializer,
    ProductListSerializer,
    ProductDetailSerializer,
)
from .filters import ProductFilter


class CategoryViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    """GET /api/categories/ — list all categories with product counts."""
    queryset = Category.objects.annotate(product_count=Count("products", filter=Q(products__is_active=True)))
    serializer_class = CategorySerializer
    pagination_class = None


class TagViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    """GET /api/tags/ — list all tags."""
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    pagination_class = None


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


@api_view(["GET"])
def stats_view(request):
    """GET /api/stats/ — aggregate counts for the hero page."""
    return Response({
        "products": Product.objects.filter(is_active=True).count(),
        "categories": Category.objects.count(),
        "tags": Tag.objects.count(),
    })
