from rest_framework import serializers
from .models import Criminal, Organization, CaseFile, Membership


# 1. ModelSerializer
class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = '__all__'


# 2. ModelSerializer
class MembershipSerializer(serializers.ModelSerializer):
    criminal_name = serializers.CharField(source='criminal.last_name', read_only=True)
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    
    class Meta:
        model = Membership
        fields = '__all__'


# 3. Custom Serializer (serializers.Serializer)
class CriminalListSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    nationality = serializers.CharField(max_length=100)
    primary_crime = serializers.CharField(max_length=50)
    status = serializers.CharField(max_length=20)
    photo = serializers.ImageField(required=False)


# 4. Custom Serializer (serializers.Serializer)
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(max_length=128, write_only=True)


# Full Criminal Detail Serializer
class CriminalDetailSerializer(serializers.ModelSerializer):
    cases = serializers.SerializerMethodField()
    organizations = serializers.SerializerMethodField()
    
    def get_cases(self, obj):
        cases = obj.cases.all()
        return CaseFileSerializer(cases, many=True).data
    
    def get_organizations(self, obj):
        memberships = obj.memberships.all()
        return [{"name": m.organization.name, "role": m.role} for m in memberships]
    
    class Meta:
        model = Criminal
        fields = '__all__'


# CaseFile Serializer
class CaseFileSerializer(serializers.ModelSerializer):
    criminal_name = serializers.CharField(source='criminal.last_name', read_only=True)
    
    class Meta:
        model = CaseFile
        fields = '__all__'