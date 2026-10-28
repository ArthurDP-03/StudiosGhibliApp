import axios, { AxiosError } from 'axios';
import { apiClient } from './api';
import { Movie } from '../models/movie';
import { cleanHtmlText } from '../utils/textCleaner';

function sanitizeMovie(raw: any): Movie {
  return {
    id: String(raw.id || ''),
    title: raw.title || 'Título desconhecido',
    original_title: raw.original_title || '',
    alternative_title: raw.alternative_title || '',
    title_image: raw.title_image || '',
    poster: raw.poster || raw.alternative_poster || '',
    alternative_poster: raw.alternative_poster || '',
    description: cleanHtmlText(raw.description),
    promotional_image: raw.promotional_image || '',
    director: raw.director || 'Studio Ghibli',
    release_year: Number(raw.release_year) || 0,
    duration: Number(raw.duration) || 0,
    mpaa: raw.mpaa || 'Livre',
    score: raw.score || 'N/A',
    trailer: raw.trailer || '',
    genres: Array.isArray(raw.genres) ? raw.genres : [],
    gallery: Array.isArray(raw.gallery) ? raw.gallery : [],
  };
}

export const ghibliService = {
  /**
   * Busca a lista completa de filmes (RF01)
   */
  async getAllMovies(): Promise<Movie[]> {
    try {
      const response = await apiClient.get<any[]>('/movies/all');
      if (!Array.isArray(response.data)) return [];
      return response.data.map(sanitizeMovie);
    } catch (error) {
      throw handleApiError(error, 'Erro ao carregar os filmes do Studio Ghibli.');
    }
  },

  /**
   * Busca detalhes completos do filme por ID (RF03)
   */
  async getMovieById(id: string): Promise<Movie> {
    try {
      const response = await apiClient.get<any>(`/movies/get/${id}`);
      return sanitizeMovie(response.data);
    } catch (error) {
      throw handleApiError(error, `Filme #${id} não encontrado.`);
    }
  },

  /**
   * Realiza busca de filmes por termo (RF08)
   */
  async searchMovies(term: string): Promise<Movie[]> {
    const cleanTerm = term.trim();
    if (!cleanTerm) return [];

    try {
      const response = await apiClient.get<any>(
        `/movies/search/${encodeURIComponent(cleanTerm)}`
      );
      if (Array.isArray(response.data)) {
        return response.data.map(sanitizeMovie);
      }
      if (response.data && typeof response.data === 'object') {
        return [sanitizeMovie(response.data)];
      }
      return [];
    } catch (error) {
      const axiosError = error as AxiosError;
      // Quando a API retorna 404 para termo não encontrado, tratamos como lista vazia
      if (axiosError.response && axiosError.response.status === 404) {
        return [];
      }
      throw handleApiError(error, 'Falha ao pesquisar filmes.');
    }
  },
};

function handleApiError(error: unknown, fallbackMessage: string): Error {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return new Error('O servidor do Studio Ghibli está iniciando. Por favor, aguarde alguns segundos e tente novamente.');
    }
    if (!error.response) {
      return new Error('Sem conexão com o servidor. Verifique sua conexão com a internet.');
    }
  }
  return new Error(fallbackMessage);
}
