from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, TagViewSet, ProductViewSet, stats_view

router = DefaultRouter()
router.register("products", ProductViewSet)
router.register("categories", CategoryViewSet)
router.register("tags", TagViewSet)

urlpatterns = [
    path("stats/", stats_view, name="stats"),
    path("", include(router.urls)),
]
