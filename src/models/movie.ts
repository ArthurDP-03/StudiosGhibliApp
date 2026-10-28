export interface Movie {
  id: string;
  title: string;
  original_title: string;
  alternative_title: string;
  title_image?: string;
  poster: string;
  alternative_poster?: string;
  description: string;
  promotional_image?: string;
  director: string;
  release_year: number;
  duration: number; // Em minutos
  mpaa?: string;
  score?: number | string;
  trailer?: string;
  genres: string[];
  gallery?: string[];
}

export interface WatchedMovieRecord {
  movieId: string;
  movie: Movie;
  rating: number; // Nota pessoal de 1 a 5 estrelas
  watchedAt: string; // ISO string
}
