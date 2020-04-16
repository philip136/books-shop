from django.contrib import admin
from django_google_maps import widgets as map_widgets
from django_google_maps import fields as map_fields
from .models import (Product,
                     TypeProduct,
                     CartItem,
                     Cart,
                     Order,
                     Profile)

admin.site.register(Product)
admin.site.register(TypeProduct)
admin.site.register(CartItem)
admin.site.register(Cart)
admin.site.register(Order)


class ProfileAdmin(admin.ModelAdmin):
    formfield_overrides = {
        map_fields.AddressField: {'widget': map_widgets.GoogleMapsAddressWidget(
            attrs={'data-map-type': 'roadmap'}
        )},
    }

admin.site.register(Profile)

# Register your models here.
