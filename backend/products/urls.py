from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategoryViewSet,
    TagViewSet,
    ProductViewSet,
    stats_view,
    validate_invitation_view,
    submit_product_data_view,
)

router = DefaultRouter()
router.register("products", ProductViewSet)
router.register("categories", CategoryViewSet)
router.register("tags", TagViewSet)

urlpatterns = [
    path("stats/", stats_view, name="stats"),
    path(
        "submit/<uuid:token>/validate/",
        validate_invitation_view,
        name="submit-validate",
    ),
    path(
        "submit/<uuid:token>/",
        submit_product_data_view,
        name="submit-product-data",
    ),
    path("", include(router.urls)),
]
