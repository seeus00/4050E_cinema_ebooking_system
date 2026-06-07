# 4050E_cinema_ebooking_system TEAM 4
# Cinema E-Booking System

This repository contains the frontend and backend code for the Cinema E-Booking System. 

## Tech Stack
* **Frontend:** React (JavaScript, HTML, CSS) via Vite
* **Backend:** Python / Django REST Framework
* **Database:** PostgreSQL

## Architecture
This project strictly follows a separated MVC architecture. The `frontend` directory contains all View logic. The `backend` directory contains all Models (database schemas) and Controllers (API endpoints/business logic).

---

## Local Setup Instructions

### 1. Database Setup (PostgreSQL)
1. Ensure PostgreSQL is installed and running on your machine.
2. Create a new database named `cinema_db`.
3. Update the `DATABASES` configuration in `backend/core/settings.py` with your local Postgres credentials if they differ from the defaults.
4. It is recommended to install PgAdmin4 to manage and run queries on database

### 2. Backend Setup
Open a terminal and navigate to the `backend` directory:
```bash
cd backend
# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate

# Install dependencies
pip install django djangorestframework psycopg2-binary django-cors-headers

# Run database migrations
python manage.py makemigrations
python manage.py migrate

# Start the development server
python manage.py runserver


### 3. Frontend Setup
```bash
cd frontend
# Install dependencies
npm install

# Run server
npm run dev
```
