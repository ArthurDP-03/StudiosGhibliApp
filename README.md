# GhibliApp — Catálogo Interativo Studios Ghibli 2.0 🍃

Projeto Somativo desenvolvido em **React Native + Expo (TypeScript)** para a disciplina de **Desenvolvimento Mobile Híbrido** (Bacharelado em Sistemas de Informação - BSI).

---

## 👥 Integrantes do Grupo
1. Arthur de Oliveira Carvalho
2. Caio Eduardo Lamoglia
3. João Victor Saboya Ribeiro de Carvalho
4. Matheus De Bortoli Silva

---

## 🚀 Funcionalidades Implementadas (RF01 – RF10)

- **RF01 — Catálogo em Grade & Paginação**: Listagem com `FlatList` em 2 colunas, paginação virtualizada com `onEndReached` e `ListFooterComponent`, além de gesto Pull-to-Refresh.
- **RF02 — Navegação Fluida**: Utilização do React Navigation com Native Stack (`@react-navigation/native-stack`), passagem de parâmetros de rota e atualização dinâmica de títulos com `navigation.setOptions`.
- **RF03 — Detalhes Completos do Filme**: Consulta por ID via Axios, pôster em destaque, metadados (ano, duração, nota, gêneros, direção), galeria de fotos, link para o trailer oficial e sanitização de tags HTML.
- **RF04 & RF05 — Favoritos com Context API**: Gerenciamento global de estado (`FavoritesContext`), sincronização em tempo real entre card e tela de detalhes, e tela dedicada de favoritos com estado vazio amigável (`ListEmptyComponent`).
- **RF06 — Persistência Híbrida**: 
  - **Baseline obrigatório**: Armazenamento local persistente com `@react-native-async-storage/async-storage`.
  - **Bônus (+10%)**: Sincronização em nuvem em tempo real com **Cloud Firestore** na coleção `usuarios/{userId}`.
- **RF07 — Login, Sessão e Filmes Consumidos**:
  - **Autenticação**: Navegação condicional via `AuthContext`, persistência de sessão e botão de logout. Suporte híbrido (Firebase Auth e cadastro local com senha em hash SHA-256 via `expo-crypto`).
  - **Filmes Consumidos**: Opção para marcar obras como assistidas e atribuir notas pessoais de 1 a 5 estrelas via componente interativo `StarRating`, com aba dedicada exibindo médias e estatísticas.
- **RF08 — Busca Dinâmica**: Campo de busca com `TextInput` controlado e botão "Buscar" acionando a API com tratamento visual para ausência de resultados.
- **RF09 — Feedback Visual de UI**: Indicadores de progresso (`ActivityIndicator`), tratamento de cold start da API e telas amigáveis de erro com botão "Tentar novamente".
- **RF10 — Acessibilidade**: Rótulos descritivos (`accessibilityLabel`, `accessibilityRole`, `accessibilityState`), áreas mínimas de toque de 44x44 pt com `hitSlop`, suporte a fontes escalonáveis e paleta com contraste refinado.

---

## 🛠️ Tecnologias Utilizadas

- **Core**: React Native (v0.88), React 19, TypeScript
- **Framework & Ferramentas**: Expo SDK 58 (Managed Workflow)
- **Navegação**: `@react-navigation/native`, `@react-navigation/native-stack`, `@react-navigation/bottom-tabs`
- **Comunicação HTTP**: Axios
- **Armazenamento Local**: `@react-native-async-storage/async-storage`
- **Criptografia**: `expo-crypto` (SHA-256)
- **Nuvem & Backend**: Firebase Web SDK (Firebase Authentication + Cloud Firestore)
- **Ícones**: `@expo/vector-icons` (Ionicons)

---

## 💻 Como Executar o Projeto

### 1. Clonar o repositório e instalar dependências
```bash
npm install
```

### 2. Configurar as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:
```env
EXPO_PUBLIC_API_BASE_URL=https://studio-ghibli-movies-api.onrender.com

# Credenciais do Firebase Console (Web App)
EXPO_PUBLIC_FIREBASE_API_KEY=sua_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=seu_projeto
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=seu_app_id
```

### 3. Iniciar o servidor de desenvolvimento
```bash
npx expo start
```
- Pressione `a` para abrir no emulador Android conectado.
- Pressione `i` para abrir no simulador iOS (macOS).
- Pressione `w` para testar no navegador Web.
- Ou escaneie o QR Code no seu smartphone através do app **Expo Go** (Android/iOS).

---

## 📁 Estrutura de Pastas

```text
src/
├── components/          # Componentes reutilizáveis (MovieCard, StarRating, ErrorView, Loading, EmptyState)
├── config/              # Cores temáticas, constantes e inicialização do Firebase
├── contexts/            # Provedores de estado global (AuthContext, MoviesContext, FavoritesContext, WatchedContext)
├── hooks/               # Custom hooks (useAuth, useMovies, useFavorites, useWatched)
├── models/              # Interfaces TypeScript de dados (Movie, UserModel, WatchedMovieRecord)
├── navigation/          # Navegação declarativa (AppNavigator, AuthStack, MainTabs, Types)
├── screens/             # Telas da aplicação (Login, Register, Catalog, Details, Search, Favorites, Watched, Profile)
├── services/            # Serviços isolados (ghibliService, authService, firestoreService, storageService)
└── utils/               # Funções utilitárias (crypto com SHA-256, textCleaner)
```
