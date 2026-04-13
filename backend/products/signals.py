from django.core.cache import cache
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from .models import Category, Tag, Product, ProductImage, ProductLink, ProductContact


def clear_api_cache(**kwargs):
    """Clear the entire cache when any product-related model changes."""
    cache.clear()


for model in (Category, Tag, Product, ProductImage, ProductLink, ProductContact):
    post_save.connect(clear_api_cache, sender=model)
    post_delete.connect(clear_api_cache, sender=model)
