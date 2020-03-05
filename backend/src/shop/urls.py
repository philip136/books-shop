from django.contrib import admin
from django.urls import path, include
import magazine.urls

urlpatterns = [
    path('', include(magazine.urls), name='magazine'),
    path('api-auth/', include('rest_framework.urls')),
    path('admin/', admin.site.urls),
]
