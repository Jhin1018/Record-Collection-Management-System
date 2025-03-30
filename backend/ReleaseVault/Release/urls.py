from django.urls import path
from . import views

urlpatterns = [

    path('/test01', views.TestView.as_view()),
    path('/release01', views.ReleaseView.as_view()),
    path('/release02', views.ReleaseView2.as_view()),
    path('/collection', views.CollectionView.as_view()),
    path('/wantlist', views.WantlistView.as_view()),

]