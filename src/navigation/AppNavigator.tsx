import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './Types';
import { AuthStack } from './AuthStack';
import { MainTabs } from './MainTabs';
import { MovieDetailsScreen } from '../screens/details/MovieDetailsScreen';
import { useAuth } from '../hooks/useAuth';
import { Loading } from '../components/Loading';
import { Colors } from '../config/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Loading message="Sincronizando com o mundo Ghibli..." />;
  }

  return (
    <NavigationContainer>
      {!user ? (
        // Se não autenticado, renderiza exclusivamente o Stack de Login/Cadastro (RF07)
        <AuthStack />
      ) : (
        // Se autenticado, renderiza o AppStack principal (RF02, RF07)
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: Colors.surface,
            },
            headerTintColor: Colors.textPrimary,
            headerTitleStyle: {
              fontWeight: '800',
              fontSize: 18,
            },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MovieDetails"
            component={MovieDetailsScreen}
            options={{
              title: 'Detalhes do Filme',
              headerBackTitle: 'Voltar',
            }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};
