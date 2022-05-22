from django.contrib import auth
from django.http import JsonResponse
from django.shortcuts import redirect, HttpResponse
from django.shortcuts import render

from .models import Message, Room


def index(request):
    return render(request, 'chat/index.html')


def room(request, room_name):
    if request.user.is_authenticated:
        username = request.user.username
        messages = Message.objects.filter(room=room_name)
        user_id = request.user.id
        user_rooms = Room.objects.values_list('id', 'allowed_users')
        user_rooms = {str(room_number): allowed_users.split('|') for room_number, allowed_users in user_rooms}
        user_rooms = [key for key, vals in user_rooms.items() if str(user_id) in vals]
        return render(request, 'chat/room.html',
                      {'room_name': room_name, 'username': username, 'messages': messages, 'user_rooms': user_rooms,
                       'user_id': user_id})
    else:
        return redirect('messanger:index')


def ajax_login(request):
    next = ''
    if request.GET:
        next = request.GET['next']
    if request.method == 'POST':
        username = request.POST.get('username', 'anon')
        password = request.POST.get('password', '')
        room_name = request.POST.get('roomname', '')
        user = auth.authenticate(username=username, password=password)
        if user is not None:
            auth.login(request, user)
            if next != '':
                # return render(request, 'chat/room.html', {'room_name': room_name, 'username': user.username, 'password': user.password})
                return JsonResponse({'s': 'logined_next'}, status=200)
            else:
                return JsonResponse({'s': 'logined_done'}, status=200)
        else:
            login_error = 'Неправильный логин или пароль'
            return HttpResponse(login_error, status=400)
    else:
        return HttpResponse('Ошибка запроса', status=500)


def logout(request):
    auth.logout(request)
    return redirect('messanger:index')
