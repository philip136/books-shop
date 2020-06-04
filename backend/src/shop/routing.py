from channels.routing import (ProtocolTypeRouter,
                              URLRouter)
from channels.auth import AuthMiddlewareStack
import magazine.wsocket.routing

application = ProtocolTypeRouter({
    'websocket': AuthMiddlewareStack(
        URLRouter(
            magazine.wsocket.routing.websocket_urlpatterns
        )
    ),
})