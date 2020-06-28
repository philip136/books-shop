from django.http import (HttpRequest,
                        HttpResponse)
from rest_framework.response import Response
from returns.result import (Result,
                            safe)
from magazine.models import (Cart,
                            Profile,
                            CartItem,
                            Product)
from django.contrib.auth.models import User
from returns.pipeline import is_successful
from returns.result import Result, Success, Failure
from decimal import Decimal
from .operations import operation_with_cart



def serializer_validate(serializer_class, instance):
    """
    Processing serializer data
    """ 
    def serializer_decorator(function: None, **kwargs):
        def wrapper(request: HttpRequest, *args, **kwargs):
            serializer = serializer_class(instance=instance, data=request.data)
            if serializer.is_valid():
                data = serializer.data
                return function(request, serializer_data=data)
            return Response({
                "message": "Проверьте правильность введенных данных"
            })
        return wrapper
    return serializer_decorator


def item_exist(product: Product, count: int, cart: Cart, operation: str):
    """
    Check cart item is exist
    """
    item: CartItem = CartItem.objects.filter(product=product)
    product_total = product.get_price() * int(count)
    if item.exists() == False:
        item: CartItem = CartItem.objects.create(
            product=product,
            count=count,
            product_total=product_total
        )
        item.save()
    operation_with_cart(cart, item.first(), operation, count=count)


def operations_with_cart(operation: str):
    def cart_exist(function: None):
        """
        Check cart for user and calling operation
        for 'change,add,remove' from cart
        """
        def wrapper_for_update_create_delete(request, *args, **kwargs):
            user: User = request.user
            profile: Profile = Profile.objects.get(user=user)
            cart: Cart = Cart.objects.filter(owner=profile).first()
            if cart is None:
                cart: Cart = Cart.objects.create(owner=profile,cart_total=Decimal(0.00))
                cart.save()

            if request.method == "POST" or request.method == "PUT":
                product: Product = Product.objects.get(name=request.data.get('product_name'))
                count: int = request.data.get('count')
                item_exist(product, count, cart, operation)

            if request.method == "DELETE":
                item: CartItem = CartItem.objects.get(pk=kwargs.get('pk'))
                operation_with_cart(cart, item, operation)

            return function(request)
        return wrapper_for_update_create_delete
    return cart_exist



            











