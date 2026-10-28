import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppConstants } from '../config/constants';
import { Movie, WatchedMovieRecord } from '../models/movie';
import { UserModel } from '../models/user';

export const storageService = {
  // --- Sessão do Usuário ---
  async saveCurrentUser(user: UserModel): Promise<void> {
    await AsyncStorage.setItem(
      AppConstants.STORAGE_KEYS.USER_SESSION,
      JSON.stringify(user)
    );
  },

  async getCurrentUser(): Promise<UserModel | null> {
    try {
      const json = await AsyncStorage.getItem(AppConstants.STORAGE_KEYS.USER_SESSION);
      return json ? (JSON.parse(json) as UserModel) : null;
    } catch {
      return null;
    }
  },

  async clearSession(): Promise<void> {
    await AsyncStorage.removeItem(AppConstants.STORAGE_KEYS.USER_SESSION);
  },

  // --- Contas Locais (Baseline RF07) ---
  async getLocalAccounts(): Promise<Record<string, { passwordHash: string; user: UserModel }>> {
    try {
      const json = await AsyncStorage.getItem(AppConstants.STORAGE_KEYS.LOCAL_ACCOUNTS);
      return json ? JSON.parse(json) : {};
    } catch {
      return {};
    }
  },

  async saveLocalAccount(email: string, passwordHash: string, user: UserModel): Promise<void> {
    const accounts = await this.getLocalAccounts();
    accounts[email.toLowerCase().trim()] = {
      passwordHash,
      user,
    };
    await AsyncStorage.setItem(
      AppConstants.STORAGE_KEYS.LOCAL_ACCOUNTS,
      JSON.stringify(accounts)
    );
  },

  // --- Favoritos (Baseline RF06) ---
  async getFavorites(): Promise<Movie[]> {
    try {
      const json = await AsyncStorage.getItem(AppConstants.STORAGE_KEYS.FAVORITES);
      return json ? (JSON.parse(json) as Movie[]) : [];
    } catch {
      return [];
    }
  },

  async saveFavorites(favorites: Movie[]): Promise<void> {
    await AsyncStorage.setItem(
      AppConstants.STORAGE_KEYS.FAVORITES,
      JSON.stringify(favorites)
    );
  },

  // --- Filmes Assistidos com Notas (RF07) ---
  async getWatched(): Promise<WatchedMovieRecord[]> {
    try {
      const json = await AsyncStorage.getItem(AppConstants.STORAGE_KEYS.WATCHED);
      return json ? (JSON.parse(json) as WatchedMovieRecord[]) : [];
    } catch {
      return [];
    }
  },

  async saveWatched(watched: WatchedMovieRecord[]): Promise<void> {
    await AsyncStorage.setItem(
      AppConstants.STORAGE_KEYS.WATCHED,
      JSON.stringify(watched)
    );
  },
};
