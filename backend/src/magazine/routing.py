from django.urls import (path,
                         re_path)
from .consumers import GeoConsumer

websocket_urlpatterns = [
    re_path(r'^ws/(?P<username>[^/]+)/$', GeoConsumer),
]