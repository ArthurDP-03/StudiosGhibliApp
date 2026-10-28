export const AppConstants = {
  APP_NAME: 'GhibliApp',
  API_BASE_URL: 'https://studio-ghibli-movies-api.onrender.com',

  // Configurações de paginação do catálogo cliente
  PAGE_SIZE: 6,

  // Chaves de armazenamento local (AsyncStorage)
  STORAGE_KEYS: {
    USER_SESSION: '@ghibli_user_session',
    LOCAL_ACCOUNTS: '@ghibli_local_accounts',
    FAVORITES: '@ghibli_favorites',
    WATCHED: '@ghibli_watched',
  },

  // Imagem de fallback confiável para pôsteres caso a URL esteja indisponível
  PLACEHOLDER_POSTER: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80',
};
