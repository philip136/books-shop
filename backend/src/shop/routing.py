from channels.routing import (ProtocolTypeRouter,
                              URLRouter)
from channels.auth import AuthMiddlewareStack
import magazine.routing

application = ProtocolTypeRouter({
    'websocket': AuthMiddlewareStack(
        URLRouter(
            magazine.routing.websocket_urlpatterns
        )
    ),
})