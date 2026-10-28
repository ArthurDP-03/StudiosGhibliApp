import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { firestore, isFirebaseConfigured } from '../config/firebase';
import { Movie, WatchedMovieRecord } from '../models/movie';
import { UserModel } from '../models/user';

export const firestoreService = {
  async upsertUserProfile(user: UserModel): Promise<void> {
    if (!isFirebaseConfigured || !firestore) return;
    try {
      const docRef = doc(firestore, 'usuarios', user.id);
      await setDoc(
        docRef,
        {
          uid: user.id,
          name: user.name,
          email: user.email,
          birthDate: user.birthDate || null,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (e) {
      console.warn('Erro ao atualizar perfil no Firestore:', e);
    }
  },

  async getFavorites(userId: string): Promise<Movie[]> {
    if (!isFirebaseConfigured || !firestore) return [];
    try {
      const docRef = doc(firestore, 'usuarios', userId);
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists()) return [];
      const data = snapshot.data();
      return (data.favorites as Movie[]) || (data.favoritos as Movie[]) || [];
    } catch (e) {
      console.warn('Erro ao buscar favoritos no Firestore:', e);
      return [];
    }
  },

  async saveFavorites(userId: string, favorites: Movie[]): Promise<void> {
    if (!isFirebaseConfigured || !firestore) return;
    try {
      const docRef = doc(firestore, 'usuarios', userId);
      await setDoc(
        docRef,
        {
          favorites,
          favoritos: favorites,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (e) {
      console.warn('Erro ao salvar favoritos no Firestore:', e);
    }
  },

  async getWatched(userId: string): Promise<WatchedMovieRecord[]> {
    if (!isFirebaseConfigured || !firestore) return [];
    try {
      const docRef = doc(firestore, 'usuarios', userId);
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists()) return [];
      const data = snapshot.data();
      return (data.watched as WatchedMovieRecord[]) || (data.assistidos as WatchedMovieRecord[]) || [];
    } catch (e) {
      console.warn('Erro ao buscar assistidos no Firestore:', e);
      return [];
    }
  },

  async saveWatched(userId: string, watched: WatchedMovieRecord[]): Promise<void> {
    if (!isFirebaseConfigured || !firestore) return;
    try {
      const docRef = doc(firestore, 'usuarios', userId);
      await setDoc(
        docRef,
        {
          watched,
          assistidos: watched,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (e) {
      console.warn('Erro ao salvar assistidos no Firestore:', e);
    }
  },
};
