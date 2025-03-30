from django.shortcuts import render
from django.views import View
from django.http import JsonResponse, HttpResponse
from rest_framework import viewsets, serializers
from dateutil.parser import parse
from rest_framework.views import APIView
from django.db import connection
from django.db.models import Sum, Count, F
from django.db.models.functions import Coalesce
import json
import time
import hashlib
import datetime
from datetime import date, datetime
import requests
from Core_Configuration.models import User,Release,Collection,Artist,MasterRelease,Genre,ReleaseGenre,Wantlist


class TestView(APIView):

    def get(self, request):
        result = {'code': 200, 'message': 'Test successful!'}
        return JsonResponse(result)

class GenreDistributionView(APIView):
    """Statistics of collection distribution by genre"""
    def get(self, request):
        try:
            user_id = request.GET.get('user_id')
            if not user_id:
                return JsonResponse({
                    'code': 400,
                    'error': 'user_id is required'
                })

            # Check if the user exists
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return JsonResponse({
                    'code': 404,
                    'error': 'User not found'
                })

            # Use annotate and values to optimize the query
            genre_stats = Collection.objects.filter(
                user_id=user_id
            ).values(
                'release__releasegenre__genre__genre_name'
            ).annotate(
                count=Sum('quantity')
            ).filter(
                release__releasegenre__genre__genre_name__isnull=False
            ).order_by('-count')

            return JsonResponse({
                'code': 200,
                'data': {
                    'labels': [stat['release__releasegenre__genre__genre_name'] for stat in genre_stats],
                    'data': [float(stat['count']) for stat in genre_stats]
                }
            })

        except Exception as e:
            return JsonResponse({
                'code': 500,
                'error': str(e)
            })

class CollectionValueView(APIView):
    """Estimate the total value of the collection"""
    def get(self, request):
        try:
            user_id = request.GET.get('user_id')
            if not user_id:
                return JsonResponse({
                    'code': 400,
                    'error': 'user_id is required'
                })

            # Check if the user exists
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return JsonResponse({
                    'code': 404,
                    'error': 'User not found'
                })

            # Calculate the total value of the collection
            collections = Collection.objects.filter(user_id=user_id)
            total_value = sum(
                collection.purchase_price * collection.quantity 
                for collection in collections
            )

            return JsonResponse({
                'code': 200,
                'data': {
                    'total_value': str(total_value),
                    'currency': 'CAD'
                }
            })

        except Exception as e:
            return JsonResponse({
                'code': 500,
                'error': str(e)
            })
