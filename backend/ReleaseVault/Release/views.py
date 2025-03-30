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



class TestView(APIView):

    def get(self, request):
        result = {'code': 200, 'message': 'Test successful!'}
        return JsonResponse(result)


class ReleaseView(APIView):
    def post(self, request):
        """Get release information for specified release_id"""
        json_str = request.body
        json_obj = json.loads(json_str)
        release_id = json_obj['release_id']
        try:
            # Discogs API configuration
            token = "AnMRkqJdiLfntPkAAfXAwObkxZCLVTgmXSncRdPt"
            headers = {
                'Authorization': f'Discogs token={token}',
                'User-Agent': 'ReleaseVault/1.0'
            }
            
            # Build API URL
            url = f'https://api.discogs.com/releases/{release_id}'
            params = {
                'curr_abbr': 'CAD'  # Use CAD as currency
            }
            
            # Send request
            response = requests.get(url, headers=headers, params=params)
            
            # Check response status
            if response.status_code == 200:
                data = response.json()
                return JsonResponse({
                    'code': 200,
                    'data': data
                })
            else:
                return JsonResponse({
                    'code': response.status_code,
                    'error': f'API request failed: {response.text}'
                })
                
        except Exception as e:
            return JsonResponse({
                'code': 500,
                'error': str(e)
            })


    def get(self, request):
        result = {'code': 200, 'message': 'Test successful!'}
        return JsonResponse(result)


class ReleaseView2(APIView):
    def post(self, request):
        """Get release information for specified release_id and save to database"""
        json_str = request.body
        json_obj = json.loads(json_str)
        release_id = json_obj['release_id']
        try:
            # Discogs API configuration
            token = "AnMRkqJdiLfntPkAAfXAwObkxZCLVTgmXSncRdPt"
            headers = {
                'Authorization': f'Discogs token={token}',
                'User-Agent': 'ReleaseVault/1.0'
            }

            # Build API URL
            url = f'https://api.discogs.com/releases/{release_id}'
            params = {
                'curr_abbr': 'CAD'  # Use CAD as currency
            }

            # Send request
            response = requests.get(url, headers=headers, params=params)

            # Check response status
            if response.status_code == 200:
                data = response.json()
                
                # 1. Process artist information
                artist_data = data.get('artists', [{}])[0]  # Get first artist
                artist_id = artist_data.get('id')
                artist_name = artist_data.get('name', '')
                
                # Check if artist exists, create if not
                artist, created = Artist.objects.get_or_create(
                    id=artist_id,
                    defaults={'artist_name': artist_name}
                )
                
                # 2. Process Master Release information
                master_id = data.get('master_id')
                master_release = None
                if master_id:
                    # Check if Master Release exists, create if not
                    master_release, created = MasterRelease.objects.get_or_create(
                        id=master_id,
                        defaults={
                            'title': data.get('title', ''),
                            'artist': artist
                        }
                    )
                
                # 3. Create Release record
                release, created = Release.objects.get_or_create(
                    id=release_id,
                    defaults={
                        'title': data.get('title', ''),
                        'release_year': data.get('year'),
                        'format': data.get('formats', [{}])[0].get('name', 'Vinyl'),
                        'cover_url': data.get('thumb', ''),
                        'artist': artist,
                        'master': master_release,
                        'discogs_id': release_id
                    }
                )

                # 4. Process genre information
                genres = data.get('genres', [])
                for genre_name in genres:
                    # Check if genre exists, create if not
                    genre, created = Genre.objects.get_or_create(
                        genre_name=genre_name
                    )
                    
                    # Check if Release and Genre association exists, create if not
                    ReleaseGenre.objects.get_or_create(
                        release=release,
                        genre=genre
                    )
                
                return JsonResponse({
                    'code': 200,
                    'data': {
                        'release_id': release.id,
                        'title': release.title,
                        'artist': artist.artist_name,
                        'year': release.release_year,
                        'format': release.format,
                        'master_id': master_id,
                        'genres': genres
                    }
                })
            else:
                return JsonResponse({
                    'code': response.status_code,
                    'error': f'API request failed: {response.text}'
                })

        except Exception as e:
            return JsonResponse({
                'code': 500,
                'error': str(e)
            })

    def get(self, request):
        result = {'code': 200, 'message': 'Test successful!'}
        return JsonResponse(result)


class CollectionView(APIView):
    def post(self, request):
        """Add release to collection"""
        try:
            json_str = request.body
            json_obj = json.loads(json_str)
            release_id = json_obj['release_id']
            user_id = json_obj['user_id']
            quantity = json_obj.get('quantity', 1)
            purchase_price = json_obj.get('purchase_price', 0.00)
            description = json_obj.get('description', '')
            purchase_date = json_obj.get('purchase_date')  # Optional, format: YYYY-MM-DD HH:MM:SS

            # 1. Get or create user
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return JsonResponse({
                    'code': 404,
                    'error': 'User not found'
                })

            # 2. Check if already collected
            existing_collection = Collection.objects.filter(
                user_id=user_id,
                release_id=release_id
            ).first()

            if existing_collection:
                return JsonResponse({
                    'code': 400,
                    'error': 'You have already collected this release',
                    'data': {
                        'collection_id': existing_collection.id,
                        'release': {
                            'id': existing_collection.release.id,
                            'title': existing_collection.release.title,
                            'artist': existing_collection.release.artist.artist_name,
                            'year': existing_collection.release.release_year,
                            'format': existing_collection.release.format
                        },
                        'quantity': existing_collection.quantity,
                        'purchase_price': str(existing_collection.purchase_price),
                        'purchase_date': existing_collection.purchase_date.strftime('%Y-%m-%d %H:%M:%S'),
                        'description': existing_collection.description
                    }
                })

            # 3. Get Discogs API data
            token = "AnMRkqJdiLfntPkAAfXAwObkxZCLVTgmXSncRdPt"
            headers = {
                'Authorization': f'Discogs token={token}',
                'User-Agent': 'ReleaseVault/1.0'
            }
            url = f'https://api.discogs.com/releases/{release_id}'
            params = {'curr_abbr': 'CAD'}
            response = requests.get(url, headers=headers, params=params)

            if response.status_code != 200:
                return JsonResponse({
                    'code': response.status_code,
                    'error': f'API request failed: {response.text}'
                })

            data = response.json()

            # 4. Process artist information
            artist_data = data.get('artists', [{}])[0]
            artist_id = artist_data.get('id')
            artist_name = artist_data.get('name', '')
            
            artist, created = Artist.objects.get_or_create(
                id=artist_id,
                defaults={'artist_name': artist_name}
            )

            # 5. Process Master Release information
            master_id = data.get('master_id')
            master_release = None
            if master_id:
                master_release, created = MasterRelease.objects.get_or_create(
                    id=master_id,
                    defaults={
                        'title': data.get('title', ''),
                        'artist': artist
                    }
                )

            # 6. Create or get Release record
            release, created = Release.objects.get_or_create(
                id=release_id,
                defaults={
                    'title': data.get('title', ''),
                    'release_year': data.get('year'),
                    'format': data.get('formats', [{}])[0].get('name', 'Vinyl'),
                    'cover_url': data.get('thumb', ''),
                    'artist': artist,
                    'master': master_release,
                    'discogs_id': release_id
                }
            )

            # 7. Process genre information
            genres = data.get('genres', [])
            for genre_name in genres:
                # Check if genre exists, create if not
                genre, created = Genre.objects.get_or_create(
                    genre_name=genre_name
                )
                
                # Check if Release and Genre association exists, create if not
                ReleaseGenre.objects.get_or_create(
                    release=release,
                    genre=genre
                )

            # 8. Create collection record
            collection_data = {
                'user': user,
                'release': release,
                'quantity': quantity,
                'purchase_price': purchase_price,
                'description': description
            }

            # If purchase date provided, use provided date
            if purchase_date:
                try:
                    collection_data['purchase_date'] = datetime.strptime(purchase_date, '%Y-%m-%d %H:%M:%S')
                except ValueError:
                    return JsonResponse({
                        'code': 400,
                        'error': 'Invalid purchase_date format. Use YYYY-MM-DD HH:MM:SS'
                    })

            collection = Collection.objects.create(**collection_data)

            return JsonResponse({
                'code': 200,
                'data': {
                    'collection_id': collection.id,
                    'release': {
                        'id': release.id,
                        'title': release.title,
                        'artist': artist.artist_name,
                        'year': release.release_year,
                        'format': release.format,
                        'genres': genres
                    },
                    'quantity': collection.quantity,
                    'purchase_price': str(collection.purchase_price),
                    'purchase_date': collection.purchase_date.strftime('%Y-%m-%d %H:%M:%S'),
                    'description': collection.description
                }
            })

        except Exception as e:
            return JsonResponse({
                'code': 500,
                'error': str(e)
            })

    def get(self, request):
        """Get user's collection list"""
        try:
            user_id = request.GET.get('user_id')
            if not user_id:
                return JsonResponse({
                    'code': 400,
                    'error': 'user_id is required'
                })

            # Check if user exists
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return JsonResponse({
                    'code': 404,
                    'error': 'User not found'
                })

            # Get user's collection list, optimize query with select_related
            collections = Collection.objects.filter(user_id=user_id).select_related(
                'release', 
                'release__artist'
            ).prefetch_related(
                'release__releasegenre_set__genre'
            ).order_by('-purchase_date')

            data = []
            for collection in collections:
                # Get release genre information
                genres = [
                    rg.genre.genre_name 
                    for rg in collection.release.releasegenre_set.all()
                ]

                data.append({
                    'collection_id': collection.id,
                    'release': {
                        'id': collection.release.id,
                        'title': collection.release.title,
                        'artist': collection.release.artist.artist_name if collection.release.artist else None,
                        'year': collection.release.release_year,
                        'format': collection.release.format,
                        'cover_url': collection.release.cover_url,
                        'genres': genres
                    },
                    'quantity': collection.quantity,
                    'purchase_price': str(collection.purchase_price),
                    'purchase_date': collection.purchase_date.strftime('%Y-%m-%d %H:%M:%S'),
                    'description': collection.description
                })

            return JsonResponse({
                'code': 200,
                'data': data
            })

        except Exception as e:
            return JsonResponse({
                'code': 500,
                'error': str(e)
            })

    def delete(self, request):
        """Remove from collection"""
        try:
            json_str = request.body
            json_obj = json.loads(json_str)
            user_id = json_obj.get('user_id')
            collection_id = json_obj.get('collection_id')

            # Validate required parameters
            if not user_id or not collection_id:
                return JsonResponse({
                    'code': 400,
                    'error': 'user_id and collection_id are required'
                })

            # Check if user exists
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return JsonResponse({
                    'code': 404,
                    'error': 'User not found'
                })

            # Check if collection record exists and belongs to user
            try:
                collection = Collection.objects.get(id=collection_id, user_id=user_id)
                # Save collection info for return
                collection_info = {
                    'collection_id': collection.id,
                    'release': {
                        'id': collection.release.id,
                        'title': collection.release.title,
                        'artist': collection.release.artist.artist_name if collection.release.artist else None,
                        'year': collection.release.release_year,
                        'format': collection.release.format
                    },
                    'quantity': collection.quantity,
                    'purchase_price': str(collection.purchase_price),
                    'purchase_date': collection.purchase_date.strftime('%Y-%m-%d %H:%M:%S'),
                    'description': collection.description
                }
                # Delete collection record
                collection.delete()
                return JsonResponse({
                    'code': 200,
                    'message': 'Collection removed successfully',
                    'data': collection_info
                })
            except Collection.DoesNotExist:
                return JsonResponse({
                    'code': 404,
                    'error': 'Collection not found or does not belong to this user'
                })

        except Exception as e:
            return JsonResponse({
                'code': 500,
                'error': str(e)
            })

    def put(self, request):
        """Update collection record information"""
        try:
            json_str = request.body
            json_obj = json.loads(json_str)
            user_id = json_obj.get('user_id')
            collection_id = json_obj.get('collection_id')
            quantity = json_obj.get('quantity')
            purchase_price = json_obj.get('purchase_price')
            purchase_date = json_obj.get('purchase_date')
            description = json_obj.get('description')

            # Validate required parameters
            if not user_id or not collection_id:
                return JsonResponse({
                    'code': 400,
                    'error': 'user_id and collection_id are required'
                })

            # Check if user exists
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return JsonResponse({
                    'code': 404,
                    'error': 'User not found'
                })

            # Check if collection record exists and belongs to user
            try:
                collection = Collection.objects.get(id=collection_id, user_id=user_id)
                
                # Update fields (only update provided fields)
                if quantity is not None:
                    collection.quantity = quantity
                if purchase_price is not None:
                    collection.purchase_price = purchase_price
                if purchase_date is not None:
                    try:
                        collection.purchase_date = datetime.strptime(purchase_date, '%Y-%m-%d %H:%M:%S')
                    except ValueError:
                        return JsonResponse({
                            'code': 400,
                            'error': 'Invalid purchase_date format. Use YYYY-MM-DD HH:MM:SS'
                        })
                if description is not None:
                    collection.description = description

                # Save updates
                collection.save()

                # Get updated collection info
                collection_info = {
                    'collection_id': collection.id,
                    'release': {
                        'id': collection.release.id,
                        'title': collection.release.title,
                        'artist': collection.release.artist.artist_name if collection.release.artist else None,
                        'year': collection.release.release_year,
                        'format': collection.release.format
                    },
                    'quantity': collection.quantity,
                    'purchase_price': str(collection.purchase_price),
                    'purchase_date': collection.purchase_date.strftime('%Y-%m-%d %H:%M:%S'),
                    'description': collection.description
                }

                return JsonResponse({
                    'code': 200,
                    'message': 'Collection updated successfully',
                    'data': collection_info
                })

            except Collection.DoesNotExist:
                return JsonResponse({
                    'code': 404,
                    'error': 'Collection not found or does not belong to this user'
                })

        except Exception as e:
            return JsonResponse({
                'code': 500,
                'error': str(e)
            })

class WantlistView(APIView):
    def post(self, request):
        """Add release to wantlist"""
        try:
            json_str = request.body
            json_obj = json.loads(json_str)
            release_id = json_obj['release_id']
            user_id = json_obj['user_id']
            note = json_obj.get('note', '')  # Optional note

            # 1. Get or create user
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return JsonResponse({
                    'code': 404,
                    'error': 'User not found'
                })

            # 2. Check if already in wantlist
            existing_wantlist = Wantlist.objects.filter(
                user_id=user_id,
                release_id=release_id
            ).first()

            if existing_wantlist:
                return JsonResponse({
                    'code': 400,
                    'error': 'This release is already in your wantlist',
                    'data': {
                        'wantlist_id': existing_wantlist.id,
                        'release': {
                            'id': existing_wantlist.release.id,
                            'title': existing_wantlist.release.title,
                            'artist': existing_wantlist.release.artist.artist_name,
                            'year': existing_wantlist.release.release_year,
                            'format': existing_wantlist.release.format
                        },
                        'note': existing_wantlist.note,
                        'added_date': existing_wantlist.added_date.strftime('%Y-%m-%d %H:%M:%S')
                    }
                })

            # 3. Get Discogs API data
            token = "AnMRkqJdiLfntPkAAfXAwObkxZCLVTgmXSncRdPt"
            headers = {
                'Authorization': f'Discogs token={token}',
                'User-Agent': 'ReleaseVault/1.0'
            }
            url = f'https://api.discogs.com/releases/{release_id}'
            params = {'curr_abbr': 'CAD'}
            response = requests.get(url, headers=headers, params=params)

            if response.status_code != 200:
                return JsonResponse({
                    'code': response.status_code,
                    'error': f'API request failed: {response.text}'
                })

            data = response.json()

            # 4. Process artist information
            artist_data = data.get('artists', [{}])[0]
            artist_id = artist_data.get('id')
            artist_name = artist_data.get('name', '')
            
            artist, created = Artist.objects.get_or_create(
                id=artist_id,
                defaults={'artist_name': artist_name}
            )

            # 5. Process Master Release information
            master_id = data.get('master_id')
            master_release = None
            if master_id:
                master_release, created = MasterRelease.objects.get_or_create(
                    id=master_id,
                    defaults={
                        'title': data.get('title', ''),
                        'artist': artist
                    }
                )

            # 6. Create or get Release record
            release, created = Release.objects.get_or_create(
                id=release_id,
                defaults={
                    'title': data.get('title', ''),
                    'release_year': data.get('year'),
                    'format': data.get('formats', [{}])[0].get('name', 'Vinyl'),
                    'cover_url': data.get('thumb', ''),
                    'artist': artist,
                    'master': master_release,
                    'discogs_id': release_id
                }
            )

            # 7. Process genre information
            genres = data.get('genres', [])
            for genre_name in genres:
                # Check if genre exists, create if not
                genre, created = Genre.objects.get_or_create(
                    genre_name=genre_name
                )
                
                # Check if Release and Genre association exists, create if not
                ReleaseGenre.objects.get_or_create(
                    release=release,
                    genre=genre
                )

            # 8. Create wantlist record
            wantlist = Wantlist.objects.create(
                user=user,
                release=release,
                note=note
            )

            return JsonResponse({
                'code': 200,
                'data': {
                    'wantlist_id': wantlist.id,
                    'release': {
                        'id': release.id,
                        'title': release.title,
                        'artist': artist.artist_name,
                        'year': release.release_year,
                        'format': release.format,
                        'genres': genres
                    },
                    'note': wantlist.note,
                    'added_date': wantlist.added_date.strftime('%Y-%m-%d %H:%M:%S')
                }
            })

        except Exception as e:
            return JsonResponse({
                'code': 500,
                'error': str(e)
            })

    def get(self, request):
        """Get user's wantlist"""
        try:
            user_id = request.GET.get('user_id')
            if not user_id:
                return JsonResponse({
                    'code': 400,
                    'error': 'user_id is required'
                })

            # Check if user exists
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return JsonResponse({
                    'code': 404,
                    'error': 'User not found'
                })

            # Get user's wantlist, optimize query with select_related
            wantlists = Wantlist.objects.filter(user_id=user_id).select_related(
                'release', 
                'release__artist',
                'user'
            ).prefetch_related(
                'release__releasegenre_set__genre'
            ).order_by('-added_date')

            data = []
            for wantlist in wantlists:
                # Get release genre information
                genres = [
                    rg.genre.genre_name 
                    for rg in wantlist.release.releasegenre_set.all()
                ]

                data.append({
                    'wantlist_id': wantlist.id,
                    'user': {
                        'id': wantlist.user.id,
                        'username': wantlist.user.username,
                        'email': wantlist.user.email
                    },
                    'release': {
                        'id': wantlist.release.id,
                        'title': wantlist.release.title,
                        'artist': wantlist.release.artist.artist_name if wantlist.release.artist else None,
                        'year': wantlist.release.release_year,
                        'format': wantlist.release.format,
                        'cover_url': wantlist.release.cover_url,
                        'genres': genres
                    },
                    'note': wantlist.note,
                    'added_date': wantlist.added_date.strftime('%Y-%m-%d %H:%M:%S')
                })

            return JsonResponse({
                'code': 200,
                'data': data
            })

        except Exception as e:
            return JsonResponse({
                'code': 500,
                'error': str(e)
            })

    def put(self, request):
        """Move wantlist item to collection"""
        try:
            json_str = request.body
            json_obj = json.loads(json_str)
            wantlist_id = json_obj.get('wantlist_id')
            user_id = json_obj.get('user_id')
            quantity = json_obj.get('quantity', 1)
            purchase_price = json_obj.get('purchase_price', 0.00)
            purchase_date = json_obj.get('purchase_date')
            description = json_obj.get('description', '')

            # Validate required parameters
            if not wantlist_id or not user_id:
                return JsonResponse({
                    'code': 400,
                    'error': 'wantlist_id and user_id are required'
                })

            # Check if user exists
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return JsonResponse({
                    'code': 404,
                    'error': 'User not found'
                })

            # Check if wantlist item exists and belongs to user
            try:
                wantlist = Wantlist.objects.get(id=wantlist_id, user_id=user_id)
                
                # Check if already collected
                existing_collection = Collection.objects.filter(
                    user_id=user_id,
                    release_id=wantlist.release.id
                ).first()

                if existing_collection:
                    return JsonResponse({
                        'code': 400,
                        'error': 'You have already collected this release',
                        'data': {
                            'collection_id': existing_collection.id,
                            'release': {
                                'id': existing_collection.release.id,
                                'title': existing_collection.release.title,
                                'artist': existing_collection.release.artist.artist_name,
                                'year': existing_collection.release.release_year,
                                'format': existing_collection.release.format
                            }
                        }
                    })

                # Create collection record
                collection_data = {
                    'user': user,
                    'release': wantlist.release,
                    'quantity': quantity,
                    'purchase_price': purchase_price,
                    'description': description
                }

                # If purchase date provided, use provided date
                if purchase_date:
                    try:
                        collection_data['purchase_date'] = datetime.strptime(purchase_date, '%Y-%m-%d %H:%M:%S')
                    except ValueError:
                        return JsonResponse({
                            'code': 400,
                            'error': 'Invalid purchase_date format. Use YYYY-MM-DD HH:MM:SS'
                        })

                # Create collection record
                collection = Collection.objects.create(**collection_data)

                # Delete wantlist record
                wantlist.delete()

                return JsonResponse({
                    'code': 200,
                    'message': 'Release moved from wantlist to collection successfully',
                    'data': {
                        'collection_id': collection.id,
                        'release': {
                            'id': collection.release.id,
                            'title': collection.release.title,
                            'artist': collection.release.artist.artist_name if collection.release.artist else None,
                            'year': collection.release.release_year,
                            'format': collection.release.format
                        },
                        'quantity': collection.quantity,
                        'purchase_price': str(collection.purchase_price),
                        'purchase_date': collection.purchase_date.strftime('%Y-%m-%d %H:%M:%S'),
                        'description': collection.description
                    }
                })

            except Wantlist.DoesNotExist:
                return JsonResponse({
                    'code': 404,
                    'error': 'Wantlist item not found or does not belong to this user'
                })

        except Exception as e:
            return JsonResponse({
                'code': 500,
                'error': str(e)
            })

    def delete(self, request):
        """Remove from wantlist"""
        try:
            json_str = request.body
            json_obj = json.loads(json_str)
            user_id = json_obj.get('user_id')
            wantlist_id = json_obj.get('wantlist_id')

            # Validate required parameters
            if not user_id or not wantlist_id:
                return JsonResponse({
                    'code': 400,
                    'error': 'user_id and wantlist_id are required'
                })

            # Check if user exists
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return JsonResponse({
                    'code': 404,
                    'error': 'User not found'
                })

            # Check if wantlist record exists and belongs to user
            try:
                wantlist = Wantlist.objects.get(id=wantlist_id, user_id=user_id)
                # Save wantlist info for response
                wantlist_info = {
                    'wantlist_id': wantlist.id,
                    'release': {
                        'id': wantlist.release.id,
                        'title': wantlist.release.title,
                        'artist': wantlist.release.artist.artist_name if wantlist.release.artist else None,
                        'year': wantlist.release.release_year,
                        'format': wantlist.release.format
                    },
                    'note': wantlist.note,
                    'added_date': wantlist.added_date.strftime('%Y-%m-%d %H:%M:%S')
                }
                # Delete wantlist record
                wantlist.delete()
                return JsonResponse({
                    'code': 200,
                    'message': 'Wantlist item removed successfully',
                    'data': wantlist_info
                })
            except Wantlist.DoesNotExist:
                return JsonResponse({
                    'code': 404,
                    'error': 'Wantlist item not found or does not belong to this user'
                })

        except Exception as e:
            return JsonResponse({
                'code': 500,
                'error': str(e)
            })