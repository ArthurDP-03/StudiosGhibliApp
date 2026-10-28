import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Movie } from '../models/movie';
import { storageService } from '../services/storageService';
import { firestoreService } from '../services/firestoreService';
import { AuthContext } from './AuthContext';

interface FavoritesContextData {
  favorites: Movie[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (movie: Movie) => Promise<void>;
  isLoading: boolean;
}

export const FavoritesContext = createContext<FavoritesContextData>({} as FavoritesContextData);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega favoritos ao iniciar ou trocar de usuário
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const localItems = await storageService.getFavorites();

        if (user && user.isFirebase) {
          const cloudItems = await firestoreService.getFavorites(user.id);
          if (cloudItems.length > 0) {
            setFavorites(cloudItems);
            await storageService.saveFavorites(cloudItems);
          } else if (localItems.length > 0) {
            // Sincroniza local -> nuvem
            await firestoreService.saveFavorites(user.id, localItems);
            setFavorites(localItems);
          } else {
            setFavorites([]);
          }
        } else {
          setFavorites(localItems);
        }
      } catch (e) {
        console.warn('Erro ao carregar favoritos:', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [user]);

  const isFavorite = (id: string): boolean => {
    return favorites.some((item) => item.id === id);
  };

  const toggleFavorite = async (movie: Movie) => {
    const exists = isFavorite(movie.id);
    let updated: Movie[];

    if (exists) {
      updated = favorites.filter((item) => item.id !== movie.id);
    } else {
      updated = [...favorites, movie];
    }

    setFavorites(updated);
    await storageService.saveFavorites(updated);

    if (user && user.isFirebase) {
      await firestoreService.saveFavorites(user.id, updated);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite, isLoading }}>
      {children}
    </FavoritesContext.Provider>
  );
};
