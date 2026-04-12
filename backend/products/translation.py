from modeltranslation.translator import register, TranslationOptions
from .models import Category, Tag, Product, ProductLink


@register(Category)
class CategoryTranslationOptions(TranslationOptions):
    fields = ("name", "description")


@register(Tag)
class TagTranslationOptions(TranslationOptions):
    fields = ("name",)


@register(Product)
class ProductTranslationOptions(TranslationOptions):
    fields = ("name", "tagline", "description", "pricing_details")


@register(ProductLink)
class ProductLinkTranslationOptions(TranslationOptions):
    fields = ("label",)
