from channels.generic.websocket import (WebsocketConsumer,
                                        AsyncWebsocketConsumer)
from .models import (Profile,
                     User,
                     Location,
                     RoomOrder,
                     Shop)
from asgiref.sync import async_to_sync
from django.shortcuts import get_object_or_404
from django.contrib.gis.geos import fromstr
import json


def get_current_locations(roomId):
    room = get_object_or_404(RoomOrder, id=roomId)
    return room.locations.all()


def get_current_profile(username):
    try:
        profile = Profile.objects.get(user__username=username)
    except Profile.DoesNotExist:
        profile = Shop.objects.first().personal.filter(
            busy=False, status_staff=True
        ).first()
    return profile


def get_current_order_room(roomId):
    return get_object_or_404(RoomOrder, id=roomId)


class GeoConsumer(WebsocketConsumer):
    def fetch_locations(self, data):
        locations = get_current_locations(data['roomID'])
        content = {
            'command': 'locations',
            'locations': self.locations_to_json(locations)
        }
        self.send_location(content)

    def new_location(self, data):
        profile_contact = get_current_profile(data['who_shared'])
        location = Location.objects.filter(profile=profile_contact).last()
        location.point = fromstr(
            f"POINT({data['location']['lng']} {data['location']['lat']})",
            srid=4326)
        location.save()
        current_room = get_current_order_room(data['roomID'])
        content = {
            'command': 'new_location',
            'location': self.locations_to_json(current_room.locations.all())
        }
        return self.send_room_location(content)

    commands = {
        'fetch_locations': fetch_locations,
        'new_location': new_location
    }

    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'room_%s' % self.room_name
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        self.accept()

    def disconnect(self, code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)
        self.commands[data['command']](self, data)

    def locations_to_json(self, locations):
        result = []
        for location in locations:
            result.append(self.location_to_json(location))
        return result

    def location_to_json(self, location):
        return {
            'id': location.id,
            'point': location.point.coords,
            'profile': location.profile.user.username
        }

    def send_room_location(self, location):
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'room_location',
                'location': location
            }
        )

    def send_location(self, location):
        self.send(text_data=json.dumps(location))

    def room_location(self, event):
        location = event['location']
        self.send(text_data=json.dumps(location))



