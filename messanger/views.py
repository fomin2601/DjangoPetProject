from django.contrib import auth
from django.http import JsonResponse
from django.shortcuts import redirect, HttpResponse
from django.shortcuts import render

from .models import Message, Room
from django.contrib.auth.models import User


def index(request):
    return render(request, 'chat/index.html')


def room(request, room_name):
    if request.user.is_authenticated:
        username = request.user.username
        messages = Message.objects.filter(room=room_name)
        user = request.user.username
        user_rooms = Room.objects.values_list('id', 'allowed_users')
        user_rooms = {str(room_number): allowed_users.split('|') for room_number, allowed_users in user_rooms}
        user_rooms = [key for key, vals in user_rooms.items() if str(user) in vals]
        all_users = User.objects.values('username')
        super_user = Room.objects.filter(room=room_name)
        # all_users = [u_name for u_name in all_users]
        return render(request, 'chat/room.html',
                      {'room_name': room_name, 'username': username, 'messages': messages, 'user_rooms': user_rooms,
                       'all_users': all_users, 'superuser': super_user})
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
                #  return render(request, 'chat/room.html', {'room_name': room_name, 'username': user.username, 'password': user.password})
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


def ajax_new_room(request):
    if request.method == 'POST':
        new_room_users = request.POST.get('userNewRoom')
        new_room_number = request.POST.get('newRoom')
        if Room.objects.filter(room=new_room_number):
            return JsonResponse({'error_message': 'Room already exist'}, status=403)
        else:
            new_room = Room(room=new_room_number, host_user=User.objects.get(id=request.user.id),
                            allowed_users=new_room_users)
            new_room.save()
            return JsonResponse({'success_message': f'Room {new_room_number} created'}, status=200)
    else:
        return JsonResponse({'error_message': 'Why are you using GET-request???'}, status=403)


def ajax_add_user_to_room(request):
    if request.method == 'POST':
        new_user = request.POST.get('newUser')
        updating_room = Room.objects.get(room=request.POST.get('room'))
        new_user = list(filter(lambda x: x not in updating_room.allowed_users, new_user.split('|')))
        new_user = '|'.join(new_user)
        updating_room.allowed_users = '|'.join([updating_room.allowed_users, new_user])
        updating_room.save()
        return JsonResponse({'success_message': 'User(s) added'}, status=200)
    else:
        return JsonResponse({'error_message': 'Why are you using GET-request???'}, status=403)
