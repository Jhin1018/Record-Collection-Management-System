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
import requests
from Core_Configuration.models import User,Release,Collection,Artist,MasterRelease,Genre,ReleaseGenre,Wantlist

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



class ArtistView(APIView):
    """Artist CRUD operations"""
    
    def get(self, request):
        artists = list(Artist.objects.all().values('id', 'artist_name'))
        data = json.dumps(artists, cls=ComplexEncoder)
        res = {'code': 200, 'data': json.loads(data)}
        return JsonResponse(res)


class GenreView(APIView):
    """Genre CRUD operations"""
    
    def get(self, request):
        try:
            # Get all genres
            genres = list(Genre.objects.all().values('id', 'genre_name'))
            data = json.dumps(genres, cls=ComplexEncoder)
            res = {'code': 200, 'data': json.loads(data)}
            return JsonResponse(res)
        except Exception as e:
            return JsonResponse({
                'code': 500,
                'error': str(e)
            })


class ReleaseGenreView(APIView):
    """ReleaseGenre CRUD operations"""
    
    def get(self, request):
        try:
            # Get genre information for a specified release
            release_id = request.GET.get('release_id')
            if release_id:
                # If release_id is provided, get all genres for that release
                release_genres = ReleaseGenre.objects.filter(release_id=release_id).select_related('genre')
                data = []
                for rg in release_genres:
                    data.append({
                        'id': rg.id,
                        'release_id': rg.release_id,
                        'genre_id': rg.genre_id,
                        'genre_name': rg.genre.genre_name
                    })
                res = {'code': 200, 'data': data}
            else:
                # If no release_id is provided, get all release-genre relationships
                release_genres = ReleaseGenre.objects.all().select_related('release', 'genre')
                data = []
                for rg in release_genres:
                    data.append({
                        'id': rg.id,
                        'release_id': rg.release_id,
                        'release_title': rg.release.title,
                        'genre_id': rg.genre_id,
                        'genre_name': rg.genre.genre_name
                    })
                res = {'code': 200, 'data': data}
            
            return JsonResponse(res)
        except Exception as e:
            return JsonResponse({
                'code': 500,
                'error': str(e)
            })




