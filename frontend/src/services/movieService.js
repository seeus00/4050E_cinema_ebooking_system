import API from '../api/api';

const movieService = {
  getMovies: async () => {
    const response = await API.get('/movies/');
    return response.data;
  },

  getCurrentlyPlaying: async () => {
    const response = await API.get('/movies/currently-playing/');
    return response.data;
  },

  getComingSoon: async () => {
    const response = await API.get('/movies/coming-soon/');
    return response.data;
  },

  searchMovies: async (title) => {
    const response = await API.get(`/movies/search/?title=${encodeURIComponent(title)}`);
    return response.data;
  },

  filterMovies: async (genre) => {
    const response = await API.get(`/movies/filter/?genre=${encodeURIComponent(genre)}`);
    return response.data;
  },

  filterMoviesByDate: async (date) => {
    const response = await API.get(`/movies/show-date/?date=${encodeURIComponent(date)}`);
    return response.data;
  },

  getMovieDetail: async (id) => {
    const response = await API.get(`/movies/${id}/`);
    return response.data;
  },

  getGenres: async () => {
    const response = await API.get('/genres/');
    return response.data;
  }
};

export default movieService;
