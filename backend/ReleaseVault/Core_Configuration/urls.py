from django.urls import path
from . import views

urlpatterns = [

    path('/test01', views.TestView.as_view()),

]