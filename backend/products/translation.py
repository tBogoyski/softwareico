from modeltranslation.translator import register, TranslationOptions
from .models import (
    Category,
    Tag,
    Product,
    ProductLink,
    ProductContact,
    ProductDataRequest,
    ProductDataRequestLink,
    ProductDataRequestContact,
)


@register(Category)
class CategoryTranslationOptions(TranslationOptions):
    fields = ("name", "description")


@register(Tag)
class TagTranslationOptions(TranslationOptions):
    fields = ("name",)


@register(Product)
class ProductTranslationOptions(TranslationOptions):
    fields = ("tagline", "description", "pricing_details")


@register(ProductLink)
class ProductLinkTranslationOptions(TranslationOptions):
    fields = ("label",)


@register(ProductContact)
class ProductContactTranslationOptions(TranslationOptions):
    fields = ("label",)


@register(ProductDataRequest)
class ProductDataRequestTranslationOptions(TranslationOptions):
    fields = ("tagline", "description", "pricing_details")


@register(ProductDataRequestLink)
class ProductDataRequestLinkTranslationOptions(TranslationOptions):
    fields = ("label",)


@register(ProductDataRequestContact)
class ProductDataRequestContactTranslationOptions(TranslationOptions):
    fields = ("label",)
