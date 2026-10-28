import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Movie, WatchedMovieRecord } from '../models/movie';
import { storageService } from '../services/storageService';
import { firestoreService } from '../services/firestoreService';
import { AuthContext } from './AuthContext';

interface WatchedContextData {
  watchedList: WatchedMovieRecord[];
  isWatched: (movieId: string) => boolean;
  getMovieRating: (movieId: string) => number;
  setWatchedRating: (movie: Movie, rating: number) => Promise<void>;
  toggleWatched: (movie: Movie) => Promise<void>;
  isLoading: boolean;
}

export const WatchedContext = createContext<WatchedContextData>({} as WatchedContextData);

export const WatchedProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [watchedList, setWatchedList] = useState<WatchedMovieRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const localItems = await storageService.getWatched();

        if (user && user.isFirebase) {
          const cloudItems = await firestoreService.getWatched(user.id);
          if (cloudItems.length > 0) {
            setWatchedList(cloudItems);
            await storageService.saveWatched(cloudItems);
          } else if (localItems.length > 0) {
            await firestoreService.saveWatched(user.id, localItems);
            setWatchedList(localItems);
          } else {
            setWatchedList([]);
          }
        } else {
          setWatchedList(localItems);
        }
      } catch (e) {
        console.warn('Erro ao carregar filmes assistidos:', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [user]);

  const isWatched = (movieId: string): boolean => {
    return watchedList.some((item) => item.movieId === movieId);
  };

  const getMovieRating = (movieId: string): number => {
    const record = watchedList.find((item) => item.movieId === movieId);
    return record ? record.rating : 0;
  };

  const setWatchedRating = async (movie: Movie, rating: number) => {
    const existingIndex = watchedList.findIndex((item) => item.movieId === movie.id);
    let updated: WatchedMovieRecord[];

    const newRecord: WatchedMovieRecord = {
      movieId: movie.id,
      movie,
      rating: Math.max(1, Math.min(5, rating)),
      watchedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      updated = [...watchedList];
      updated[existingIndex] = newRecord;
    } else {
      updated = [...watchedList, newRecord];
    }

    setWatchedList(updated);
    await storageService.saveWatched(updated);

    if (user && user.isFirebase) {
      await firestoreService.saveWatched(user.id, updated);
    }
  };

  const toggleWatched = async (movie: Movie) => {
    const exists = isWatched(movie.id);
    let updated: WatchedMovieRecord[];

    if (exists) {
      updated = watchedList.filter((item) => item.movieId !== movie.id);
    } else {
      // Default: 5 estrelas ao marcar como assistido
      updated = [
        ...watchedList,
        {
          movieId: movie.id,
          movie,
          rating: 5,
          watchedAt: new Date().toISOString(),
        },
      ];
    }

    setWatchedList(updated);
    await storageService.saveWatched(updated);

    if (user && user.isFirebase) {
      await firestoreService.saveWatched(user.id, updated);
    }
  };

  return (
    <WatchedContext.Provider
      value={{
        watchedList,
        isWatched,
        getMovieRating,
        setWatchedRating,
        toggleWatched,
        isLoading,
      }}
    >
      {children}
    </WatchedContext.Provider>
  );
};
