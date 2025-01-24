import axios from 'axios';

// const API_KEY = '';  // Ganti dengan API key Anda
const BASE_URL = 'https://api.themoviedb.org/3';

export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  vote_average: number;
  release_date: string;
}

const tmdbAPI = {
  fetchPopularMovies: async (): Promise<Movie[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/movie/popular`, {
        params: {
          api_key: API_KEY,
          language: 'en-US',
          page: 1,
        },
        headers: {
          'Authorization': `Bearer ${API_KEY}`, // Menambahkan header Authorization
        },
      });
      return response.data.results;
    } catch (error) {
      console.error('Error fetching movies:', error);
      throw error;
    }
  },

  fetchMovieDetails: async (movieId: number): Promise<Movie> => {
    try {
      const response = await axios.get(`${BASE_URL}/movie/${movieId}`, {
        params: {
          api_key: API_KEY,
          language: 'en-US',
        },
        headers: {
          'Authorization': `Bearer ${API_KEY}`, // Menambahkan header Authorization
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw error;
    }
  },

  searchMovies: async (query: string): Promise<Movie[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/search/movie`, {
        params: {
          api_key: API_KEY,
          language: 'en-US',
          query, // Kata kunci pencarian
          page: 1,
        },
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
        },
      });
      return response.data.results;
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  },
};

export default tmdbAPI;
