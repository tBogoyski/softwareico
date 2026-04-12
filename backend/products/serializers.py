from rest_framework import serializers
from .models import Category, Tag, Product, ProductImage, ProductLink, ProductContact


class CategoryNestedSerializer(serializers.ModelSerializer):
    """Lightweight category serializer for nesting inside product responses."""

    class Meta:
        model = Category
        fields = (
            "id", "name", "name_en", "name_bg", "slug", "icon",
        )


class CategorySerializer(serializers.ModelSerializer):
    """Full category serializer with product count (for /api/categories/)."""
    product_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Category
        fields = (
            "id", "name", "name_en", "name_bg", "slug",
            "description", "description_en", "description_bg",
            "icon", "order", "product_count",
        )


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ("id", "name", "slug")


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ("id", "image", "alt_text", "order")


class ProductLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductLink
        fields = ("id", "label", "url", "link_type")


class ProductContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductContact
        fields = ("id", "contact_type", "value", "label")


class ProductListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for the product list endpoint."""
    category = CategoryNestedSerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = (
            "id", "name", "name_en", "name_bg", "slug",
            "tagline", "tagline_en", "tagline_bg",
            "logo", "website_url", "pricing_type",
            "category", "tags", "is_featured", "created_at",
        )


class ProductDetailSerializer(serializers.ModelSerializer):
    """Full serializer for the product detail endpoint."""
    category = CategoryNestedSerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    links = ProductLinkSerializer(many=True, read_only=True)
    contacts = ProductContactSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = (
            "id", "name", "name_en", "name_bg", "slug",
            "tagline", "tagline_en", "tagline_bg",
            "description", "description_en", "description_bg",
            "logo", "website_url",
            "pricing_type", "pricing_details", "pricing_details_en", "pricing_details_bg",
            "category", "tags", "images", "links", "contacts",
            "is_featured", "created_at", "updated_at",
        )
