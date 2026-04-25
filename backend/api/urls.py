from django.urls import path
from .views import (
    criminal_list,
    criminal_detail,
    CaseFileAPIView,
    OrganizationAPIView,
    login_view,
    logout_view,
    register_view
)

urlpatterns = [
    path('criminals/', criminal_list, name='criminal-list'),
    path('criminals/<int:pk>/', criminal_detail, name='criminal-detail'),

    path('cases/', CaseFileAPIView.as_view(), name='case-list'),
    path('cases/<int:pk>/', CaseFileAPIView.as_view(), name='case-detail'),

    path('organizations/', OrganizationAPIView.as_view(), name='organization-list'),

    path('auth/login/', login_view, name='login'),
    path('auth/logout/', logout_view, name='logout'),
    path('auth/register/', register_view, name='register'),  # ДОБАВЛЕНА ЭТА СТРОКА
]