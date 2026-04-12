from django.contrib import admin
from modeltranslation.admin import TabbedTranslationAdmin
from .models import Category, Tag, Product, ProductImage, ProductLink, ProductContact


@admin.register(Category)
class CategoryAdmin(TabbedTranslationAdmin):
    list_display = ("name", "slug", "order")
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name_en", "name_bg")
    ordering = ("order", "name")


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name",)


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ("image", "alt_text", "order")


class ProductLinkInline(admin.TabularInline):
    model = ProductLink
    extra = 1
    fields = ("link_type", "label", "url")


class ProductContactInline(admin.TabularInline):
    model = ProductContact
    extra = 1
    fields = ("contact_type", "label", "value")


@admin.register(Product)
class ProductAdmin(TabbedTranslationAdmin):
    list_display = ("name", "category", "pricing_type", "is_featured", "is_active", "created_at")
    list_filter = ("is_active", "is_featured", "pricing_type", "category")
    search_fields = ("name_en", "name_bg", "tagline_en", "description_en")
    prepopulated_fields = {"slug": ("name",)}
    filter_horizontal = ("tags",)
    readonly_fields = ("created_at", "updated_at")
    inlines = [ProductImageInline, ProductLinkInline, ProductContactInline]
    fieldsets = (
        (None, {
            "fields": ("name", "slug", "category", "tags"),
        }),
        ("Details", {
            "fields": ("tagline", "description", "logo", "website_url"),
        }),
        ("Pricing", {
            "fields": ("pricing_type", "pricing_details"),
        }),
        ("Status", {
            "fields": ("is_featured", "is_active", "created_at", "updated_at"),
        }),
    )
