from rest_framework import serializers
from .models import Criminal, Organization, CaseFile, Membership


class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = '__all__'


class MembershipSerializer(serializers.ModelSerializer):
    criminal_name = serializers.CharField(source='criminal.last_name', read_only=True)
    organization_name = serializers.CharField(source='organization.name', read_only=True)

    class Meta:
        model = Membership
        fields = '__all__'


class CriminalListSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    nationality = serializers.CharField(max_length=100)
    primary_crime = serializers.CharField(max_length=50)
    status = serializers.CharField(max_length=20)
    photo = serializers.ImageField(required=False)
    gender = serializers.CharField(max_length=1, required=False)
    date_of_birth = serializers.DateField(required=False)


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(max_length=128, write_only=True)


class CaseFileSerializer(serializers.ModelSerializer):
    criminal_name = serializers.CharField(source='criminal.last_name', read_only=True)

    class Meta:
        model = CaseFile
        fields = '__all__'


class CriminalDetailSerializer(serializers.ModelSerializer):
    cases = CaseFileSerializer(many=True, read_only=True)
    organizations = serializers.SerializerMethodField()

    def get_organizations(self, obj):
        memberships = obj.memberships.all()
        return [{
            "id": m.organization.id,
            "name": m.organization.name,
            "role": m.role,
            "organization_type": m.organization.organization_type
        } for m in memberships]

    class Meta:
        model = Criminal
        fields = '__all__'