import { useContext } from 'react';
import { MoviesContext } from '../contexts/MoviesContext';

export function useMovies() {
  const context = useContext(MoviesContext);
  if (!context) {
    throw new Error('useMovies deve ser utilizado dentro de um MoviesProvider');
  }
  return context;
}
