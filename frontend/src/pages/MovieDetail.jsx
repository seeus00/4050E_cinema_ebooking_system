import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import movieService from '../services/movieService';
import showtimeService from '../services/showtimeService';
import LoadingSpinner from '../components/LoadingSpinner';

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieData = async () => {
      setLoading(true);
      try {
        const movieData = await movieService.getMovieDetail(id);
        setMovie(movieData);

        const showtimesData = await showtimeService.getShowtimes(id);
        setShowtimes(showtimesData);
      } catch (err) {
        console.error("Failed to fetch movie details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovieData();
  }, [id]);

  // Convert youtube watch link to embed link
  const getEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('youtube.com/embed/')) return url;
    if (url.includes('watch?v=')) {
      const id = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    return url;
  };

  if (loading) {
    return <LoadingSpinner fullPage message="Loading details..." />;
  }

  if (!movie) {
    return (
      <div className="container my-5 text-center text-white">
        <h3>Movie not found.</h3>
        <Link to="/" className="btn btn-gold text-dark fw-bold mt-3">Return Home</Link>
      </div>
    );
  }

  const embedTrailer = getEmbedUrl(movie.trailer_video_url);
  const fallbackShowtimes = [
    { id: `${movie.id}-2pm`, time: '2:00 PM', hall_detail: { name: 'Hall A' } },
    { id: `${movie.id}-5pm`, time: '5:00 PM', hall_detail: { name: 'Hall B' } }
  ];
  const displayShowtimes = showtimes.length > 0 ? showtimes : fallbackShowtimes;

  return (
    <div className="container my-5 text-white">
      <div className="row g-5">
        {/* Left Column: Image/Poster or Trailer Video Embed */}
        <div className="col-lg-6">
          {embedTrailer ? (
            <div className="ratio ratio-16x9 rounded overflow-hidden shadow-lg border border-secondary mb-4">
              <iframe
                src={embedTrailer}
                title="Movie Trailer"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              ></iframe>
            </div>
          ) : (
            <img
              src={movie.trailer_image || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80'}
              className="img-fluid rounded shadow-lg border border-secondary mb-4 w-100"
              alt={movie.title}
            />
          )}

          {/* Reviews Panel */}
          <div className="card bg-dark-card border-secondary text-white p-4 shadow-sm">
            <h5 className="fw-bold mb-3 text-gold">Audience Reviews</h5>
            {movie.reviews ? (
              <p className="fst-italic text-white-50">{movie.reviews}</p>
            ) : (
              <p className="small text-white-50 italic">No audience reviews posted yet.</p>
            )}
          </div>
        </div>

        {/* Right Column: Movie Info & Showtimes */}
        <div className="col-lg-6">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <h1 className="fw-bold mb-1">{movie.title}</h1>
              <span className="badge bg-gold text-dark fw-bold me-2">{movie.mpaa_rating}</span>
              <span className="badge bg-secondary">{movie.status === 'CURRENTLY_PLAYING' ? 'Currently Playing' : 'Coming Soon'}</span>
            </div>
          </div>

          <div className="mb-4">
            <h6 className="text-gold fw-bold mb-1">Synopsis</h6>
            <p className="text-white-50">{movie.synopsis}</p>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-md-6 movie-meta-item">
              <span className="text-white-50 d-block small movie-meta-label">Director</span>
              <span className="fw-bold movie-meta-value">{movie.director}</span>
            </div>
            <div className="col-md-6 movie-meta-item">
              <span className="text-white-50 d-block small movie-meta-label">Producer</span>
              <span className="fw-bold movie-meta-value">{movie.producer}</span>
            </div>
            <div className="col-md-6 movie-meta-item">
              <span className="text-white-50 d-block small movie-meta-label">Cast</span>
              <span className="fw-bold movie-meta-value">{movie.cast}</span>
            </div>
            <div className="col-md-6 movie-meta-item">
              <span className="text-white-50 d-block small movie-meta-label">Release Date</span>
              <span className="fw-bold movie-meta-value">{movie.release_date}</span>
            </div>
          </div>

          <h5 className="fw-bold mb-3 text-gold border-bottom border-secondary pb-2">Available Showtimes</h5>
          <div className="row g-2">
            {displayShowtimes.map(showtime => {
              const showtimeLabel = showtime.time || new Date(showtime.start_time).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              });
              const hallName = showtime.hall_detail?.name || 'Main Hall';

              return (
                <div key={showtime.id} className="col-md-6">
                  <Link
                    to={`/booking/${showtime.id}`}
                    state={{ showtime, movie }}
                    className="btn btn-gold text-dark fw-bold w-100 py-2"
                  >
                    Booking: {showtimeLabel} - {hallName}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Link to="/" className="btn btn-outline-gold fw-bold mt-4">← Return Home</Link>
    </div>
  );
};

export default MovieDetail;
