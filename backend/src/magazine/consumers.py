from channels.generic.websocket import (WebsocketConsumer,
                                        AsyncWebsocketConsumer)
from .models import (Profile,
                     User,
                     Location,
                     RoomOrder)
from asgiref.sync import async_to_sync
from django.shortcuts import get_object_or_404
from django.core.serializers import serialize
from django.contrib.gis.geos import fromstr
import json


def get_current_location(username):
    profile = get_object_or_404(Profile, user__username=username)
    try:
        location = Location.objects.get(profile=profile)
    except Location.DoesNotExist:
        location = Location.objects.create(
            title=f'Текущая позиция {profile.user.username}',
            profile=profile
        )
        location.point = fromstr('POINT(27.567444 53.893009)', srid=4326)
        location.save()
    return location


def get_current_profile(username):
    profile = get_object_or_404(Profile, user__username=username)
    return profile


def get_current_order_room(roomId):
    return get_object_or_404(RoomOrder, id=roomId)


class GeoConsumer(WebsocketConsumer):
    def fetch_location(self, data):
        location = get_current_location(data['username'])
        content = {
            'command': 'location',
            'location': self.location_to_json(location)
        }
        self.send_location(content)

    def new_location(self, data):
        profile_contact = get_current_profile(data['who_shared'])
        try:
            location = Location.objects.get(
                profile=profile_contact
            )
        except Location.DoesNotExist:
            location = Location.objects.create(
                profile=profile_contact
            )
        location.point = fromstr(
            f"POINT({data['location']['lng']} {data['location']['lat']})",
            srid=4326)
        location.save()
        current_room = get_current_order_room(data['roomID'])
        if profile_contact not in current_room.participants.all():
            current_room.participants.add(profile_contact)
        current_room.locations.add(location)
        current_room.save()
        content = {
            'command': 'new_location',
            'locations': self.location_to_json(location)
        }
        return self.send_room_location(content)

    commands = {
        'fetch_location': fetch_location,
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



