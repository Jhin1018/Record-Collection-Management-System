from django.urls import path
from . import views

urlpatterns = [

    path('/test01', views.TestView.as_view()),
    path('/artist', views.ArtistView.as_view()),
    path('/genre', views.GenreView.as_view()),
    path('/release-genre', views.ReleaseGenreView.as_view()),

]