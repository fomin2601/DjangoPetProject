import json

from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

from .models import Message, Room


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name

        # Join room
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        self.user = Room.objects.filter(room=self.room_name).values('host_user')[0]['host_user']
        print(self.user)
        self.user_room_name = f"notif_{self.room_name}_for_superuser"

        # Notification room name
        await self.channel_layer.group_add(
            self.user_room_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # получение сообщения из веб-сокета, будет дешифр.
    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']
        username = data['username']
        room = data['room']
        iv = data['iv']
        userNewRoom = data['userNewRoom']  # Список новых пользователей в группе с разделителем "|"
        newRoom = data['newRoom']
        rq = data['rq']
        usernameSuper = data['usernameSuper']
        publicKeyRSA = data['publicKeyRSA']
        encryptionKeyAES = data['encryptionKeyAES']

        await self.save_message(username, room, message)

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'username': username
            }
        )

    # получение сообщения из комнаты группы, будет шифрование
    async def chat_message(self, event):
        message = event['message']
        username = event['username']
        iv = event['iv']

        # Отправка сообщения в канал веб-сокета
        await self.send(text_data=json.dumps({
            'message': message,
            'username': username,
            'iv': iv
        }))

    @sync_to_async
    def save_message(self, username, room, message):
        Message.objects.create(username=username, room=room, content=message)
