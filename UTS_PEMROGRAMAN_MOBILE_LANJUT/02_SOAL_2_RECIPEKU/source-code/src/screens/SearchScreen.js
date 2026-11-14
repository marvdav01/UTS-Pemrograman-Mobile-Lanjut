// src/screens/SearchScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useSearchRecipes } from '../hooks/useRecipes';
import { useDebounce } from '../utils/useDebounce';
import SearchBar from '../components/SearchBar';
import RecipeCard from '../components/RecipeCard';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { COLORS, SPACING, RADIUS } from '../constants/colors';

const POPULAR_SEARCHES = [
  'Pizza',
  'Chicken',
  'Pasta',
  'Salad',
  'Cookies',
  'Soup',
  'Vegetarian',
  'Mango',
];

const SearchScreen = ({ route, navigation }) => {
  const initialQuery = route?.params?.initialQuery || '';
  const [searchText, setSearchText] = useState(initialQuery);

  // Sinkronisasi jika ada parameter pencarian dari halaman Home
  useEffect(() => {
    if (route?.params?.initialQuery !== undefined) {
      setSearchText(route.params.initialQuery);
    }
  }, [route?.params?.initialQuery]);

  // Debounce 450ms agar tidak memanggil API pada setiap ketikan karakter secara berlebihan
  const debouncedQuery = useDebounce(searchText, 450);

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useSearchRecipes(debouncedQuery);

  const searchResults = data?.recipes || [];
  const hasActiveQuery = debouncedQuery.trim().length > 0;
  const isTypingDebounce = searchText.trim() !== debouncedQuery.trim();

  const handleSelectRecipe = (recipe) => {
    navigation.navigate('Detail', {
      recipeId: recipe.id,
      recipeName: recipe.name,
    });
  };

  return (
    <View style={styles.screen}>
      {/* Area Header Pencarian */}
      <View style={styles.searchHeader}>
        <Text style={styles.headerTitle}>Cari Resep Masakan</Text>
        <Text style={styles.headerSubtitle}>
          Endpoint: GET https://dummyjson.com/recipes/search?q=
          {debouncedQuery.trim() || '{kata_kunci}'}
        </Text>

        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          onClear={() => setSearchText('')}
          placeholder="Ketik nama makanan (misal: Pizza, Chicken, Pasta)..."
          autoFocus={false}
        />

        {/* Baris Status Debounce & Server State */}
        <View style={styles.statusRow}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>
              {isTypingDebounce
                ? '⏳ Menunggu ketikan selesai (Debounce 450ms)...'
                : isFetching
                ? '🔄 Mengambil data dari REST API...'
                : hasActiveQuery
                ? `✓ Ditemukan ${searchResults.length} resep untuk "${debouncedQuery.trim()}"`
                : '💡 Ketik kata kunci atau pilih saran populer di bawah'}
            </Text>
          </View>
          {(isTypingDebounce || isFetching) && (
            <ActivityIndicator size="small" color={COLORS.primary} />
          )}
        </View>

        {/* Kata Kunci Populer */}
        <View style={styles.popularWrapper}>
          <Text style={styles.popularLabel}>Kata Kunci Populer:</Text>
          <View style={styles.chipsContainer}>
            {POPULAR_SEARCHES.map((keyword) => {
              const isSelected =
                searchText.trim().toLowerCase() === keyword.toLowerCase();
              return (
                <TouchableOpacity
                  key={keyword}
                  style={[
                    styles.keywordChip,
                    isSelected && styles.keywordChipActive,
                  ]}
                  onPress={() => setSearchText(keyword)}
                >
                  <Text
                    style={[
                      styles.keywordChipText,
                      isSelected && styles.keywordChipTextActive,
                    ]}
                  >
                    {keyword}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>

      {/* Area Konten Hasil Pencarian */}
      {isError ? (
        <ErrorState
          title="Pencarian Resep Gagal"
          message={
            error?.message ||
            'Terjadi kesalahan saat menghubungi endpoint pencarian resep.'
          }
          onRetry={refetch}
        />
      ) : !hasActiveQuery ? (
        <EmptyState
          icon="🔍"
          title="Mulai Cari Resep Favorit Anda"
          message="Ketik nama hidangan pada kotak pencarian di atas (contoh: Pizza, Pasta, Chicken) atau gunakan fitur pencarian berdasarkan bahan makanan."
          actionLabel="🥕 Buka Pencarian Berdasarkan Bahan"
          onAction={() => navigation.navigate('IngredientsTab')}
        />
      ) : isLoading ? (
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>
            Mencari resep "{debouncedQuery.trim()}"...
          </Text>
        </View>
      ) : (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <RecipeCard recipe={item} onPress={handleSelectRecipe} />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState
              icon="🍽️"
              title="Hasil Pencarian Tidak Ditemukan"
              message={`Maaf, tidak ada resep dengan nama "${debouncedQuery.trim()}" pada server DummyJSON. Coba kata kunci lain seperti "Pizza" atau "Chicken".`}
              actionLabel="Hapus Kata Kunci"
              onAction={() => setSearchText('')}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  searchHeader: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 11,
    color: COLORS.primaryMedium,
    fontFamily: 'monospace',
    marginBottom: SPACING.md,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  statusBadge: {
    flex: 1,
    backgroundColor: COLORS.primarySurface,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    marginRight: SPACING.sm,
  },
  statusBadgeText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  popularWrapper: {
    marginTop: 4,
  },
  popularLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  keywordChip: {
    backgroundColor: COLORS.surfaceMuted,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  keywordChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  keywordChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  keywordChipTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  centerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
});

export default SearchScreen;

