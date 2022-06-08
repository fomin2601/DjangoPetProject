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
        # iv = data['iv']
        is_important = data['isImportant']

        await self.save_message(username, room, message, is_important)

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'username': username,
                'is_important': is_important,
            }
        )

    # получение сообщения из комнаты группы, будет шифрование
    async def chat_message(self, event):
        message = event['message']
        username = event['username']
        # iv = event['iv']
        is_important = event['is_important']

        # Отправка сообщения в канал веб-сокета
        await self.send(text_data=json.dumps({
            'message': message,
            'username': username,
            # 'iv': iv,
            'isImportant': is_important
        }))

    @sync_to_async
    def save_message(self, username, room, message, is_important):
        Message.objects.create(username=username, room=room, content=message, is_important=is_important)


class SuperUserConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.user = self.scope['url_route']['kwargs']['user_name']
        self.user_room_name = f"notif_{self.room_name}_for_{self.user}"

        # Join connection to superuser
        await self.channel_layer.group_add(
            self.user_room_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Discinnect from superuser
        await self.channel_layer.group_discard(
            self.user_room_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        username = data['username']
        type_of_message = data['type']
        room = data['room']

        if type_of_message == 'from_user_to_superuser':
            public_key_rsa = data['publicKeyRSA']

            await self.channel_layer.group_send(
                self.user_room_name,
                {
                    'type': 'send_rsa_public_key_to_superuser',
                    'username': username,
                    'public_key_rsa': public_key_rsa,
                    'room': room,
                }
            )

        elif type_of_message == 'from_superuser_to_user':
            encrypted_aes_key = data['encryptionKeyAES']

            await self.channel_layer.group_send(
                self.user_room_name,
                {
                    'type': 'send_encrypted_aes_key_to_user',
                    'username': username,
                    'encrypted_aes_key': encrypted_aes_key,
                    'room': room,
                }
            )

    #Отправка ключа RSA суперпользователю
    async def send_rsa_public_key_to_superuser(self, event):
        public_key_rsa = event['public_key_rsa']
        username = event['username']
        room = event['room']
        # iv = event['iv']

        # Отправка сообщения в канал веб-сокета
        await self.send(text_data=json.dumps({
            'publicKeyRSA': public_key_rsa,
            'username': username,
            'room': room,
            # 'iv': iv,
        }))

    #Отправка зашифрованного ключа AES в ответ на запрос пользователя
    async def send_encrypted_aes_key_to_user(self, event):
        encrypted_aes_key = event['encrypted_aes_key']
        username = event['username']
        room = event['room']
        # iv = event['iv']

        # Отправка сообщения в канал веб-сокета
        await self.send(text_data=json.dumps({
            'encryptionKeyAES': encrypted_aes_key,
            'username': username,
            'room': room,
            # 'iv': iv,
        }))
