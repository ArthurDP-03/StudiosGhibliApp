import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../config/colors';

interface StarRatingProps {
  rating: number; // 0 a 5
  maxStars?: number;
  onRatingPress?: (rating: number) => void;
  size?: number;
  interactive?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  onRatingPress,
  size = 24,
  interactive = false,
}) => {
  const stars = [];

  for (let i = 1; i <= maxStars; i++) {
    const isFilled = i <= rating;

    if (interactive && onRatingPress) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => onRatingPress(i)}
          style={styles.starTouch}
          hitSlop={{ top: 10, bottom: 10, left: 6, right: 6 }}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Avaliar com ${i} de ${maxStars} estrelas`}
          accessibilityState={{ selected: isFilled }}
        >
          <Ionicons
            name={isFilled ? 'star' : 'star-outline'}
            size={size}
            color={isFilled ? Colors.starFilled : Colors.starEmpty}
          />
        </TouchableOpacity>
      );
    } else {
      stars.push(
        <View key={i} style={styles.starStatic}>
          <Ionicons
            name={isFilled ? 'star' : 'star-outline'}
            size={size}
            color={isFilled ? Colors.starFilled : Colors.starEmpty}
          />
        </View>
      );
    }
  }

  return (
    <View
      style={styles.container}
      accessible={!interactive}
      accessibilityLabel={`Nota: ${rating} de ${maxStars} estrelas`}
    >
      <View style={styles.starsRow}>{stars}</View>
      {rating > 0 && <Text style={styles.ratingText}>{rating.toFixed(0)}/5</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starTouch: {
    padding: 2,
    minHeight: 44, // 44pt acessibilidade (RF10)
    minWidth: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  starStatic: {
    padding: 2,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.secondary,
    marginLeft: 4,
  },
});
