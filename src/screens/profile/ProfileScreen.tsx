import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { useFavorites } from '../../hooks/useFavorites';
import { useWatched } from '../../hooks/useWatched';
import { Colors } from '../../config/colors';

export const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const { favorites } = useFavorites();
  const { watchedList } = useWatched();

  const handleLogoutConfirm = () => {
    Alert.alert(
      'Encerrar Sessão',
      'Deseja realmente sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: () => logout(),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={44} color={Colors.primary} />
          </View>
          <Text style={styles.userName}>{user?.name || 'Aventureiro Ghibli'}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>

          <View style={[styles.badge, user?.isFirebase ? styles.cloudBadge : styles.localBadge]}>
            <Ionicons
              name={user?.isFirebase ? 'cloud-done-outline' : 'phone-portrait-outline'}
              size={14}
              color={user?.isFirebase ? Colors.primary : Colors.secondary}
            />
            <Text style={[styles.badgeText, { color: user?.isFirebase ? Colors.primary : Colors.secondary }]}>
              {user?.isFirebase ? 'Sessão Firebase em Nuvem' : 'Sessão Offline Local'}
            </Text>
          </View>
        </View>

        {/* Resumo de Atividades */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="heart" size={24} color={Colors.accentPink} />
            <Text style={styles.statNumber}>{favorites.length}</Text>
            <Text style={styles.statLabel}>Favoritos</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="eye" size={24} color={Colors.secondary} />
            <Text style={styles.statNumber}>{watchedList.length}</Text>
            <Text style={styles.statLabel}>Assistidos</Text>
          </View>
        </View>

        {/* Informações da Disciplina */}
        <View style={styles.infoCard}>
          <Text style={styles.cardHeader}>Sobre o Projeto</Text>
          <Text style={styles.projectDesc}>
            Desenvolvimento Mobile Híbrido — Somativo React Native + Expo (Catálogo Studios Ghibli 2.0).
          </Text>
          <View style={styles.tagRow}>
            <Text style={styles.techTag}>React Native</Text>
            <Text style={styles.techTag}>Expo SDK 58</Text>
            <Text style={styles.techTag}>TypeScript</Text>
            <Text style={styles.techTag}>Firebase Web</Text>
            <Text style={styles.techTag}>AsyncStorage</Text>
          </View>
        </View>

        {/* Botão de Logout (RF07) */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogoutConfirm}
          activeOpacity={0.8}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Botão Encerrar Sessão"
        >
          <Ionicons name="log-out-outline" size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Encerrar Sessão</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
    marginBottom: 12,
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    marginTop: 10,
    gap: 6,
    borderWidth: 1,
  },
  cloudBadge: {
    backgroundColor: 'rgba(78, 186, 150, 0.15)',
    borderColor: Colors.primary,
  },
  localBadge: {
    backgroundColor: 'rgba(244, 178, 81, 0.15)',
    borderColor: Colors.secondary,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statsContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 6,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  infoCard: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 28,
  },
  cardHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  projectDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
    marginBottom: 12,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  techTag: {
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 11,
    color: Colors.accent,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: Colors.errorSurface,
    borderWidth: 1,
    borderColor: Colors.error,
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
    minHeight: 48,
  },
  logoutText: {
    color: Colors.error,
    fontSize: 15,
    fontWeight: '700',
  },
});
