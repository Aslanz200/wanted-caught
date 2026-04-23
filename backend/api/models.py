from django.db import models
from django.contrib.auth.models import User


class Criminal(models.Model):
    GENDER_CHOICES = [('M', 'Male'), ('F', 'Female')]
    STATUS_CHOICES = [('wanted', 'Wanted'), ('arrested', 'Arrested'), ('released', 'Released')]
    CRIME_CHOICES = [
        ('murder', 'Murder'),
        ('fraud', 'Fraud'),
        ('theft', 'Theft'),
        ('terrorism', 'Terrorism'),
        ('cybercrime', 'Cybercrime'),
        ('drug_trafficking', 'Drug Trafficking'),
        ('kidnapping', 'Kidnapping'),
        ('other', 'Other'),
    ]

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    date_of_birth = models.DateField()
    place_of_birth = models.CharField(max_length=200)
    nationality = models.CharField(max_length=100)
    primary_crime = models.CharField(max_length=50, choices=CRIME_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    photo = models.ImageField(upload_to='photos/', blank=True, null=True)

    def __str__(self):
        return f"{self.last_name} {self.first_name}"


class Organization(models.Model):
    TYPE_CHOICES = [
        ('mafia', 'Mafia'),
        ('cartel', 'Cartel'),
        ('gang', 'Gang'),
        ('terrorist', 'Terrorist Group'),
        ('cybercrime', 'Cybercrime Network'),
        ('other', 'Other'),
    ]
    
    name = models.CharField(max_length=200)
    organization_type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    country_of_origin = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.name} ({self.organization_type})"


class CaseFile(models.Model):
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('closed', 'Closed'),
        ('pending', 'Pending'),
    ]
    SEVERITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]

    criminal = models.ForeignKey(Criminal, on_delete=models.CASCADE, related_name='cases')
    case_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    description = models.TextField()
    severity_level = models.CharField(max_length=20, choices=SEVERITY_CHOICES, default='medium')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Case #{self.id} - {self.criminal.last_name}"


class Membership(models.Model):
    criminal = models.ForeignKey(Criminal, on_delete=models.CASCADE, related_name='memberships')
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='members')
    role = models.CharField(max_length=100, help_text="Role in organization (e.g., Leader, Member, Enforcer)")
    joined_date = models.DateField(blank=True, null=True)

    class Meta:
        unique_together = ('criminal', 'organization')

    def __str__(self):
        return f"{self.criminal.last_name} in {self.organization.name}"