import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../config/firebase';
import { UserModel } from '../models/user';
import { storageService } from './storageService';
import { firestoreService } from './firestoreService';
import { hashPassword } from '../utils/crypto';

export const authService = {
  async login(email: string, password: string):Promise<UserModel> {
    const cleanEmail = email.toLowerCase().trim();

    // 1. Tentativa via Firebase Auth (Bônus RF07)
    if (isFirebaseConfigured && auth) {
      try {
        const credential = await signInWithEmailAndPassword(auth, cleanEmail, password);
        const fbUser = credential.user;

        const user: UserModel = {
          id: fbUser.uid,
          name: fbUser.displayName || nameFromEmail(cleanEmail),
          email: fbUser.email || cleanEmail,
          isFirebase: true,
        };

        await firestoreService.upsertUserProfile(user);
        await storageService.saveCurrentUser(user);
        return user;
      } catch (error: any) {
        // Se o erro for de conexão, tentamos fallback local
        if (error.code === 'auth/network-request-failed') {
          console.warn('Rede indisponível no Firebase. Tentando login local...');
        } else {
          throw new Error(mapFirebaseAuthError(error.code));
        }
      }
    }

    // 2. Fallback para Autenticação Local Segura (Baseline RF07)
    const accounts = await storageService.getLocalAccounts();
    const account = accounts[cleanEmail];
    if (!account) {
      throw new Error('Conta não encontrada. Cadastre-se antes de entrar.');
    }

    const hashedInput = await hashPassword(password);
    if (account.passwordHash !== hashedInput) {
      throw new Error('Senha incorreta.');
    }

    await storageService.saveCurrentUser(account.user);
    return account.user;
  },

  async register(name: string, email: string, password: string, birthDate?: string): Promise<UserModel> {
    const cleanName = name.trim();
    const cleanEmail = email.toLowerCase().trim();

    if (!cleanName) throw new Error('Por favor, informe seu nome.');
    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      throw new Error('Informe um e-mail válido.');
    }
    if (password.length < 6) {
      throw new Error('A senha deve ter pelo menos 6 caracteres.');
    }

    // 1. Cadastro via Firebase Auth (Bônus RF07)
    if (isFirebaseConfigured && auth) {
      try {
        const credential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        const fbUser = credential.user;

        await updateProfile(fbUser, { displayName: cleanName });

        const user: UserModel = {
          id: fbUser.uid,
          name: cleanName,
          email: cleanEmail,
          birthDate,
          isFirebase: true,
        };

        await firestoreService.upsertUserProfile(user);
        await storageService.saveCurrentUser(user);
        return user;
      } catch (error: any) {
        throw new Error(mapFirebaseAuthError(error.code));
      }
    }

    // 2. Cadastro Local Seguro (Baseline RF07)
    const accounts = await storageService.getLocalAccounts();
    if (accounts[cleanEmail]) {
      throw new Error('Este e-mail já está cadastrado localmente. Faça login.');
    }

    const passwordHash = await hashPassword(password);
    const user: UserModel = {
      id: String(Date.now()),
      name: cleanName,
      email: cleanEmail,
      birthDate,
      isFirebase: false,
    };

    await storageService.saveLocalAccount(cleanEmail, passwordHash, user);
    await storageService.saveCurrentUser(user);
    return user;
  },

  async logout(): Promise<void> {
    if (isFirebaseConfigured && auth) {
      try {
        await signOut(auth);
      } catch (e) {
        console.warn('Erro ao deslogar do Firebase:', e);
      }
    }
    await storageService.clearSession();
  },

  async getCurrentUser(): Promise<UserModel | null> {
    return await storageService.getCurrentUser();
  },
};

function nameFromEmail(email: string): string {
  const prefix = email.split('@')[0] || 'Aventureiro';
  return prefix.charAt(0).toUpperCase() + prefix.slice(1);
}

function mapFirebaseAuthError(code: string): string {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'E-mail ou senha incorretos.';
    case 'auth/email-already-in-use':
      return 'Este e-mail já está cadastrado. Faça login.';
    case 'auth/weak-password':
      return 'A senha deve conter no mínimo 6 caracteres.';
    case 'auth/invalid-email':
      return 'Formato de e-mail inválido.';
    default:
      return 'Erro na autenticação. Verifique os dados informados.';
  }
}
