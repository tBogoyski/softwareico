from rest_framework import serializers
from .models import (
    Category,
    Tag,
    Product,
    ProductImage,
    ProductLink,
    ProductContact,
    ProductDataRequest,
    ProductDataRequestImage,
    ProductDataRequestLink,
    ProductDataRequestContact,
)


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
        fields = ("id", "name", "name_en", "name_bg", "slug")


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ("id", "image", "alt_text", "order")


class ProductLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductLink
        fields = ("id", "label", "label_en", "label_bg", "url", "link_type")


class ProductContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductContact
        fields = ("id", "contact_type", "value", "label", "label_bg", "label_en")


class ProductListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for the product list endpoint."""
    category = CategoryNestedSerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = (
            "id", "name", "slug",
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
            "id", "name", "slug",
            "tagline", "tagline_en", "tagline_bg",
            "description", "description_en", "description_bg",
            "logo", "website_url",
            "pricing_type", "pricing_details", "pricing_details_en", "pricing_details_bg",
            "category", "tags", "images", "links", "contacts",
            "is_featured", "created_at", "updated_at",
        )


class ProductDataRequestImageWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductDataRequestImage
        fields = ("image",)


class ProductDataRequestLinkWriteSerializer(serializers.ModelSerializer):
    label_en = serializers.CharField(required=False, allow_blank=True)
    label_bg = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = ProductDataRequestLink
        fields = ("label", "label_en", "label_bg", "url", "link_type")


class ProductDataRequestContactWriteSerializer(serializers.ModelSerializer):
    label_en = serializers.CharField(required=False, allow_blank=True)
    label_bg = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = ProductDataRequestContact
        fields = ("contact_type", "value", "label", "label_en", "label_bg")


class ProductDataRequestCreateSerializer(serializers.ModelSerializer):
    tagline_en = serializers.CharField()
    tagline_bg = serializers.CharField()
    description_en = serializers.CharField()
    description_bg = serializers.CharField()
    website_url = serializers.URLField()
    logo = serializers.FileField()
    suggested_category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    suggested_tags = serializers.PrimaryKeyRelatedField(
        queryset=Tag.objects.all(), many=True, required=True, allow_empty=False,
    )
    pricing_details_en = serializers.CharField(required=False, allow_blank=True)
    pricing_details_bg = serializers.CharField(required=False, allow_blank=True)
    images = ProductDataRequestImageWriteSerializer(many=True, required=False)
    links = ProductDataRequestLinkWriteSerializer(many=True, required=False)
    contacts = ProductDataRequestContactWriteSerializer(many=True, required=False)

    class Meta:
        model = ProductDataRequest
        fields = (
            "submitter_email",
            "product_name",
            "tagline_en", "tagline_bg",
            "description_en", "description_bg",
            "logo", "website_url",
            "pricing_type",
            "pricing_details_en", "pricing_details_bg",
            "suggested_category",
            "suggested_tags",
            "images", "links", "contacts",
        )

    def create(self, validated):
        images = validated.pop("images", [])
        links = validated.pop("links", [])
        contacts = validated.pop("contacts", [])
        tags = validated.pop("suggested_tags", [])
        req = ProductDataRequest.objects.create(**validated)
        req.suggested_tags.set(tags)
        for i in images:
            ProductDataRequestImage.objects.create(request=req, **i)
        for l in links:
            ProductDataRequestLink.objects.create(request=req, **l)
        for c in contacts:
            ProductDataRequestContact.objects.create(request=req, **c)
        return req
