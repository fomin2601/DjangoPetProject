from django.urls import path

from . import consumers

websocket_urlpatterns = [
    path('ws/messanger/<str:room_name>/', consumers.ChatConsumer.as_asgi()),
    path('ws/messanger/<str:room_name>/<str:user_name>/', consumers.SuperUserConsumer.as_asgi()),
]