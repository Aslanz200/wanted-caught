from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .models import Criminal, Organization, CaseFile, Membership
from .serializers import (
    CriminalListSerializer,
    CriminalDetailSerializer,
    OrganizationSerializer,
    CaseFileSerializer,
    MembershipSerializer,
    LoginSerializer
)


# FBV 1: Criminal List with search/filter
@api_view(['GET'])
@permission_classes([AllowAny])
def criminal_list(request):
    queryset = Criminal.objects.all()
    
    search = request.GET.get('search', None)
    if search:
        queryset = queryset.filter(last_name__icontains=search) | queryset.filter(first_name__icontains=search)
    
    nationality = request.GET.get('nationality', None)
    if nationality:
        queryset = queryset.filter(nationality__icontains=nationality)
    
    crime_type = request.GET.get('crime_type', None)
    if crime_type:
        queryset = queryset.filter(primary_crime=crime_type)
    
    serializer = CriminalListSerializer(queryset, many=True)
    return Response(serializer.data)


# FBV 2: Criminal Detail
@api_view(['GET'])
@permission_classes([AllowAny])
def criminal_detail(request, pk):
    try:
        criminal = Criminal.objects.get(pk=pk)
    except Criminal.DoesNotExist:
        return Response({'error': 'Criminal not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = CriminalDetailSerializer(criminal)
    return Response(serializer.data)


# CBV 1: CaseFile CRUD (full CRUD operations)
class CaseFileAPIView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, pk=None):
        if pk:
            try:
                case = CaseFile.objects.get(pk=pk)
                serializer = CaseFileSerializer(case)
                return Response(serializer.data)
            except CaseFile.DoesNotExist:
                return Response({'error': 'Case not found'}, status=status.HTTP_404_NOT_FOUND)
        else:
            cases = CaseFile.objects.all()
            serializer = CaseFileSerializer(cases, many=True)
            return Response(serializer.data)
    
    def post(self, request):
        serializer = CaseFileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, pk):
        try:
            case = CaseFile.objects.get(pk=pk)
        except CaseFile.DoesNotExist:
            return Response({'error': 'Case not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = CaseFileSerializer(case, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        try:
            case = CaseFile.objects.get(pk=pk)
            case.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except CaseFile.DoesNotExist:
            return Response({'error': 'Case not found'}, status=status.HTTP_404_NOT_FOUND)


# CBV 2: Organization List/Create
class OrganizationAPIView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        organizations = Organization.objects.all()
        serializer = OrganizationSerializer(organizations, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = OrganizationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Authentication: Login
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        user = authenticate(username=username, password=password)
        
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user_id': user.id,
                'username': user.username
            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Authentication: Logout
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    request.user.auth_token.delete()
    return Response({'message': 'Successfully logged out'}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email', '')

    if not username or not password:
        return Response(
            {'error': 'Username and password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(username=username).exists():
        return Response(
            {'error': 'Username already exists'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = User.objects.create_user(
        username=username,
        password=password,
        email=email
    )

    token, created = Token.objects.get_or_create(user=user)

    return Response({
        'token': token.key,
        'user_id': user.id,
        'username': user.username,
        'email': user.email
    }, status=status.HTTP_201_CREATED)