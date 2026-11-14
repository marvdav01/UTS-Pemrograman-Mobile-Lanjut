// src/screens/IngredientsScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRecipesByIngredients } from '../hooks/useRecipes';
import { useDebounce } from '../utils/useDebounce';
import SearchBar from '../components/SearchBar';
import RecipeCard from '../components/RecipeCard';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { COLORS, SPACING, RADIUS } from '../constants/colors';

const IngredientsScreen = ({ route, navigation }) => {
  const [selectedChips, setSelectedChips] = useState([]);
  const [ingredientInput, setIngredientInput] = useState('');

  useEffect(() => {
    const preselected = route?.params?.preselectedIngredient;
    if (preselected && !selectedChips.includes(preselected)) {
      setSelectedChips([preselected]);
    }
  }, [route?.params?.preselectedIngredient]);

  const debouncedInput = useDebounce(ingredientInput, 350);

  const {
    recipes,
    matchedCount,
    requiredTerms,
    popularIngredients,
    isLoading,
    isError,
    error,
    refetch,
  } = useRecipesByIngredients(selectedChips, debouncedInput);

  const toggleIngredientChip = (name) => {
    setSelectedChips((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  const handleClearAll = () => {
    setSelectedChips([]);
    setIngredientInput('');
  };

  const handleSelectRecipe = (recipe) => {
    navigation.navigate('Detail', {
      recipeId: recipe.id,
      recipeName: recipe.name,
    });
  };

  if (isLoading) {
    return (
      <Loading
        message="Memuat Katalog Bahan Makanan..."
        subMessage="Menyiapkan data resep dari cache TanStack Query"
      />
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Gagal Memuat Data Bahan Resep"
        message={
          error?.message ||
          'Tidak dapat mengambil katalog resep untuk pemfilteran bahan makanan.'
        }
        onRetry={refetch}
      />
    );
  }

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>🥕 Cari Resep Berdasarkan Bahan</Text>
      <Text style={styles.subtitle}>
        Pilih bahan yang ada di dapur Anda (bisa lebih dari satu) untuk menemukan
        resep yang cocok.
      </Text>

      {/* Info Box Penjelasan Keterbatasan API sesuai Instruksi Soal */}
      <View style={styles.apiNoteBox}>
        <Text style={styles.apiNoteTitle}>
          ℹ️ Informasi Teknis Endpoint & Mekanisme Filtering:
        </Text>
        <Text style={styles.apiNoteText}>
          REST API DummyJSON (`https://dummyjson.com/docs/recipes`) hanya
          menyediakan endpoint pencarian nama (`/recipes/search?q=`) dan tidak
          memiliki endpoint server khusus untuk parameter bahan (`ingredients`).
          Sesuai ketentuan, fitur ini menggunakan data asli dari `GET
          /recipes?limit=50` yang disimpan di cache TanStack Query lalu
          melakukan multi-ingredient filtering terhadap properti
          `recipe.ingredients`.
        </Text>
      </View>

      <SearchBar
        value={ingredientInput}
        onChangeText={setIngredientInput}
        onClear={() => setIngredientInput('')}
        placeholder="Ketik bahan (pisahkan koma, mis: garlic, chicken)..."
      />

      {/* Daftar Chip Bahan Populer */}
      <View style={styles.chipsSection}>
        <View style={styles.chipsHeaderRow}>
          <Text style={styles.chipsTitle}>Bahan Populer di Katalog:</Text>
          {requiredTerms.length > 0 && (
            <TouchableOpacity onPress={handleClearAll}>
              <Text style={styles.clearAllText}>Reset Semua Bahan</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.chipsWrap}>
          {popularIngredients.map((item) => {
            const isSelected = selectedChips.includes(item.name);
            return (
              <TouchableOpacity
                key={item.name}
                style={[styles.ingChip, isSelected && styles.ingChipActive]}
                onPress={() => toggleIngredientChip(item.name)}
              >
                <Text
                  style={[
                    styles.ingChipText,
                    isSelected && styles.ingChipTextActive,
                  ]}
                >
                  {isSelected ? '✓ ' : '+ '}
                  {item.name} ({item.count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Ringkasan Filter Aktif */}
      <View style={styles.resultSummaryBar}>
        <Text style={styles.resultSummaryText}>
          {requiredTerms.length === 0
            ? `Menampilkan seluruh ${matchedCount} resep tersedia`
            : `Ditemukan ${matchedCount} resep yang mengandung: ${requiredTerms.join(
                ' + '
              )}`}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <FlatList
        data={recipes}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <RecipeCard
            recipe={item}
            matchedIngredients={item.matchedIngredients || []}
            onPress={handleSelectRecipe}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <EmptyState
            icon="🧺"
            title="Tidak Ada Kombinasi Resep"
            message={`Tidak ditemukan resep yang mengandung kombinasi seluruh bahan: "${requiredTerms.join(
              ', '
            )}". Coba kurangi salah satu bahan.`}
            actionLabel="Reset Filter Bahan"
            onAction={handleClearAll}
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  headerContainer: {
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 19,
    marginBottom: SPACING.md,
  },
  apiNoteBox: {
    backgroundColor: COLORS.infoSoft,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  apiNoteTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0369A1',
    marginBottom: 3,
  },
  apiNoteText: {
    fontSize: 11.5,
    color: '#0C4A6E',
    lineHeight: 17,
  },
  chipsSection: {
    marginTop: SPACING.md,
  },
  chipsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  chipsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  clearAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.error,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ingChip: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  ingChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  ingChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  ingChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  resultSummaryBar: {
    marginTop: SPACING.lg,
    backgroundColor: COLORS.primarySurface,
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  resultSummaryText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
});

export default IngredientsScreen;
