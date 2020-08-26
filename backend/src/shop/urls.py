from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
import magazine.urls

urlpatterns = [
    path('', include(magazine.urls), name='magazine'),
    path('admin/', admin.site.urls),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
