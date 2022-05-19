from django.urls import path

from . import views

app_name = 'messanger'

urlpatterns = [
    path('', views.index, name='index'),
    path('<int:room_name>/', views.room, name='room'),
    path('ajax_login/', views.ajax_login, name='ajax_login'),
    path('logout/', views.logout, name='logout')
]