from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
import magazine.urls

urlpatterns = [
    path('', include(magazine.urls), name='magazine'),
    path('api-auth/', include('rest_framework.urls')),
    path('rest-auth/', include('rest_auth.urls'), name='login-url'),
    path('rest-auth/registration/', include('rest_auth.registration.urls')),
    path('admin/', admin.site.urls),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    import debug_toolbar
    urlpatterns = [
        path('__debug__/', include(debug_toolbar.urls))
    ] + urlpatterns
