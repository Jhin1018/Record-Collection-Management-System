from django.urls import path
from . import views

urlpatterns = [

    path('/test01', views.TestView.as_view()),
    path('', views.UserView.as_view()),
    path('/userlogin', views.user_tokenlogin.as_view()),

]