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
                     Shop,
                     RoomOrder)


class LocationAdmin(admin.OSMGeoAdmin):
    list_display = ['title', 'longitude', 'latitude']
    search_fields = ['title', ]


admin.site.register(Location, LocationAdmin)
admin.site.register(RoomOrder)
admin.site.register(Shop)
admin.site.register(Product)
admin.site.register(TypeProduct)
admin.site.register(CartItem)
admin.site.register(Cart)
admin.site.register(Order)
admin.site.register(Profile)

