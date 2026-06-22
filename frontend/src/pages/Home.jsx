import React, { useState, useEffect } from 'react';
import movieService from '../services/movieService';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const [currentlyPlaying, setCurrentlyPlaying] = useState([]);
  const [comingSoon, setComingSoon] = useState([]);
  const [genres, setGenres] = useState([]);
  
  const [searchTitle, setSearchTitle] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const cpData = await movieService.getCurrentlyPlaying();
        setCurrentlyPlaying(cpData);

        const csData = await movieService.getComingSoon();
        setComingSoon(csData);

        const genresData = await movieService.getGenres();
        setGenres(genresData);
      } catch (err) {
        console.error("Failed to fetch home page data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value);
  };

  const getGenreNames = (movie) => {
    if (!movie.genres) return [];
    return movie.genres.map((genre) => genre.name || genre);
  };

  const matchesFilters = (movie) => {
    const searchValue = searchTitle.trim().toLowerCase();
    const titleMatches = !searchValue || movie.title?.toLowerCase().includes(searchValue);
    const genreMatches = !selectedGenre || getGenreNames(movie).includes(selectedGenre);
    // The show date control is a placeholder for now and does not change the results.
    const dateMatches = true;

    return titleMatches && genreMatches && dateMatches;
  };

  const filteredCurrentlyPlaying = currentlyPlaying.filter(matchesFilters);
  const filteredComingSoon = comingSoon.filter(matchesFilters);
  const hasActiveFilters = searchTitle.trim() !== '' || selectedGenre !== '' || selectedDate !== '';

  if (loading) {
    return <LoadingSpinner fullPage message="Loading Showings..." />;
  }

  return (
    <div className="home-container bg-dark text-white min-vh-100 pb-5">
      {/* Hero Banner */}
      <div 
        className="hero-section text-center py-5 mb-5 d-flex flex-column align-items-center justify-content-center border-bottom border-secondary position-relative overflow-hidden"
        style={{ 
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.85)), url("https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '350px'
        }}
      >
        <h1 className="display-4 fw-extrabold text-gold mb-3 animate-fade-in">Experience Cinema Like Never Before</h1>
        <p className="lead text-white-50 mb-4 fs-5 w-75 mx-auto">Book seats, view showtimes, and check out instantly at our state-of-the-art cinema screen.</p>
        
        {/* Search & Filter Bar */}
        <div className="container w-75 mx-auto bg-dark-card p-3 rounded shadow border border-secondary" style={{ zIndex: 10 }}>
          <div className="row g-2">
            <div className="col-md-5">
              <form onSubmit={handleSearchSubmit} className="d-flex">
                <input
                  type="text"
                  className="form-control bg-dark border-secondary text-white py-2"
                  placeholder="Search movies by title..."
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                />
                <button type="submit" className="btn btn-gold text-dark fw-bold ms-2 px-4">Search</button>
              </form>
            </div>
            <div className="col-md-4">
              <select 
                className="form-select bg-dark border-secondary text-white py-2"
                value={selectedGenre}
                onChange={handleGenreChange}
              >
                <option value="">Filter by Genre...</option>
                {genres.map(genre => (
                  <option key={genre.id} value={genre.name}>{genre.name}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <select
                className="form-select bg-dark border-secondary text-white py-2"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              >
                <option value="">Filter by Show Date...</option>
                <option value="all">Any Date</option>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="weekend">Weekend</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {hasActiveFilters && filteredCurrentlyPlaying.length === 0 && filteredComingSoon.length === 0 && (
          <div className="text-center py-5">
            <p className="text-white-50 fs-5 mb-0">No movies found</p>
          </div>
        )}

        {/* Currently Playing Grid */}
        <div className="mb-5">
          <h2 className="fw-bold mb-4 text-gold border-start border-4 border-gold ps-3">Currently Playing</h2>
          {filteredCurrentlyPlaying.length === 0 ? (
            !hasActiveFilters ? (
              <p className="text-white-50">No movies are currently playing.</p>
            ) : null
          ) : (
            <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4">
              {filteredCurrentlyPlaying.map(movie => (
                <div key={movie.id} className="col">
                  <MovieCard 
                    movie={movie}
                    isFavorited={false}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Coming Soon Grid */}
        <div>
          <h2 className="fw-bold mb-4 text-gold border-start border-4 border-gold ps-3">Coming Soon</h2>
          {filteredComingSoon.length === 0 ? (
            !hasActiveFilters ? (
              <p className="text-white-50">No upcoming movies scheduled.</p>
            ) : null
          ) : (
            <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4">
              {filteredComingSoon.map(movie => (
                <div key={movie.id} className="col">
                  <MovieCard 
                    movie={movie}
                    isFavorited={false}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
