import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/contexts/AuthContext';
import { MoviesProvider } from './src/contexts/MoviesContext';
import { FavoritesProvider } from './src/contexts/FavoritesContext';
import { WatchedProvider } from './src/contexts/WatchedContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <AuthProvider>
        <MoviesProvider>
          <FavoritesProvider>
            <WatchedProvider>
              <AppNavigator />
            </WatchedProvider>
          </FavoritesProvider>
        </MoviesProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
