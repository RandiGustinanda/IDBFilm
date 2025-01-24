import axios from 'axios';

const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiYzQ2MWY2ZGIxODgzOGI3ZjJkZjM5ZDdhMGI3MTVlNCIsIm5iZiI6MTczNzc0MzUzMC4xMTY5OTk5LCJzdWIiOiI2NzkzZGNhYTVkZDI1MzFlOGI0ODRiN2QiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.-KUMJvZ6eQt5DinXdoVr9eNeFJVTowXB2y75kfsL_4U';  // Ganti dengan API key Anda
const BASE_URL = 'https://api.themoviedb.org/3';

export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  vote_average: number;
  release_date: string;
}
interface VideoResult {
  id: string;
  key: string;
  site: string;
  type: string;
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

  fetchMovieTrailer: async (movieId: number): Promise<Movie> => {
    try {
      const response = await axios.get(`${BASE_URL}/movie/${movieId}/videos`, {
        params: {
          api_key: API_KEY,
          language: 'en-US',
        },
        headers: {
          'Authorization': `Bearer ${API_KEY}`, // Menambahkan header Authorization
        },
      });
      const trailers = response.data.results.filter(
        (video: VideoResult) => 
          video.site === 'YouTube' && 
          (video.type === 'Trailer' || video.type === 'Teaser')
      );
  
      // Return the first trailer, preferring 'Trailer' type
      const trailer = trailers.find((video: VideoResult) => video.type === 'Trailer') 
        || trailers[0];
  
      return trailer ? trailer.key : null;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw error;
    }
  },
  
};

export default tmdbAPI;
