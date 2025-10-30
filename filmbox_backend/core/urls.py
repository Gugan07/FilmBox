from django.urls import path
from .views import (
    signup,
    MyTokenObtainPairView,
    movie_list,
    movie_detail,
    movie_reviews,
    reviews,
    watchlist,
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('signup/', signup, name='signup'),
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('movies/', movie_list, name='movie_list'),
    path('movies/<int:movie_id>/', movie_detail, name='movie_detail'),
    path('movies/<int:movie_id>/reviews/', movie_reviews, name='movie_reviews'),
    path('reviews/', reviews, name='reviews'),
    path('watchlist/', watchlist, name='watchlist'),
]
