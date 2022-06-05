from django.urls import path

from . import views

app_name = 'messanger'

urlpatterns = [
    path('', views.index, name='index'),
    path('<str:room_name>/', views.room, name='room'),
    path('ajax_login/', views.ajax_login, name='ajax_login'),
    path('logout/', views.logout, name='logout'),
    path('ajax_new_room/', views.ajax_new_room, name='ajax_new_room'),
    path('ajax_add_user_to_room/', views.ajax_add_user_to_room, name='ajax_add_user_to_room'),
]