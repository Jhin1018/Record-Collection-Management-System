from django.shortcuts import render
from django.views import View
from django.http import JsonResponse, HttpResponse
from rest_framework import viewsets, serializers
from dateutil.parser import parse
from rest_framework.views import APIView
from django.db import connection
import json
import time
import hashlib
import datetime
from datetime import date, datetime
from Core_Configuration.models import User


class ComplexEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.strftime('%Y-%m-%d %H:%M:%S')
        elif isinstance(obj, date):
            return obj.strftime('%Y-%m-%d')
        else:
            return json.JSONEncoder.default(self, obj)

class TestView(APIView):

    def get(self, request):
        result = {'code': 200, 'message': 'Test successful!'}
        return JsonResponse(result)

class UserView(APIView):

    def post(self, request):
        json_str = request.body
        json_obj = json.loads(json_str)
        username = json_obj['username']
        password = json_obj['password']
        # Get email if exists, otherwise set to empty string
        email = json_obj.get('email', '')

        # Check if username already exists
        old_u = User.objects.filter(username=username)
        if old_u:
            result = {'code': 12001, 'error': 'Username already exists!'}
            return JsonResponse(result)

        # Hash password
        p_m = hashlib.md5()
        p_m.update(password.encode())
        password = p_m.hexdigest()

        # Create user with only username, password and email fields
        user = User.objects.create(
            username=username,
            password=password,
            email=email
        )
        result = {'code': 200, 'userid': user.id}
        return JsonResponse(result)

    def get(self, request):
        users = list(User.objects.all().values('id', 'username', 'email'))
        data = json.dumps(users, cls=ComplexEncoder)
        res = {'code': 200, 'data': json.loads(data)}
        return JsonResponse(res)

    def put(self, request):
        """Update user information"""
        try:
            json_str = request.body
            json_obj = json.loads(json_str)
            user_id = json_obj.get('user_id')
            new_username = json_obj.get('username')

            if not user_id:
                result = {'code': 400, 'error': 'user_id is required'}
                return JsonResponse(result)

            if not new_username:
                result = {'code': 400, 'error': 'username is required'}
                return JsonResponse(result)

            # Check if user exists
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                result = {'code': 404, 'error': 'User not found'}
                return JsonResponse(result)

            # Check if new username is the same as current username
            if user.username == new_username:
                result = {
                    'code': 200,
                    'message': 'Username unchanged',
                    'data': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email
                    }
                }
                return JsonResponse(result)

            # Check if new username is already taken by another user
            if User.objects.filter(username=new_username).exclude(id=user_id).exists():
                result = {'code': 400, 'error': 'username already exists'}
                return JsonResponse(result)

            # Update username
            user.username = new_username
            user.save()

            result = {
                'code': 200,
                'message': 'Username updated successfully',
                'data': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email
                }
            }
            return JsonResponse(result)
        except Exception as e:
            result = {'code': 500, 'error': str(e)}
            return JsonResponse(result)

# token
import json
import time
import datetime
from datetime import date, datetime
import jwt
import hashlib
from django.conf import settings


def make_token(username,role,id,expire=3600*24):

    key = settings.JWT_TOKEN_KEY
    now_t = time.time()
    payload_data = {'username':username,'id':id,'exp':now_t+expire}
    return jwt.encode(payload_data, key, algorithm='HS256')

# User Authentication
class user_tokenlogin(APIView):
    def post(self,request):
        json_str = request.body
        json_obj = json.loads(json_str)
        username = json_obj['username']
        password = json_obj['password']
        # Validate username and password
        try:
            user = User.objects.get(username=username)
        except Exception as e:
            result = {'code': 10201, 'error': 'Invalid username or password, please try again!'}
            return JsonResponse(result)

        p_m = hashlib.md5()
        p_m.update(password.encode())
        password = p_m.hexdigest()

        if password != user.password:
            result = {'code': 10202, 'error': 'Invalid username or password, please try again!'}
            return JsonResponse(result)

        user_id = user.id
        # Record session state
        token = make_token(username, None, user_id)
        result = {'code': 200, 'username': username, 'id':user_id, 'data': {'token': token}}
        return JsonResponse(result)


    def get(self,request):

        token = request.META.get('HTTP_AUTHORIZATION')
        if not token:
            result = {'code': 1403, 'error': 'Please login'}
            return JsonResponse(result)
        # Validate token
        try:
            res = jwt.decode(token,settings.JWT_TOKEN_KEY,algorithms='HS256')
        except Exception as e:
            print('jwt decode error is %s' % (e),flush=True)
            result = {'code': 2403, 'error': 'You are currently not logged in, please proceed to login!'} # Failed, code 403 error: Please login
            return JsonResponse(result)

        result = {'code': 200,'message': 'Login successful!','res':res}
        return JsonResponse(result)