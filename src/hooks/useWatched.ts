import { useContext } from 'react';
import { WatchedContext } from '../contexts/WatchedContext';

export function useWatched() {
  const context = useContext(WatchedContext);
  if (!context) {
    throw new Error('useWatched deve ser utilizado dentro de um WatchedProvider');
  }
  return context;
}
