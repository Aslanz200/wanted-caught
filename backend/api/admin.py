from django.contrib import admin
from .models import Criminal, Organization, CaseFile, Membership

@admin.register(Criminal)
class CriminalAdmin(admin.ModelAdmin):
    list_display = ['last_name', 'first_name', 'nationality', 'primary_crime', 'status']
    list_filter = ['status', 'primary_crime', 'nationality', 'gender']
    search_fields = ['last_name', 'first_name', 'nationality']

@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ['name', 'organization_type', 'country_of_origin']
    list_filter = ['organization_type', 'country_of_origin']
    search_fields = ['name', 'description']

@admin.register(CaseFile)
class CaseFileAdmin(admin.ModelAdmin):
    list_display = ['id', 'criminal', 'case_status', 'severity_level', 'created_at']
    list_filter = ['case_status', 'severity_level']
    search_fields = ['criminal__last_name', 'description']

@admin.register(Membership)
class MembershipAdmin(admin.ModelAdmin):
    list_display = ['criminal', 'organization', 'role']
    list_filter = ['organization']
    search_fields = ['criminal__last_name', 'organization__name', 'role']