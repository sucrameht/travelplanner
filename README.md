# Travel Planner - WanderSmart

A full-stack travel planning application built with Django REST Framework and React + Vite.

## Features

- Create and manage trips with destinations, dates, and budgets
- Automatic trip categorization (Upcoming, Current, Past)
- Interactive UI with Tailwind CSS
- RESTful API backend

## Tech Stack

**Backend:**
- Django 5.2.6
- Django REST Framework
- CORS Headers
- SQLite Database

**Frontend:**
- React 18
- Vite 6
- Tailwind CSS 4
- Axios
- Lucide React (icons)
- React Router DOM

## Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn
- Git

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd travelplanner
```

### 2. Backend Setup (Django)

```bash
# Create and activate virtual environment
python -m venv venv

# On Windows:
venv\Scripts\activate

# On Mac/Linux:
source venv/bin/activate

# Install Python dependencies
pip install django djangorestframework django-cors-headers

# Run migrations
python manage.py migrate

# Create superuser (optional - for admin access)
python manage.py createsuperuser

# Start Django server
python manage.py runserver
```

The backend API will be available at `http://127.0.0.1:8000/`

### 3. Frontend Setup (React + Vite)

Open a new terminal window:

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173/`

## Running the Application

You need to run both servers simultaneously:

**Terminal 1 - Backend:**
```bash
cd travelplanner
venv\Scripts\activate  # or source venv/bin/activate on Mac/Linux
python manage.py runserver
```

**Terminal 2 - Frontend:**
```bash
cd travelplanner/frontend
npm run dev
```

Then open your browser and navigate to `http://localhost:5173/`

## API Endpoints

- `GET /api/trips/` - List all trips
- `POST /api/trips/` - Create a new trip
- `GET /api/trips/{id}/` - Get trip details
- `PUT /api/trips/{id}/` - Update a trip
- `DELETE /api/trips/{id}/` - Delete a trip
- `GET /api/stops/` - List all stops
- `POST /api/stops/` - Create a new stop

## Project Structure

```
travelplanner/
├── api/                    # Django API app
│   ├── models.py          # Trip and Stop models
│   ├── serializers.py     # DRF serializers
│   ├── views.py           # API viewsets
│   └── urls.py            # API routing
├── backend/               # Django project settings
│   ├── settings.py        # Configuration
│   └── urls.py            # Main URL routing
├── frontend/              # React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.jsx        # Main App component
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Tailwind imports
│   ├── package.json       # Node dependencies
│   └── vite.config.js     # Vite configuration
├── db.sqlite3             # SQLite database
├── manage.py              # Django management script
└── README.md              # This file
```

## Troubleshooting

**CORS Errors:**
- Make sure `http://localhost:5173` is listed in `CORS_ALLOWED_ORIGINS` in `backend/settings.py`

**Backend Not Connecting:**
- Verify Django is running on port 8000
- Check the API URL in frontend components matches `http://127.0.0.1:8000/api/`

**Frontend Build Issues:**
- Delete `node_modules` and `package-lock.json`, then run `npm install` again
- Ensure you're using Node.js 16 or higher

**Database Issues:**
- Delete `db.sqlite3` and run `python manage.py migrate` again

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

This project is for educational purposes.
