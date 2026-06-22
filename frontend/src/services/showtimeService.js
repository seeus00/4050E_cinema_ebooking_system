import API from '../api/api';

const showtimeService = {
  getShowtimes: async (movieId = null) => {
    const url = movieId ? `/showtimes/?movie_id=${movieId}` : '/showtimes/';
    const response = await API.get(url);
    return response.data;
  },

  getSeatMap: async (showtimeId) => {
    const response = await API.get(`/theaters/showtimes/${showtimeId}/`);
    return response.data;
  }
};

export default showtimeService;
