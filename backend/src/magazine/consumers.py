from channels.generic.websocket import (WebsocketConsumer,
                                        AsyncWebsocketConsumer)
from .models import (Profile,
                     User)
from channels.db import database_sync_to_async
import json


class GeoConsumer(AsyncWebsocketConsumer):
    """ Insert button with data"""
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['username']
        self.room_group_name = 'group_%s' % self.room_name
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        coordinates = text_data_json['coordinates']
        # Send latitude and longitude to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'profile_coordinates',
                'coordinates': coordinates
            }
        )

    # Click on ready button -> enable navigator
    async def profile_coordinates(self, event):
        coordinates = event['coordinates']
        current_user = await self.get_profile()
        await self.save_coordinates(current_user, coordinates)
        # Send coordinates to WebSocket
        await self.send(text_data=json.dumps({
            'coordinates': coordinates
        }))

    @database_sync_to_async
    def get_profile(self):
        current_user = self.scope['user']
        return User.objects.get(user=current_user)

    @database_sync_to_async
    def save_coordinates(self, current_user, coordinates):
        profile = Profile.objects.get(user=current_user)
        lat, lng = str(coordinates).split(' ')[0], str(coordinates).split(' ')[1]
        profile.location = lat + ' ' + lng





