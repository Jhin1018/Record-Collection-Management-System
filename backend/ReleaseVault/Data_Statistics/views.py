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

            # Get all collections for the user with their genres
            collections = Collection.objects.filter(
                user_id=user_id
            ).select_related(
                'release'
            ).prefetch_related(
                'release__releasegenre_set__genre'
            )

            # Calculate genre distribution
            genre_counts = {}
            for collection in collections:
                # Get all genres for this release
                genres = collection.release.releasegenre_set.all()
                
                # Add full quantity to each genre
                for genre in genres:
                    genre_name = genre.genre.genre_name
                    genre_counts[genre_name] = genre_counts.get(genre_name, 0) + collection.quantity

            # Convert to sorted list
            sorted_genres = sorted(
                genre_counts.items(),
                key=lambda x: x[1],
                reverse=True
            )

            return JsonResponse({
                'code': 200,
                'data': {
                    'labels': [genre for genre, _ in sorted_genres],
                    'data': [float(count) for _, count in sorted_genres]
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

class MonthlySpendingView(APIView):
    """Statistics of monthly spending trends"""
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

            # Use raw SQL to get monthly spending
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT 
                        DATE_FORMAT(purchase_date, '%%Y-%%m') AS month,
                        SUM(quantity * purchase_price) AS total_spent
                    FROM collection
                    WHERE user_id = %s
                    AND purchase_date IS NOT NULL
                    GROUP BY DATE_FORMAT(purchase_date, '%%Y-%%m')
                    ORDER BY month ASC
                """, [user_id])
                
                # Fetch results
                results = cursor.fetchall()
                
                # Process results
                labels = []
                data = []
                for month, total_spent in results:
                    labels.append(month)
                    data.append(float(total_spent))

            return JsonResponse({
                'code': 200,
                'data': {
                    'labels': labels,
                    'data': data
                }
            })

        except Exception as e:
            return JsonResponse({
                'code': 500,
                'error': str(e)
            })

class PriceComparisonView(APIView):
    """Compare purchase prices with current market prices"""
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

            # Get current time
            current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

            # Get user's collections with release information
            collections = Collection.objects.filter(
                user_id=user_id
            ).select_related(
                'release'
            )

            # Prepare response data
            price_comparisons = []
            token = "AnMRkqJdiLfntPkAAfXAwObkxZCLVTgmXSncRdPt"
            headers = {
                'Authorization': f'Discogs token={token}',
                'User-Agent': 'ReleaseVault/1.0'
            }

            for collection in collections:
                # Get release information from Discogs API using release.discogs_id
                if not collection.release.discogs_id:
                    # If discogs_id is not set, skip this release
                    price_comparisons.append({
                        'release_id': collection.release.id,
                        'title': collection.release.title,
                        'purchase_price': round(float(collection.purchase_price), 2),
                        'quantity': collection.quantity,
                        'purchase_date': collection.purchase_date.strftime('%Y-%m-%d %H:%M:%S') if collection.purchase_date else None,
                        'market_price_cad': 0.00,
                        'estimated_value': 0.00,
                        'total_spent': round(float(collection.purchase_price * collection.quantity), 2),
                        'gain_loss': round(-float(collection.purchase_price * collection.quantity), 2),
                        'request_time': current_time,
                        'error': 'No Discogs ID available'
                    })
                    continue

                url = f'https://api.discogs.com/releases/{collection.release.discogs_id}'
                response = requests.get(url, headers=headers)

                if response.status_code == 200:
                    release_data = response.json()
                    # Get the lowest price from the marketplace (already in CAD)
                    lowest_price = release_data.get('lowest_price')
                    if lowest_price is not None:
                        try:
                            market_price_cad = round(float(lowest_price), 2)
                        except (ValueError, TypeError):
                            market_price_cad = 0.00
                    else:
                        market_price_cad = 0.00

                    # Calculate values
                    purchase_price = round(float(collection.purchase_price), 2)
                    total_spent = round(purchase_price * collection.quantity, 2)
                    estimated_value = round(market_price_cad * collection.quantity, 2)
                    gain_loss = round(estimated_value - total_spent, 2)

                    price_comparisons.append({
                        'release_id': collection.release.id,
                        'title': collection.release.title,
                        'purchase_price': purchase_price,
                        'quantity': collection.quantity,
                        'purchase_date': collection.purchase_date.strftime('%Y-%m-%d %H:%M:%S') if collection.purchase_date else None,
                        'market_price_cad': market_price_cad,
                        'estimated_value': estimated_value,
                        'total_spent': total_spent,
                        'gain_loss': gain_loss,
                        'request_time': current_time,
                        'num_for_sale': release_data.get('num_for_sale', 0),
                        'community_have': release_data.get('community', {}).get('have', 0),
                        'community_want': release_data.get('community', {}).get('want', 0)
                    })
                else:
                    # If API request fails, still include the collection with market price as 0
                    purchase_price = round(float(collection.purchase_price), 2)
                    total_spent = round(purchase_price * collection.quantity, 2)
                    price_comparisons.append({
                        'release_id': collection.release.id,
                        'title': collection.release.title,
                        'purchase_price': purchase_price,
                        'quantity': collection.quantity,
                        'purchase_date': collection.purchase_date.strftime('%Y-%m-%d %H:%M:%S') if collection.purchase_date else None,
                        'market_price_cad': 0.00,
                        'estimated_value': 0.00,
                        'total_spent': total_spent,
                        'gain_loss': round(-total_spent, 2),
                        'request_time': current_time,
                        'error': f'API request failed: {response.text}'
                    })

            return JsonResponse({
                'code': 200,
                'data': price_comparisons
            })

        except Exception as e:
            return JsonResponse({
                'code': 500,
                'error': str(e)
            })
