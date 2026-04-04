# Criminal Database System

A comprehensive web-based criminal database management system designed for law enforcement agencies to track and manage international criminal records. This application provides a centralized platform similar to Interpol's Red Notice system.

## Project Overview

This system allows authorized personnel to maintain detailed records of criminals, their affiliations with criminal organizations, active case files, and reported sightings. The application features a clean, governmental-style interface that prioritizes functionality and data accessibility.

## Tech Stack

### Backend
- **Django 6.0** - Python web framework
- **Django REST Framework** - RESTful API development
- **SQLite** - Database management
- **Pillow** - Image processing for criminal photos
- **Token Authentication** - Secure API access

### Frontend
- **Angular** - Modern web framework
- **TypeScript** - Type-safe development
- **CSS** - Styling with governmental design principles

## Key Features

- **Criminal Records Management** - Store and retrieve detailed criminal profiles including personal information, photos, and primary crime classifications
- **Organization Tracking** - Monitor criminal organizations (mafias, cartels, gangs, terrorist groups)
- **Case File System** - Manage active investigations with severity levels and case status tracking
- **Membership Links** - Track criminal affiliations and roles within organizations
- **Advanced Search & Filtering** - Search by name, nationality, crime type, and other criteria
- **RESTful API** - Complete CRUD operations with comprehensive endpoint documentation
- **Token-Based Authentication** - Secure login/logout system for authorized users
- **Admin Panel** - Django admin interface for data management

## Database Models

1. **Criminal** - Core entity with personal details, criminal classification, and status
2. **Organization** - Criminal groups and networks
3. **CaseFile** - Investigation records linked to criminals
4. **Membership** - Relationships between criminals and organizations

## API Endpoints

- `/api/criminals/` - List and search criminals
- `/api/criminals/<id>/` - Retrieve individual criminal details
- `/api/organizations/` - Manage criminal organizations
- `/api/cases/` - Full CRUD operations on case files
- `/api/auth/login/` - User authentication
- `/api/auth/logout/` - Session termination

## Installation & Setup

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend
```bash
cd frontend
npm install
ng serve
```

## API Documentation

Full API documentation available in `postman_collection.json`. Import into Postman to test all endpoints with example requests and responses.

## Team Members

- Yernaruly Amandyk
- Zhengilmes Aslanbek
- Kassymov Arslan

## University Course

Web Development