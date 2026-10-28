import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Movie } from '../models/movie';
import { ghibliService } from '../services/ghibliService';
import { AppConstants } from '../config/constants';

interface MoviesContextData {
  movies: Movie[];              // Filmes atualmente visíveis no catálogo paginado
  allMovies: Movie[];           // Base completa de filmes em memória
  isLoading: boolean;           // Carga inicial
  isLoadingMore: boolean;       // Paginação do rodapé
  isRefreshing: boolean;        // Pull-to-refresh
  errorMessage: string | null;
  hasMorePages: boolean;
  loadMoreMovies: () => void;
  refreshMovies: () => Promise<void>;
}

export const MoviesContext = createContext<MoviesContextData>({} as MoviesContextData);

export const MoviesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchCatalog = useCallback(async () => {
    setErrorMessage(null);
    try {
      const data = await ghibliService.getAllMovies();
      // Ordenação inicial por ano de lançamento
      const sorted = [...data].sort((a, b) => a.release_year - b.release_year);
      setAllMovies(sorted);
      setPage(1);
      setMovies(sorted.slice(0, AppConstants.PAGE_SIZE));
    } catch (e: any) {
      setErrorMessage(e.message || 'Falha ao carregar catálogo.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  const refreshMovies = async () => {
    setIsRefreshing(true);
    await fetchCatalog();
  };

  const hasMorePages = movies.length < allMovies.length;

  const loadMoreMovies = () => {
    if (isLoadingMore || !hasMorePages) return;

    setIsLoadingMore(true);
    // Simula pequena latência para visualização suave do ActivityIndicator no ListFooterComponent (RF01, RF09)
    setTimeout(() => {
      const nextPage = page + 1;
      const nextBatch = allMovies.slice(0, nextPage * AppConstants.PAGE_SIZE);
      setMovies(nextBatch);
      setPage(nextPage);
      setIsLoadingMore(false);
    }, 400);
  };

  return (
    <MoviesContext.Provider
      value={{
        movies,
        allMovies,
        isLoading,
        isLoadingMore,
        isRefreshing,
        errorMessage,
        hasMorePages,
        loadMoreMovies,
        refreshMovies,
      }}
    >
      {children}
    </MoviesContext.Provider>
  );
};
