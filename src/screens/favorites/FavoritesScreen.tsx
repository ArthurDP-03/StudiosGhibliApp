import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/Types';
import { useFavorites } from '../../hooks/useFavorites';
import { MovieCard } from '../../components/MovieCard';
import { EmptyState } from '../../components/EmptyState';
import { Loading } from '../../components/Loading';
import { Colors } from '../../config/colors';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const FavoritesScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { favorites, isLoading } = useFavorites();

  if (isLoading && favorites.length === 0) {
    return <Loading message="Buscando seus filmes favoritos..." />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <MovieCard
              movie={item}
              onPress={() => navigation.navigate('MovieDetails', { id: item.id, initialMovie: item })}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              icon="heart-dislike-outline"
              title="Nenhum favorito guardado"
              subtitle="Toque no ícone de coração em qualquer card ou tela de detalhes para colecionar suas obras prediletas aqui."
            />
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    flexGrow: 1,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});
