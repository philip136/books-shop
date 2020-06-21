from magazine.models import (CartItem, Cart)
from rest_framework.response import Response
from rest_framework import status


def item_in_cart(cart, item: CartItem) -> bool:
    return item in cart.products.all()

def operation_with_cart(cart: Cart, item: CartItem, operation: str, **kwargs):
    if item_in_cart(cart, item):
        if operation == "remove_from_cart":
            cart.remove_from_cart(item.product)

        if operation == "change_from_cart":
            count = kwargs.get('count')
            cart.change_from_cart(count, item)
    else: 
        if operation == "add_to_cart":
            cart.add_to_cart(item, cart)




    


