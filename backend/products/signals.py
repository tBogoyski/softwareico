import os
import shutil

from django.conf import settings
from django.core.cache import cache
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from .models import (
    Category,
    Tag,
    Product,
    ProductImage,
    ProductLink,
    ProductContact,
    ProductDataRequest,
)


def clear_api_cache(**kwargs):
    """Clear the entire cache when any product-related model changes."""
    cache.clear()


for model in (Category, Tag, Product, ProductImage, ProductLink, ProductContact):
    post_save.connect(clear_api_cache, sender=model)
    post_delete.connect(clear_api_cache, sender=model)


@receiver(post_delete, sender=Product)
def delete_product_media(sender, instance, **kwargs):
    """Remove a product's media directory (logo + images) when it is deleted.

    All files for a product live under media/products/<slug>/. The slug is
    unique, so this directory belongs to exactly one product. Using post_delete
    means this fires for the admin bulk-delete action too, not just
    Model.delete().
    """
    product_dir = None

    # Prefer deriving the directory from the stored logo path.
    if instance.logo and instance.logo.name:
        product_dir = os.path.dirname(instance.logo.path)
    elif instance.slug:
        product_dir = os.path.join(settings.MEDIA_ROOT, "products", instance.slug)

    if not product_dir:
        return

    # Guard: only ever delete inside media/products/.
    base_dir = os.path.join(settings.MEDIA_ROOT, "products")
    if os.path.commonpath([base_dir, product_dir]) != base_dir:
        return

    if os.path.isdir(product_dir):
        shutil.rmtree(product_dir, ignore_errors=True)


@receiver(post_delete, sender=ProductDataRequest)
def delete_request_media(sender, instance, **kwargs):
    """Remove a request's media directory (logo + images) when it is deleted.

    All files for a request live under media/product_requests/<product_name>/.
    We derive that directory from the logo path when available (safest), and
    fall back to reconstructing it from product_name. Using post_delete means
    this fires for the admin bulk-delete action too, not just Model.delete().
    """
    request_dir = None

    # Prefer deriving the directory from the stored logo path.
    if instance.logo and instance.logo.name:
        request_dir = os.path.dirname(instance.logo.path)
    elif instance.product_name:
        request_dir = os.path.join(
            settings.MEDIA_ROOT, "product_requests", instance.product_name
        )

    if not request_dir:
        return

    # Guard: only ever delete inside media/product_requests/.
    base_dir = os.path.join(settings.MEDIA_ROOT, "product_requests")
    if os.path.commonpath([base_dir, request_dir]) != base_dir:
        return

    if os.path.isdir(request_dir):
        shutil.rmtree(request_dir, ignore_errors=True)
