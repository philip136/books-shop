from django.urls import re_path
from magazine.wsocket.consumers import GeoConsumer

websocket_urlpatterns = [
    re_path(r'^ws/(?P<room_name>[^/]+)/$', GeoConsumer),
]