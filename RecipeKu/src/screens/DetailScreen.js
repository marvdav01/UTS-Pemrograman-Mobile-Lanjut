// src/screens/DetailScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRecipeDetail } from '../hooks/useRecipes';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import { COLORS, SPACING, RADIUS } from '../constants/colors';
import {
  buildRecipeDescription,
  formatDifficulty,
  formatTotalTime,
} from '../utils/formatters';

const DetailScreen = ({ route, navigation }) => {
  const recipeId = route?.params?.recipeId;
  const insets = useSafeAreaInsets();
  const [activeSection, setActiveSection] = useState('all'); // 'all' | 'ingredients' | 'instructions'
  const [checkedIngredients, setCheckedIngredients] = useState({});

  const {
    data: recipe,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useRecipeDetail(recipeId);

  const toggleIngredientCheck = (index) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (isLoading && !recipe) {
    return (
      <Loading
        message="Memuat Detail Resep..."
        subMessage={`Mengambil endpoint GET /recipes/${recipeId}`}
      />
    );
  }

  if (isError || !recipe) {
    return (
      <ErrorState
        title="Gagal Memuat Detail Resep"
        message={
          error?.message ||
          'Resep yang Anda pilih tidak dapat dimuat saat ini. Silakan coba lagi.'
        }
        errorDetails={`Endpoint: GET https://dummyjson.com/recipes/${recipeId}`}
        onRetry={refetch}
      />
    );
  }

  const ingredients = recipe.ingredients || [];
  const instructions = recipe.instructions || [];
  const checkedCount = Object.values(checkedIngredients).filter(Boolean).length;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingBottom: Math.max(insets.bottom + 32, 48) },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Gambar Hero Makanan */}
      <View style={styles.heroContainer}>
        <Image
          source={{ uri: recipe.image }}
          style={styles.heroImage}
          resizeMode="cover"
        />

        {/* Overlay Badges */}
        <View style={styles.heroTopOverlay}>
          <View style={styles.cuisinePill}>
            <Text style={styles.cuisinePillText}>
              🌍 {recipe.cuisine || 'Internasional'}
            </Text>
          </View>
          {recipe.rating !== undefined && (
            <View style={styles.ratingPill}>
              <Text style={styles.ratingStar}>★</Text>
              <Text style={styles.ratingValue}>
                {Number(recipe.rating).toFixed(1)}
              </Text>
              <Text style={styles.ratingCount}>
                ({recipe.reviewCount || 0} ulasan)
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Kartu Utama Informasi Resep */}
      <View style={styles.mainCard}>
        {/* Tags & Meal Type */}
        <View style={styles.tagsRow}>
          {(recipe.mealType || []).map((type, idx) => (
            <View key={`meal-${idx}`} style={styles.mealTypeBadge}>
              <Text style={styles.mealTypeText}>{type}</Text>
            </View>
          ))}
          <View style={styles.difficultyBadge}>
            <Text style={styles.difficultyText}>
              Tingkat: {formatDifficulty(recipe.difficulty)}
            </Text>
          </View>
          {isFetching ? (
            <Text style={styles.syncIndicator}>• Menyinkronkan cache</Text>
          ) : (
            <Text style={styles.cachedIndicator}>• Tersimpan di Cache</Text>
          )}
        </View>

        {/* Nama Makanan */}
        <Text style={styles.recipeTitle}>{recipe.name}</Text>

        {/* Deskripsi / Informasi Resep */}
        <Text style={styles.descriptionText}>
          {buildRecipeDescription(recipe)}
        </Text>

        {/* Grid Statistik Utama: Prep Time, Cook Time, Servings, Calories */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statIcon}>🔪</Text>
            <Text style={styles.statValue}>{recipe.prepTimeMinutes ?? 0} mnt</Text>
            <Text style={styles.statLabel}>Persiapan</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statIcon}>🍳</Text>
            <Text style={styles.statValue}>{recipe.cookTimeMinutes ?? 0} mnt</Text>
            <Text style={styles.statLabel}>Memasak</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statIcon}>🍽️</Text>
            <Text style={styles.statValue}>{recipe.servings ?? 1} Porsi</Text>
            <Text style={styles.statLabel}>Sajian</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statIcon}>🔥</Text>
            <Text style={styles.statValue}>
              {recipe.caloriesPerServing ?? '-'}
            </Text>
            <Text style={styles.statLabel}>kkal / Porsi</Text>
          </View>
        </View>

        {/* Ringkasan Total Waktu & Tombol Mode Memasak Interaktif */}
        <View style={styles.actionBanner}>
          <View style={styles.actionBannerLeft}>
            <Text style={styles.actionBannerTitle}>
              Total Waktu: {formatTotalTime(recipe.prepTimeMinutes, recipe.cookTimeMinutes)}
            </Text>
            <Text style={styles.actionBannerSubtitle}>
              {ingredients.length} bahan • {instructions.length} langkah memasak
            </Text>
          </View>
          <TouchableOpacity
            style={styles.startCookingBtn}
            onPress={() =>
              navigation.navigate('CookingInstructions', {
                recipeId: recipe.id,
                recipe,
              })
            }
          >
            <Text style={styles.startCookingBtnText}>👨‍🍳 Mode Memasak</Text>
          </TouchableOpacity>
        </View>

        {/* Tab Pemilih Tampilan (Semua / Bahan / Langkah) */}
        <View style={styles.tabBar}>
          {[
            { key: 'all', label: 'Semua Info' },
            { key: 'ingredients', label: `Bahan (${ingredients.length})` },
            { key: 'instructions', label: `Langkah (${instructions.length})` },
          ].map((tab) => {
            const active = activeSection === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tabItem, active && styles.tabItemActive]}
                onPress={() => setActiveSection(tab.key)}
              >
                <Text style={[styles.tabText, active && styles.tabTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* BAGIAN 1: DAFTAR BAHAN MAKANAN (INGREDIENTS) */}
        {(activeSection === 'all' || activeSection === 'ingredients') && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>
                  🥕 Daftar Bahan Makanan
                </Text>
                <Text style={styles.sectionSubtitle}>
                  Ketuk bahan untuk menandai bahan yang sudah siap ({checkedCount}/
                  {ingredients.length})
                </Text>
              </View>
              <TouchableOpacity
                style={styles.findSimilarBtn}
                onPress={() =>
                  navigation.navigate('MainTabs', {
                    screen: 'IngredientsTab',
                    params: {
                      preselectedIngredient: ingredients[0]
                        ? ingredients[0].split(' ').slice(-1)[0]
                        : 'Garlic',
                    },
                  })
                }
              >
                <Text style={styles.findSimilarText}>Cari Bahan Serupa →</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.ingredientsList}>
              {ingredients.map((item, idx) => {
                const isChecked = Boolean(checkedIngredients[idx]);
                return (
                  <TouchableOpacity
                    key={`ing-${idx}`}
                    style={[
                      styles.ingredientRow,
                      isChecked && styles.ingredientRowChecked,
                    ]}
                    activeOpacity={0.75}
                    onPress={() => toggleIngredientCheck(idx)}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        isChecked && styles.checkboxChecked,
                      ]}
                    >
                      {isChecked && <Text style={styles.checkMark}>✓</Text>}
                    </View>
                    <Text
                      style={[
                        styles.ingredientText,
                        isChecked && styles.ingredientTextChecked,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* BAGIAN 2: LANGKAH-LANGKAH MEMASAK (COOKING INSTRUCTIONS) */}
        {(activeSection === 'all' || activeSection === 'instructions') && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>
                  🍳 Langkah-Langkah Memasak
                </Text>
                <Text style={styles.sectionSubtitle}>
                  Ikuti urutan instruksi di bawah ini untuk hasil terbaik
                </Text>
              </View>
              <TouchableOpacity
                style={styles.findSimilarBtn}
                onPress={() =>
                  navigation.navigate('CookingInstructions', {
                    recipeId: recipe.id,
                    recipe,
                  })
                }
              >
                <Text style={styles.findSimilarText}>Layar Penuh →</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.instructionsList}>
              {instructions.map((step, idx) => (
                <View key={`step-${idx}`} style={styles.instructionCard}>
                  <View style={styles.stepBadge}>
                    <Text style={styles.stepBadgeText}>{idx + 1}</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Langkah {idx + 1}</Text>
                    <Text style={styles.stepDescription}>{step}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Tag Kuliner Lengkap di Bagian Bawah */}
        {Array.isArray(recipe.tags) && recipe.tags.length > 0 && (
          <View style={styles.footerTagsSection}>
            <Text style={styles.footerTagsLabel}>Tag Terkait:</Text>
            <View style={styles.footerTagsWrap}>
              {recipe.tags.map((tag, i) => (
                <View key={`ftag-${i}`} style={styles.footerTagChip}>
                  <Text style={styles.footerTagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: SPACING.xxxl,
  },
  heroContainer: {
    position: 'relative',
    width: '100%',
    height: 260,
    backgroundColor: COLORS.surfaceMuted,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroTopOverlay: {
    position: 'absolute',
    bottom: SPACING.xl + 12,
    left: SPACING.lg,
    right: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cuisinePill: {
    backgroundColor: 'rgba(22, 101, 52, 0.94)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
  },
  cuisinePillText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  ratingPill: {
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
  },
  ratingStar: {
    color: COLORS.amber,
    fontSize: 14,
    marginRight: 4,
  },
  ratingValue: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  ratingCount: {
    color: '#CBD5E1',
    fontSize: 11,
    marginLeft: 4,
  },
  mainCard: {
    marginTop: -20,
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl + 4,
    borderTopRightRadius: RADIUS.xl + 4,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xxl,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    marginBottom: SPACING.sm,
  },
  mealTypeBadge: {
    backgroundColor: COLORS.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
  },
  mealTypeText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  difficultyBadge: {
    backgroundColor: COLORS.amberSoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
  },
  difficultyText: {
    color: '#B45309',
    fontSize: 11,
    fontWeight: '700',
  },
  syncIndicator: {
    fontSize: 11,
    color: COLORS.info,
    fontWeight: '600',
  },
  cachedIndicator: {
    fontSize: 11,
    color: COLORS.success,
    fontWeight: '600',
  },
  recipeTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textPrimary,
    lineHeight: 31,
    marginBottom: SPACING.sm,
  },
  descriptionText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 21,
    marginBottom: SPACING.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  statIcon: {
    fontSize: 18,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  actionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primarySurface,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  actionBannerLeft: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  actionBannerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
  },
  actionBannerSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  startCookingBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
  },
  startCookingBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: RADIUS.md,
    padding: 4,
    marginBottom: SPACING.xl,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: RADIUS.sm,
  },
  tabItemActive: {
    backgroundColor: COLORS.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  sectionContainer: {
    marginBottom: SPACING.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  findSimilarBtn: {
    backgroundColor: COLORS.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
  },
  findSimilarText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  ingredientsList: {
    gap: SPACING.sm,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  ingredientRowChecked: {
    backgroundColor: COLORS.primarySurface,
    borderColor: '#86EFAC',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.primaryMedium,
    marginRight: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkMark: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  ingredientText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  ingredientTextChecked: {
    textDecorationLine: 'line-through',
    color: COLORS.textSecondary,
  },
  instructionsList: {
    gap: SPACING.md,
  },
  instructionCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  stepBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  stepBadgeText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 21,
  },
  footerTagsSection: {
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    paddingTop: SPACING.lg,
  },
  footerTagsLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  footerTagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  footerTagChip: {
    backgroundColor: COLORS.surfaceMuted,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
  },
  footerTagText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
});

export default DetailScreen;

