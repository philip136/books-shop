from django.contrib import admin
from django.contrib.gis import admin
from django.contrib.gis.geos import GEOSGeometry
from .models import (Product,
                     TypeProduct,
                     CartItem,
                     Cart,
                     Order,
                     Profile,
                     Location,
                     Shop)


class LocationAdmin(admin.OSMGeoAdmin):
    list_display = ['title', 'address', 'longitude', 'latitude']
    search_fields = ['title', 'address']


admin.site.register(Location, LocationAdmin)
admin.site.register(Shop)
admin.site.register(Product)
admin.site.register(TypeProduct)
admin.site.register(CartItem)
admin.site.register(Cart)
admin.site.register(Order)
admin.site.register(Profile)

