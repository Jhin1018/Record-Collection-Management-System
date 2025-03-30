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




class TestView(APIView):

    def get(self, request):
        result = {'code': 200, 'message': 'Test successful!'}
        return JsonResponse(result)