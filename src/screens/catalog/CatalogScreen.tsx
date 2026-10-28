import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/Types';
import { useMovies } from '../../hooks/useMovies';
import { MovieCard } from '../../components/MovieCard';
import { Loading } from '../../components/Loading';
import { ErrorView } from '../../components/ErrorView';
import { EmptyState } from '../../components/EmptyState';
import { Colors } from '../../config/colors';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const CatalogScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const {
    movies,
    isLoading,
    isLoadingMore,
    isRefreshing,
    errorMessage,
    hasMorePages,
    loadMoreMovies,
    refreshMovies,
  } = useMovies();

  if (isLoading && movies.length === 0) {
    return <Loading message="Despertando o catálogo do Studio Ghibli..." />;
  }

  if (errorMessage && movies.length === 0) {
    return <ErrorView message={errorMessage} onRetry={refreshMovies} />;
  }

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.footerLoader} accessible={true} accessibilityLabel="Carregando mais filmes">
        <ActivityIndicator size="small" color={Colors.primary} />
        <Text style={styles.footerText}>Buscando mais clássicos...</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <FlatList
          data={movies}
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
          onEndReached={loadMoreMovies}
          onEndReachedThreshold={0.4}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            <EmptyState
              icon="film-outline"
              title="Nenhum filme disponível"
              subtitle="Puxe a tela para baixo para tentar carregar novamente."
            />
          }
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={refreshMovies}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
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
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  footerText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
});
