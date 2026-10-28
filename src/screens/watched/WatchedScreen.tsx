import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/Types';
import { useWatched } from '../../hooks/useWatched';
import { StarRating } from '../../components/StarRating';
import { EmptyState } from '../../components/EmptyState';
import { Loading } from '../../components/Loading';
import { Colors } from '../../config/colors';
import { AppConstants } from '../../config/constants';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const WatchedScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { watchedList, isLoading, setWatchedRating } = useWatched();

  if (isLoading && watchedList.length === 0) {
    return <Loading message="Calculando seu histórico cinematográfico..." />;
  }

  // Estatísticas do usuário
  const totalWatched = watchedList.length;
  const averageRating =
    totalWatched > 0
      ? (
          watchedList.reduce((acc, curr) => acc + curr.rating, 0) / totalWatched
        ).toFixed(1)
      : '0.0';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Painel de Estatísticas de Obras Consumidas (RF07) */}
        {totalWatched > 0 && (
          <View style={styles.statsBanner}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{totalWatched}</Text>
              <Text style={styles.statLabel}>Filmes Assistidos</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={[styles.statNumber, { color: Colors.secondary }]}>
                ★ {averageRating}
              </Text>
              <Text style={styles.statLabel}>Média das Suas Notas</Text>
            </View>
          </View>
        )}

        <FlatList
          data={watchedList}
          keyExtractor={(item) => item.movieId}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.watchedCard}
              onPress={() =>
                navigation.navigate('MovieDetails', {
                  id: item.movie.id,
                  initialMovie: item.movie,
                })
              }
              activeOpacity={0.8}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`${item.movie.title}, nota atribuída: ${item.rating} de 5 estrelas. Toque para ver detalhes.`}
            >
              <Image
                source={{ uri: item.movie.poster || AppConstants.PLACEHOLDER_POSTER }}
                style={styles.posterThumbnail}
                resizeMode="cover"
              />

              <View style={styles.cardInfo}>
                <Text style={styles.movieTitle} numberOfLines={1}>
                  {item.movie.title}
                </Text>
                <Text style={styles.movieMeta}>
                  {item.movie.release_year} • {item.movie.duration} min
                </Text>

                <View style={styles.ratingRow}>
                  <Text style={styles.ratingLabel}>Sua avaliação:</Text>
                  <StarRating
                    rating={item.rating}
                    interactive={true}
                    size={20}
                    onRatingPress={(r) => setWatchedRating(item.movie, r)}
                  />
                </View>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <EmptyState
              icon="eye-off-outline"
              title="Nenhum filme assistido ainda"
              subtitle="Abra qualquer filme do catálogo e toque em 'Marcar como Assistido' para atribuir sua nota de 1 a 5 estrelas!"
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
  statsBanner: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  watchedCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 10,
    gap: 12,
  },
  posterThumbnail: {
    width: 70,
    height: 95,
    borderRadius: 8,
    backgroundColor: Colors.surfaceLight,
  },
  cardInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  movieTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  movieMeta: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'column',
    gap: 4,
  },
  ratingLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
});
