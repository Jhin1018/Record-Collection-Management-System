from django.urls import path
from . import views

urlpatterns = [

    path('/test01', views.TestView.as_view()),
    path('/genre-distribution', views.GenreDistributionView.as_view()),
    path('/collection-value', views.CollectionValueView.as_view()),
    path('/monthly-spending', views.MonthlySpendingView.as_view()),
    path('/price-comparison', views.PriceComparisonView.as_view()),

]