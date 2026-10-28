import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Movie } from '../models/movie';
import { Colors } from '../config/colors';
import { AppConstants } from '../config/constants';
import { useFavorites } from '../hooks/useFavorites';

interface MovieCardProps {
  movie: Movie;
  onPress: () => void;
}

const { width } = Dimensions.get('window');
// Calcula largura para grade de 2 colunas com espaçamento adequado
const CARD_WIDTH = (width - 44) / 2;

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onPress }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [imageError, setImageError] = useState(false);
  const favorite = isFavorite(movie.id);

  const imageSource = imageError || !movie.poster
    ? { uri: AppConstants.PLACEHOLDER_POSTER }
    : { uri: movie.poster };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`Filme: ${movie.title}, lançado em ${movie.release_year}. ${
        favorite ? 'Favoritado.' : 'Não favoritado.'
      } Toque para ver detalhes.`}
    >
      <View style={styles.imageContainer}>
        <Image
          source={imageSource}
          style={styles.poster}
          resizeMode="cover"
          onError={() => setImageError(true)}
        />
        <View style={styles.gradientOverlay} />

        {/* Botão de Favorito Reativo no Card (RF04) */}
        <TouchableOpacity
          style={styles.favoriteBadge}
          onPress={() => toggleFavorite(movie)}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          accessibilityState={{ selected: favorite }}
        >
          <Ionicons
            name={favorite ? 'heart' : 'heart-outline'}
            size={22}
            color={favorite ? Colors.accentPink : Colors.white}
          />
        </TouchableOpacity>

        {/* Ano de Lançamento */}
        <View style={styles.yearBadge}>
          <Text style={styles.yearText}>{movie.release_year}</Text>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {movie.title}
        </Text>
        {movie.original_title ? (
          <Text style={styles.originalTitle} numberOfLines={1}>
            {movie.original_title}
          </Text>
        ) : null}
        <View style={styles.metaRow}>
          <Ionicons name="star" size={14} color={Colors.secondary} />
          <Text style={styles.scoreText}>
            {typeof movie.score === 'number' ? movie.score.toFixed(1) : movie.score || 'N/A'}
          </Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.durationText}>{movie.duration} min</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 3,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  imageContainer: {
    width: '100%',
    height: 190,
    position: 'relative',
    backgroundColor: Colors.surfaceLight,
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  favoriteBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(13, 23, 30, 0.75)',
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  yearBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(13, 23, 30, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  yearText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  infoContainer: {
    padding: 10,
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 18,
    marginBottom: 2,
  },
  originalTitle: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  scoreText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.secondary,
    marginLeft: 4,
  },
  dot: {
    fontSize: 12,
    color: Colors.textMuted,
    marginHorizontal: 6,
  },
  durationText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
});
