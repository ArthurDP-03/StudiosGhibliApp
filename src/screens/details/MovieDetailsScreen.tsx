import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Dimensions,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/Types';
import { Movie } from '../../models/movie';
import { ghibliService } from '../../services/ghibliService';
import { useFavorites } from '../../hooks/useFavorites';
import { useWatched } from '../../hooks/useWatched';
import { Loading } from '../../components/Loading';
import { ErrorView } from '../../components/ErrorView';
import { StarRating } from '../../components/StarRating';
import { Colors } from '../../config/colors';
import { AppConstants } from '../../config/constants';

type Props = NativeStackScreenProps<RootStackParamList, 'MovieDetails'>;

const { width } = Dimensions.get('window');

export const MovieDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { id, initialMovie } = route.params;
  const [movie, setMovie] = useState<Movie | null>(initialMovie || null);
  const [isLoading, setIsLoading] = useState(!initialMovie);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { isFavorite, toggleFavorite } = useFavorites();
  const { isWatched, getMovieRating, setWatchedRating, toggleWatched } = useWatched();

  // Segunda requisição (Axios) para buscar os dados completos do item pelo ID (RF03)
  useEffect(() => {
    let isMounted = true;

    async function fetchDetails() {
      try {
        const fullData = await ghibliService.getMovieById(id);
        if (isMounted) {
          setMovie(fullData);
        }
      } catch (e: any) {
        if (isMounted && !initialMovie) {
          setErrorMessage(e.message || 'Falha ao buscar detalhes do filme.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchDetails();

    return () => {
      isMounted = false;
    };
  }, [id, initialMovie]);

  // Atualização dinâmica do título do header com o nome do filme (RF02) e ações
  useLayoutEffect(() => {
    if (movie) {
      const favorite = isFavorite(movie.id);
      const watched = isWatched(movie.id);

      navigation.setOptions({
        title: movie.title,
        headerRight: () => (
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => toggleWatched(movie)}
              style={styles.headerButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={watched ? 'Marcar como não assistido' : 'Marcar como assistido'}
              accessibilityState={{ selected: watched }}
            >
              <Ionicons
                name={watched ? 'eye' : 'eye-outline'}
                size={22}
                color={watched ? Colors.secondary : Colors.textPrimary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => toggleFavorite(movie)}
              style={styles.headerButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={favorite ? 'Remover dos favoritos' : 'Favoritar este filme'}
              accessibilityState={{ selected: favorite }}
            >
              <Ionicons
                name={favorite ? 'heart' : 'heart-outline'}
                size={22}
                color={favorite ? Colors.accentPink : Colors.textPrimary}
              />
            </TouchableOpacity>
          </View>
        ),
      });
    }
  }, [navigation, movie, isFavorite, isWatched, toggleFavorite, toggleWatched]);

  if (isLoading && !movie) {
    return <Loading message="Buscando detalhes do filme..." />;
  }

  if (errorMessage && !movie) {
    return (
      <ErrorView
        message={errorMessage}
        onRetry={() => {
          setIsLoading(true);
          setErrorMessage(null);
          ghibliService.getMovieById(id).then(setMovie).catch((e) => setErrorMessage(e.message));
        }}
      />
    );
  }

  if (!movie) return null;

  const favorite = isFavorite(movie.id);
  const watched = isWatched(movie.id);
  const userRating = getMovieRating(movie.id);

  const openTrailer = () => {
    if (movie.trailer) {
      Linking.openURL(movie.trailer).catch(() => {
        alert('Não foi possível abrir o trailer no momento.');
      });
    }
  };

  const handleShare = () => {
    Share.share({
      message: `Confira o filme "${movie.title}" (${movie.release_year}) do Studio Ghibli no GhibliApp!`,
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Imagem do Poster em Destaque */}
      <View style={styles.posterContainer}>
        <Image
          source={{ uri: movie.promotional_image || movie.poster || AppConstants.PLACEHOLDER_POSTER }}
          style={styles.heroPoster}
          resizeMode="cover"
        />
        <View style={styles.heroGradient} />

        <View style={styles.heroOverlay}>
          <Text style={styles.mainTitle}>{movie.title}</Text>
          {movie.original_title ? (
            <Text style={styles.japaneseTitle}>
              {movie.original_title} {movie.alternative_title ? `(${movie.alternative_title})` : ''}
            </Text>
          ) : null}
        </View>
      </View>

      <View style={styles.body}>
        {/* Chips de Informações Rápidas */}
        <View style={styles.chipsRow}>
          <View style={styles.chip}>
            <Ionicons name="calendar-outline" size={14} color={Colors.primary} />
            <Text style={styles.chipText}>{movie.release_year}</Text>
          </View>
          <View style={styles.chip}>
            <Ionicons name="time-outline" size={14} color={Colors.accent} />
            <Text style={styles.chipText}>{movie.duration} min</Text>
          </View>
          <View style={styles.chip}>
            <Ionicons name="star" size={14} color={Colors.secondary} />
            <Text style={styles.chipText}>Ghibli {movie.score || '8.5'}</Text>
          </View>
          {movie.mpaa ? (
            <View style={styles.chip}>
              <Text style={styles.chipText}>Classif. {movie.mpaa}</Text>
            </View>
          ) : null}
        </View>

        {/* Gêneros */}
        {movie.genres && movie.genres.length > 0 && (
          <View style={styles.genresRow}>
            {movie.genres.map((genre, idx) => (
              <View key={idx} style={styles.genreBadge}>
                <Text style={styles.genreText}>{genre}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Card de Avaliação Pessoal e Assistido (RF07) */}
        <View style={styles.ratingCard}>
          <View style={styles.ratingHeader}>
            <View style={styles.ratingTitleWrapper}>
              <Ionicons
                name={watched ? 'checkmark-circle' : 'time-outline'}
                size={20}
                color={watched ? Colors.primary : Colors.textMuted}
              />
              <Text style={styles.ratingCardTitle}>
                {watched ? 'Filme Assistido' : 'Marcar como Assistido'}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.watchedToggleButton, watched && styles.watchedActiveButton]}
              onPress={() => toggleWatched(movie)}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={watched ? 'Remover da lista de assistidos' : 'Registrar como assistido'}
            >
              <Text style={[styles.watchedButtonText, watched && styles.watchedActiveButtonText]}>
                {watched ? 'Assistido ✓' : '+ Adicionar'}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.ratingPrompt}>
            {watched
              ? 'Sua nota pessoal para esta obra (1 a 5 estrelas):'
              : 'Dê sua nota de 1 a 5 estrelas após assistir:'}
          </Text>

          <View style={styles.starsWrapper}>
            <StarRating
              rating={userRating}
              interactive={true}
              size={32}
              onRatingPress={(r) => setWatchedRating(movie, r)}
            />
          </View>
        </View>

        {/* Sinopse Sanitizada (RF03) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sinopse</Text>
          <Text style={styles.descriptionText}>
            {movie.description || 'Nenhuma descrição fornecida pela API.'}
          </Text>
        </View>

        {/* Direção e Equipe */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ficha Técnica</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Direção:</Text>
            <Text style={styles.infoValue}>{movie.director}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Estúdio:</Text>
            <Text style={styles.infoValue}>Studio Ghibli</Text>
          </View>
        </View>

        {/* Botão de Trailer Oficial */}
        {movie.trailer ? (
          <TouchableOpacity
            style={styles.trailerButton}
            onPress={openTrailer}
            activeOpacity={0.8}
            accessible={true}
            accessibilityRole="link"
            accessibilityLabel="Assistir trailer oficial no YouTube"
          >
            <Ionicons name="logo-youtube" size={22} color={Colors.white} />
            <Text style={styles.trailerButtonText}>ASSISTIR TRAILER OFICIAL</Text>
          </TouchableOpacity>
        ) : null}

        {/* Galeria de Cenas */}
        {movie.gallery && movie.gallery.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Galeria de Cenas ({movie.gallery.length})</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.galleryContent}
            >
              {movie.gallery.map((imgUrl, i) => (
                <View key={i} style={styles.galleryItem}>
                  <Image source={{ uri: imgUrl }} style={styles.galleryImage} resizeMode="cover" />
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Compartilhar */}
        <TouchableOpacity
          style={styles.shareButton}
          onPress={handleShare}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Compartilhar recomendação deste filme"
        >
          <Ionicons name="share-social-outline" size={18} color={Colors.textSecondary} />
          <Text style={styles.shareText}>Compartilhar Recomendação</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingBottom: 40,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerButton: {
    padding: 6,
    minHeight: 44,
    minWidth: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  posterContainer: {
    width: '100%',
    height: 280,
    position: 'relative',
    backgroundColor: Colors.surface,
  },
  heroPoster: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 120,
    backgroundColor: 'rgba(13, 23, 30, 0.85)',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
    lineHeight: 28,
  },
  japaneseTitle: {
    fontSize: 13,
    color: Colors.primary,
    marginTop: 4,
    fontWeight: '600',
  },
  body: {
    padding: 16,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  chipText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  genresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
  },
  genreBadge: {
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  genreText: {
    color: Colors.accent,
    fontSize: 12,
    fontWeight: '600',
  },
  ratingCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  ratingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  ratingTitleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingCardTitle: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  watchedToggleButton: {
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    minHeight: 36,
    justifyContent: 'center',
  },
  watchedActiveButton: {
    backgroundColor: Colors.primaryDark,
  },
  watchedButtonText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  watchedActiveButtonText: {
    color: Colors.white,
  },
  ratingPrompt: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginBottom: 10,
  },
  starsWrapper: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  descriptionText: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 4,
  },
  infoLabel: {
    width: 80,
    color: Colors.textMuted,
    fontSize: 13,
  },
  infoValue: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  trailerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#CC181E', // YouTube Red
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 24,
    gap: 8,
    minHeight: 48,
  },
  trailerButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  galleryContent: {
    gap: 12,
  },
  galleryItem: {
    width: 200,
    height: 120,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: Colors.surfaceLight,
  },
  galleryImage: {
    width: '100%',
    height: '100%',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
    minHeight: 44,
  },
  shareText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
});
