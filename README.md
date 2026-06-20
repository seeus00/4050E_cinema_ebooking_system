# Cinema E-Booking System - Deliverable #2 (Sprint 1)

This is the Sprint 1 implementation of the Cinema E-Booking System (CES) containing only the features required for this sprint.

## Features Implemented

### ✅ Home Page
- Movies dynamically retrieved from the database
- Movies categorized as "Currently Playing" or "Coming Soon"
- Real-time display of movie data

### ✅ Movie Search
- Search movies by title
- Displays matching movies or "no results found" message

### ✅ Movie Filter
- Filter movies by genre
- Filter options integrated with the database
- Displays filtered results or "no results found" message

### ✅ Movie Details Page
- Displays comprehensive movie details:
  - Title, rating (MPAA), description (synopsis)
  - Poster image or embedded trailer
  - Director, producer, cast, release date
  - Reviews/user feedback

### ✅ Trailers
- Embedded YouTube trailers
- Playable directly on the website
- Automatic conversion of trailer URLs to embed format

### ✅ Showtimes Display
- Hardcoded showtimes (2:00 PM, 5:00 PM, 8:00 PM) per movie
- Links to booking page when showtime is selected
- Theater hall information displayed

### ✅ Booking Page (UI Prototype Only)
- Displays selected movie and showtime
- Ticket quantity selector for each category:
  - Adult, Child, Senior with dynamic pricing
- Seat layout (seat map) display
- Interactive seat selection
- Order summary with price breakdown
- UI only - no backend booking logic for this sprint

---

## Project Structure

```
Deliverable-2/
├── backend/                    # Django REST API
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env
│   ├── cinema_booking/        # Main Django project
│   ├── accounts/              # User authentication
│   ├── movies/                # Movies app
│   ├── theaters/              # Theater halls & showtimes
│   └── bookings/              # Bookings (UI elements only)
│
└── frontend/                  # React + Vite
    ├── src/
    │   ├── pages/            # Page components
    │   │   ├── Home.jsx
    │   │   ├── MovieDetail.jsx
    │   │   └── SeatSelection.jsx
    │   ├── components/       # Reusable components
    │   ├── services/         # API services
    │   ├── context/          # React context
    │   ├── api/              # Axios configuration
    │   ├── App.jsx
    │   ├── main.jsx
    │   ├── App.css
    │   └── index.css
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── .env
```

---

## Setup Instructions

### Backend Setup

1. **Install Python dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Configure environment variables:**
   Edit `.env` file with your database credentials:
   ```
   SECRET_KEY=your-secret-key
   DEBUG=True
   DB_NAME=cinema_ebooking
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_HOST=localhost
   DB_PORT=5432
   ```

3. **Create and run migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

4. **Create a superuser (admin):**
   ```bash
   python manage.py createsuperuser
   ```

5. **Seed the database with movies:**
   ```bash
   python manage.py create_movies  # (if you have a management command)
   # OR use the Django admin panel at http://localhost:8000/admin
   ```

6. **Run the Django server:**
   ```bash
   python manage.py runserver
   ```
   Backend will be available at `http://127.0.0.1:8000`

### Frontend Setup

1. **Install Node dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment variables:**
   Ensure `.env` points to the correct API:
   ```
   VITE_API_BASE_URL=http://127.0.0.1:8000/api
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Frontend will be available at `http://localhost:5173` (or as shown in terminal)

---

## Data Seeding

The application requires at least 10 seeded movies with multiple genres and both statuses (Currently Playing & Coming Soon).

### Seeding via Django Admin:
1. Visit http://localhost:8000/admin
2. Login with superuser credentials
3. Add movies manually in the Movies section
4. Add genres and associate them with movies
5. Create showtimes for movies using the Theaters section

### Sample Movies to Add:
- Action: "The Matrix Reloaded", "Fast & Furious"
- Drama: "The Shawshank Redemption", "Inception"
- Comedy: "Superbad", "The Grand Budapest Hotel"
- Horror: "The Conjuring", "A Quiet Place"
- Sci-Fi: "Interstellar", "Dune"

---

## API Endpoints (Backend)

### Movies
- `GET /api/movies/` - List all movies
- `GET /api/movies/{id}/` - Get movie details
- `GET /api/movies/currently-playing/` - Get currently playing movies
- `GET /api/movies/coming-soon/` - Get coming soon movies
- `GET /api/movies/search/?title=<query>` - Search movies by title
- `GET /api/movies/filter/?genre=<genre>` - Filter by genre

### Genres
- `GET /api/genres/` - List all genres

### Showtimes
- `GET /api/showtimes/` - List all showtimes
- `GET /api/showtimes/?movie_id=<id>` - Get showtimes for a movie
- `GET /api/showtimes/{id}/seats/` - Get seat map for a showtime

### Bookings (Pricing Information)
- `GET /api/ticket-prices/` - Get ticket prices
- `GET /api/booking-fees/` - Get booking fees

---

## Technology Stack

### Backend
- Django 4.2+
- Django REST Framework
- PostgreSQL
- CORS Headers

### Frontend
- React 19.2
- React Router v7
- Axios
- Bootstrap 5
- Vite

---

## Testing Checklist for Demo

- [ ] Home page loads with currently playing and coming soon movies
- [ ] Search functionality finds movies by title
- [ ] Filter by genre works correctly
- [ ] Movie detail page displays all information
- [ ] Movie trailers embed and play on the detail page
- [ ] Movie showtimes are displayed as clickable links
- [ ] Clicking showtime navigates to booking page
- [ ] Booking page displays movie, showtime, and seat layout
- [ ] Seat selection works (click to select/deselect)
- [ ] Ticket category selector increases/decreases quantities
- [ ] Order summary updates with ticket selection
- [ ] UI is responsive and professional-looking

---

## Notes

- **No user authentication required for Sprint 1** - favorites and authentication features are not implemented
- **No payment processing** - checkout is UI only
- **No seat reservations** - seats are not locked or reserved
- **Hardcoded showtimes** - theater data is static for now
- **Static pricing** - ticket prices are fetched from API but can be hardcoded

---

## Future Sprints

- Sprint 2: User authentication, payment integration, seat reservation
- Sprint 3: Order management, promotional codes, analytics
- Sprint 4: Admin dashboard, reporting, additional features

---

## Support

For issues or questions, contact the development team.

**Sprint 1 - Deliverable Date:** [Your Date]
