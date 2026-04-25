# 🔍 Wanted-Caught - Criminal Database

## 📖 Project Description
**Wanted-Caught** is a full-stack web application for tracking international criminals, their criminal cases, and organized crime affiliations. The system provides law enforcement agencies with tools to search, filter, and manage criminal records efficiently.

### Key Features
- 🔐 JWT-based authentication system
- 👤 User registration and login
- 📋 Full CRUD operations for criminal cases
- 🔍 Advanced search and filtering by name, country, year, and crime type
- 📊 Statistics dashboard with real-time data
- 🏢 Track criminal organizations and memberships
- 📸 Support for criminal photos and documentation

## 👥 Group Members
| Name              | Role | Contribution |
|-------------------|------|--------------|
| [Arslan Kassymov] | Full-Stack Developer | Frontend + Backend development |
| [Yernaruly Amandyk] | Frontend Developer | Angular frontend development |
| [Zhengilmes Aslanbek] | Backend Developer | Django backend development |

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Django | 6.0 | Web framework |
| Django REST Framework | 3.15+ | API development |
| SQLite | 3 | Database |
| django-cors-headers | 4.4+ | CORS handling |
| Pillow | 10+ | Image processing |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Angular | 17 | Frontend framework |
| TypeScript | 5.4 | Programming language |
| RxJS | 7 | Reactive programming |
| HTML5/CSS3 | - | Styling |

## 📁 Project Structure
```wanted-caught/
├── backend/
│ ├── api/
│ │ ├── models.py # 4 models: Criminal, Organization, CaseFile, Membership
│ │ ├── views.py # FBV + CBV implementations
│ │ ├── serializers.py # Custom + ModelSerializers
│ │ └── urls.py
│ ├── config/
│ │ └── settings.py
│ └── manage.py
├── frontend/
│ ├── src/
│ │ ├── app/
│ │ │ ├── criminals/ # Criminal list component
│ │ │ ├── detail/ # Case detail component
│ │ │ ├── login/ # Authentication component
│ │ │ ├── services/ # API and Auth services
│ │ │ └── models.ts # TypeScript interfaces
│ │ └── styles.css
│ └── angular.json
└── README.md
```

## 🚀 Installation & Running

### Prerequisites
- Python 3.10+
- Node.js 18+
- Angular CLI 17+

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/Aslanz200/wanted-caught
cd wanted-caught/backend

# Create and activate virtual environment
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser (admin)
python manage.py createsuperuser

# Start Django server
python manage.py runserver
```

### Frontend Setup
```bash
# Open new terminal
cd wanted-caught/frontend

# Install dependencies
npm install

# Start Angular development server
ng serve

# Or if ng not found:
npx ng serve
```

### Access the Application
- Frontend: http://localhost:4200

- Backend API: http://localhost:8000/api/

- Django Admin: http://localhost:8000/admin/

### 🔑 API Endpoints
# Authentication
Method	Endpoint	Description
POST	/api/auth/login/	User login (returns token)
POST	/api/auth/logout/	User logout
POST	/api/auth/register/	User registration
# Criminals
Method	Endpoint	Description
GET	/api/criminals/	List all criminals (with filters)
GET	/api/criminals/{id}/	Get criminal details
# Cases (Full CRUD)
Method	Endpoint	Description
GET	/api/cases/	List all cases
POST	/api/cases/	Create new case
GET	/api/cases/{id}/	Get case details
PUT	/api/cases/{id}/	Update case
DELETE	/api/cases/{id}/	Delete case
# Organizations
Method	Endpoint	Description
GET	/api/organizations/	List organizations
POST	/api/organizations/	Create organization

### 📝 Demo Credentials
```text
Username: testuser
Password: testpass123
```

### 📦 Postman Collection
The Postman collection with all API requests and example responses is available in the repository root:

Criminal Database API.postman_collection.json

### 🤝 Contributing
This project was developed as part of the Web Development course.

### 📄 License
Educational Project

### 📧 Contact
For any questions or issues, please contact the group members.
