// src/components/RecipeCard.js
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../constants/colors';
import { formatDifficulty } from '../utils/formatters';

const RecipeCard = ({ recipe, onPress, matchedIngredients = [] }) => {
  if (!recipe) return null;

  const prepTime = recipe.prepTimeMinutes ?? 0;
  const cookTime = recipe.cookTimeMinutes ?? 0;
  const totalTime = prepTime + cookTime;
  const mealTypeLabel =
    Array.isArray(recipe.mealType) && recipe.mealType.length > 0
      ? recipe.mealType[0]
      : 'Main Dish';

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.88}
      onPress={() => onPress && onPress(recipe)}
    >
      {/* Gambar Makanan & Badge Overlay */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: recipe.image }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Badge Kategori / Cuisine */}
        <View style={styles.cuisineBadge}>
          <Text style={styles.cuisineText}>
            {recipe.cuisine || 'Kuliner'} • {mealTypeLabel}
          </Text>
        </View>

        {/* Badge Rating */}
        {recipe.rating !== undefined && (
          <View style={styles.ratingBadge}>
            <Text style={styles.starIcon}>★</Text>
            <Text style={styles.ratingText}>
              {Number(recipe.rating).toFixed(1)}
            </Text>
            {recipe.reviewCount ? (
              <Text style={styles.reviewCountText}>({recipe.reviewCount})</Text>
            ) : null}
          </View>
        )}
      </View>

      {/* Konten Informasi Resep */}
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={2}>
            {recipe.name}
          </Text>
          <View style={styles.difficultyBadge}>
            <Text style={styles.difficultyText}>
              {formatDifficulty(recipe.difficulty)}
            </Text>
          </View>
        </View>

        {/* Baris Informasi Waktu Persiapan, Memasak, dan Kalori */}
        <View style={styles.metaContainer}>
          <View style={styles.metaPill}>
            <Text style={styles.metaIcon}>⏱️</Text>
            <Text style={styles.metaLabel}>
              Persiapan: <Text style={styles.metaBold}>{prepTime}m</Text>
            </Text>
          </View>

          <View style={styles.metaPill}>
            <Text style={styles.metaIcon}>🔥</Text>
            <Text style={styles.metaLabel}>
              Masak: <Text style={styles.metaBold}>{cookTime}m</Text>
            </Text>
          </View>

          {recipe.caloriesPerServing ? (
            <View style={styles.metaPill}>
              <Text style={styles.metaIcon}>🥗</Text>
              <Text style={styles.metaLabel}>
                <Text style={styles.metaBold}>{recipe.caloriesPerServing}</Text> kkal
              </Text>
            </View>
          ) : null}
        </View>

        {/* Jika kartu dirender dari pencarian bahan makanan, tampilkan bahan yang cocok */}
        {matchedIngredients.length > 0 && (
          <View style={styles.matchedBox}>
            <Text style={styles.matchedTitle}>
              ✓ Bahan cocok ({matchedIngredients.length}):
            </Text>
            <Text style={styles.matchedList} numberOfLines={2}>
              {matchedIngredients.join(' • ')}
            </Text>
          </View>
        )}

        {/* Footer Tags & Total Waktu */}
        <View style={styles.footerRow}>
          <View style={styles.tagsRow}>
            {(recipe.tags || []).slice(0, 3).map((tag, index) => (
              <View key={`${recipe.id}-tag-${index}`} style={styles.tagChip}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.totalTimeText}>Total {totalTime} mnt →</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 185,
    backgroundColor: COLORS.surfaceMuted,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  cuisineBadge: {
    position: 'absolute',
    top: SPACING.md,
    left: SPACING.md,
    backgroundColor: 'rgba(22, 101, 52, 0.92)',
    paddingHorizontal: SPACING.md,
    paddingVertical: 5,
    borderRadius: RADIUS.pill,
  },
  cuisineText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  ratingBadge: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.pill,
  },
  starIcon: {
    color: COLORS.amber,
    fontSize: 13,
    marginRight: 4,
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  reviewCountText: {
    color: '#CBD5E1',
    fontSize: 11,
    marginLeft: 3,
  },
  content: {
    padding: SPACING.lg,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
    lineHeight: 23,
  },
  difficultyBadge: {
    backgroundColor: COLORS.primarySoft,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  metaIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  metaLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  metaBold: {
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  matchedBox: {
    backgroundColor: COLORS.primarySurface,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
  },
  matchedTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 2,
  },
  matchedList: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    paddingTop: SPACING.sm,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    flex: 1,
  },
  tagChip: {
    backgroundColor: COLORS.surfaceMuted,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.pill,
  },
  tagText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  totalTimeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    marginLeft: SPACING.sm,
  },
});

export default RecipeCard;
