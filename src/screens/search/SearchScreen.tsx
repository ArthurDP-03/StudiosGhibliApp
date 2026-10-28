import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/Types';
import { Movie } from '../../models/movie';
import { ghibliService } from '../../services/ghibliService';
import { MovieCard } from '../../components/MovieCard';
import { EmptyState } from '../../components/EmptyState';
import { ErrorView } from '../../components/ErrorView';
import { Colors } from '../../config/colors';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const SearchScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSearch = async () => {
    Keyboard.dismiss();
    const clean = searchTerm.trim();
    if (!clean) return;

    setIsLoading(true);
    setErrorMessage(null);
    setHasSearched(true);

    try {
      const data = await ghibliService.searchMovies(clean);
      setResults(data);
    } catch (e: any) {
      setErrorMessage(e.message || 'Erro ao realizar busca.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setResults([]);
    setHasSearched(false);
    setErrorMessage(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Barra de Busca com TextInput Controlado e Botão Buscar (RF08) */}
        <View style={styles.searchBarContainer}>
          <View style={styles.inputWrapper}>
            <Ionicons name="search-outline" size={20} color={Colors.textMuted} style={styles.searchIcon} />
            <TextInput
              style={styles.input}
              placeholder="Ex.: Totoro, Castle, Chihiro..."
              placeholderTextColor={Colors.textMuted}
              value={searchTerm}
              onChangeText={setSearchTerm}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
              accessible={true}
              accessibilityLabel="Campo de pesquisa de filmes por título"
            />
            {searchTerm.length > 0 && (
              <TouchableOpacity
                onPress={handleClear}
                style={styles.clearButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Limpar texto da busca"
              >
                <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearch}
            disabled={isLoading || !searchTerm.trim()}
            activeOpacity={0.8}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Botão Buscar"
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={Colors.black} />
            ) : (
              <Text style={styles.searchButtonText}>Buscar</Text>
            )}
          </TouchableOpacity>
        </View>

        {errorMessage ? (
          <ErrorView message={errorMessage} onRetry={handleSearch} />
        ) : (
          <FlatList
            data={results}
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
              hasSearched ? (
                <EmptyState
                  icon="search-outline"
                  title="Nenhum clássico encontrado"
                  subtitle={`Não localizamos filmes correspondentes a "${searchTerm}". Tente pesquisar por palavras como "Castle", "Totoro" ou "Wind".`}
                />
              ) : (
                <EmptyState
                  icon="compass-outline"
                  title="Explore o universo Ghibli"
                  subtitle="Digite o nome de uma animação e toque em Buscar para encontrar detalhes e trailers."
                />
              )
            }
          />
        )}
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
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    borderRadius: 12,
    paddingHorizontal: 12,
    minHeight: 46,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 15,
  },
  clearButton: {
    padding: 4,
  },
  searchButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 18,
    minHeight: 46,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: Colors.black,
    fontSize: 14,
    fontWeight: '800',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});
