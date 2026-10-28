import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { MainTabsParamList } from './Types';
import { CatalogScreen } from '../screens/catalog/CatalogScreen';
import { SearchScreen } from '../screens/search/SearchScreen';
import { FavoritesScreen } from '../screens/favorites/FavoritesScreen';
import { WatchedScreen } from '../screens/watched/WatchedScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { Colors } from '../config/colors';

const Tab = createBottomTabNavigator<MainTabsParamList>();

export const MainTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.surface,
          shadowColor: 'transparent',
          elevation: 0,
        },
        headerTitleStyle: {
          color: Colors.textPrimary,
          fontWeight: '800',
          fontSize: 18,
        },
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="CatalogTab"
        component={CatalogScreen}
        options={{
          title: 'Catálogo',
          headerTitle: 'Catálogo Studio Ghibli',
          tabBarLabel: 'Catálogo',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'film' : 'film-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="SearchTab"
        component={SearchScreen}
        options={{
          title: 'Buscar',
          headerTitle: 'Pesquisar Obras',
          tabBarLabel: 'Busca',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'search' : 'search-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="FavoritesTab"
        component={FavoritesScreen}
        options={{
          title: 'Favoritos',
          headerTitle: 'Meus Favoritos',
          tabBarLabel: 'Favoritos',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'heart' : 'heart-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="WatchedTab"
        component={WatchedScreen}
        options={{
          title: 'Assistidos',
          headerTitle: 'Filmes Assistidos',
          tabBarLabel: 'Assistidos',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'eye' : 'eye-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          title: 'Perfil',
          headerTitle: 'Minha Conta',
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
