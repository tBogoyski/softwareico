import django_filters
from .models import Product


class ProductFilter(django_filters.FilterSet):
    category = django_filters.CharFilter(field_name="category__slug", lookup_expr="exact")
    tags = django_filters.CharFilter(method="filter_by_tags")
    pricing = django_filters.CharFilter(field_name="pricing_type", lookup_expr="exact")

    class Meta:
        model = Product
        fields = ["category", "tags", "pricing"]

    def filter_by_tags(self, queryset, name, value):
        """Filter by comma-separated tag slugs: ?tags=ai,automation"""
        slugs = [s.strip() for s in value.split(",") if s.strip()]
        if slugs:
            queryset = queryset.filter(tags__slug__in=slugs).distinct()
        return queryset
