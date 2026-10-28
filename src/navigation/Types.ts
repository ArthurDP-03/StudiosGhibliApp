import { NavigatorScreenParams } from '@react-navigation/native';
import { Movie } from '../models/movie';

// Rotas do Stack de Autenticação
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

// Rotas das Abas Principais
export type MainTabsParamList = {
  CatalogTab: undefined;
  SearchTab: undefined;
  FavoritesTab: undefined;
  WatchedTab: undefined;
  ProfileTab: undefined;
};

// Rotas do Stack Principal do App (RF02)
export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabsParamList>;
  MovieDetails: { id: string; initialMovie?: Movie };
};
