# api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TripViewSet, StopViewSet

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'trips', TripViewSet)
router.register(r'stops', StopViewSet)

# The API URLs are now determined automatically by the router.
urlpatterns = [
    path('', include(router.urls)),
]