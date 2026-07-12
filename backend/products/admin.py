from django.conf import settings
from django.contrib import admin
from django.urls import path
from django.utils.html import format_html
from modeltranslation.admin import TabbedTranslationAdmin
from .admin_views import download_pitch_pdf
from .models import (
    Category,
    Tag,
    Product,
    ProductImage,
    ProductLink,
    ProductContact,
    ProductSubmissionInvitation,
    ProductDataRequest,
    ProductDataRequestImage,
    ProductDataRequestLink,
    ProductDataRequestContact,
)


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
    fields = ("image", "order")


class ProductLinkInline(admin.TabularInline):
    model = ProductLink
    extra = 1
    fields = ("link_type", "label_bg", "label_en", "url")


class ProductContactInline(admin.TabularInline):
    model = ProductContact
    extra = 1
    fields = ("contact_type", "label_en", "label_bg", "value")


@admin.register(Product)
class ProductAdmin(TabbedTranslationAdmin):
    list_display = ("name", "category", "pricing_type", "is_featured", "is_active", "created_at")
    list_filter = ("is_active", "is_featured", "pricing_type", "category")
    search_fields = ("name", "tagline_en", "description_en")
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


@admin.register(ProductSubmissionInvitation)
class ProductSubmissionInvitationAdmin(admin.ModelAdmin):
    list_display = ("token", "submit_url", "created_at", "expires_at", "used_at", "revoked")
    list_filter = ("revoked",)
    readonly_fields = ("token", "submit_url", "created_at", "used_at")
    fields = (
        "expires_at", "revoked",
        "token", "submit_url", "created_at", "used_at",
    )

    @admin.display(description="Submission link")
    def submit_url(self, obj):
        if not obj.pk:
            return "—"
        url = f"{settings.FRONTEND_ORIGIN}/submit-product/{obj.token}/"
        return format_html('<a href="{0}" target="_blank">{0}</a>', url)


class ProductDataRequestImageInline(admin.TabularInline):
    model = ProductDataRequestImage
    extra = 0
    can_delete = False
    fields = ("image",)
    readonly_fields = ("image",)

    def has_add_permission(self, request, obj=None):
        return False


class ProductDataRequestLinkInline(admin.TabularInline):
    model = ProductDataRequestLink
    extra = 0
    can_delete = False
    fields = ("link_type", "label_en", "label_bg", "url")

    def has_add_permission(self, request, obj=None):
        return False


class ProductDataRequestContactInline(admin.TabularInline):
    model = ProductDataRequestContact
    extra = 0
    can_delete = False
    fields = ("contact_type", "label_en", "label_bg", "value")

    def has_add_permission(self, request, obj=None):
        return False


@admin.register(ProductDataRequest)
class ProductDataRequestAdmin(TabbedTranslationAdmin):
    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return True

    def change_view(self, request, object_id, form_url="", extra_context=None):
        extra_context = extra_context or {}
        extra_context["show_save_and_continue"] = False
        extra_context["show_delete_link"] = False
        return super().change_view(request, object_id, form_url, extra_context)

    list_display = (
        "product_name", "invitation", "status", "submitted_at",
    )
    list_filter = ("status", "pricing_type", "suggested_category")
    search_fields = ("submitter_email", "product_name")
    readonly_fields = ("invitation", "submitter_email", "submitted_at")
    filter_horizontal = ("suggested_tags",)
    inlines = [
        ProductDataRequestImageInline,
        ProductDataRequestLinkInline,
        ProductDataRequestContactInline,
    ]
    fieldsets = (
        ("Submission", {
            "fields": ("invitation", "submitter_email", "submitted_at"),
        }),
        ("Product", {
            "fields": ("product_name", "tagline", "description", "logo", "website_url", "suggested_category", "suggested_tags"),
        }),
        ("Pricing", {
            "fields": ("pricing_type", "pricing_details"),
        }),
        ("Status", {
            "fields": ("status",),
            "classes": ("pdr-status-fieldset",),
        }),
    )


_original_get_urls = admin.site.get_urls


def _patched_get_urls():
    extra = [
        path(
            "pitch/download/<str:lang>/",
            admin.site.admin_view(download_pitch_pdf),
            name="download_pitch_pdf",
        ),
    ]
    return extra + _original_get_urls()


admin.site.get_urls = _patched_get_urls
