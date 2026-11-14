// src/screens/HomeScreen.js
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import {
  useRecipesList,
  useRecipeTags,
  RECIPE_QUERY_KEYS,
} from '../hooks/useRecipes';
import {
  setSimulateNetworkError,
  getSimulateNetworkError,
} from '../api/recipeApi';
import RecipeCard from '../components/RecipeCard';
import SearchBar from '../components/SearchBar';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { COLORS, SPACING, RADIUS } from '../constants/colors';

const FEATURED_CATEGORIES = [
  'All',
  'Asian',
  'Italian',
  'Chicken',
  'Pizza',
  'Pasta',
  'Vegetarian',
  'Salad',
  'Dessert',
  'Soup',
];

const HomeScreen = ({ navigation }) => {
  const [selectedTag, setSelectedTag] = useState('All');
  const [quickFilter, setQuickFilter] = useState('');
  const [isSimulatingError, setIsSimulatingError] = useState(() => {
    if (
      typeof window !== 'undefined' &&
      window.location?.search?.includes('screen=error')
    ) {
      setSimulateNetworkError(true);
      return true;
    }
    return getSimulateNetworkError();
  });

  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
    dataUpdatedAt,
  } = useRecipesList(selectedTag);

  const { data: apiTags } = useRecipeTags();

  const categoryList = useMemo(() => {
    if (Array.isArray(apiTags) && apiTags.length > 0) {
      const merged = ['All', ...FEATURED_CATEGORIES.slice(1)];
      apiTags.slice(0, 12).forEach((t) => {
        if (!merged.includes(t)) merged.push(t);
      });
      return merged;
    }
    return FEATURED_CATEGORIES;
  }, [apiTags]);

  const recipes = useMemo(() => {
    const rawList = data?.recipes || [];
    const keyword = quickFilter.trim().toLowerCase();
    if (!keyword) return rawList;
    return rawList.filter(
      (item) =>
        item.name?.toLowerCase().includes(keyword) ||
        item.cuisine?.toLowerCase().includes(keyword) ||
        (item.tags || []).some((t) => t.toLowerCase().includes(keyword))
    );
  }, [data, quickFilter]);

  const handleSelectRecipe = (recipe) => {
    navigation.navigate('Detail', {
      recipeId: recipe.id,
      recipeName: recipe.name,
    });
  };

  const handleToggleSimulateError = async () => {
    const nextState = !isSimulatingError;
    setSimulateNetworkError(nextState);
    setIsSimulatingError(nextState);
    if (nextState) {
      // Hapus cache sementara untuk mendemonstrasikan tampilan ErrorState & Retry
      queryClient.resetQueries({ queryKey: RECIPE_QUERY_KEYS.list(selectedTag) });
    } else {
      await refetch();
    }
  };

  const handleRetryFromError = async () => {
    if (isSimulatingError) {
      setSimulateNetworkError(false);
      setIsSimulatingError(false);
    }
    await refetch();
  };

  if (isLoading) {
    return (
      <Loading
        message="Memuat Katalog Resep Pilihan..."
        subMessage={`Mengambil data kategori "${selectedTag}" dari DummyJSON Recipes API`}
      />
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Gagal Memuat Daftar Resep"
        message={
          error?.message ||
          'Tidak dapat mengambil daftar resep dari server. Periksa koneksi internet Anda lalu tekan tombol Coba Lagi.'
        }
        errorDetails={`QueryKey: JSON.stringify(['recipes', 'list', '${selectedTag}'])`}
        onRetry={handleRetryFromError}
        retryLabel="Coba Lagi (Pulihkan Koneksi)"
      />
    );
  }

  const lastUpdatedText = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : '-';

  const renderListHeader = () => (
    <View style={styles.headerWrapper}>
      {/* Banner Hero Aplikasi */}
      <View style={styles.heroBanner}>
        <View style={styles.heroTopRow}>
          <View style={styles.brandBadge}>
            <Text style={styles.brandBadgeText}>🌿 COOKPAD INSPIRED APP</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.qaErrorButton,
              isSimulatingError && styles.qaErrorButtonActive,
            ]}
            onPress={handleToggleSimulateError}
          >
            <Text style={styles.qaErrorButtonText}>
              {isSimulatingError ? '⚡ Mode Error Aktif' : '🧪 Uji Error API'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.appTitle}>RecipeKu</Text>
        <Text style={styles.appSubtitle}>
          Indonesian Recipe Explorer • Temukan inspirasi masakan harian dengan
          dukungan TanStack Query Server State
        </Text>

        {/* Search Bar di Home Screen */}
        <View style={styles.searchBarRow}>
          <View style={styles.searchFlex}>
            <SearchBar
              value={quickFilter}
              onChangeText={setQuickFilter}
              onClear={() => setQuickFilter('')}
              placeholder="Filter cepat atau cari nama masakan..."
              onSubmit={() => {
                if (quickFilter.trim()) {
                  navigation.navigate('SearchTab', {
                    initialQuery: quickFilter.trim(),
                  });
                }
              }}
            />
          </View>
        </View>

        {/* Tombol Pintasan ke Pencarian API & Pencarian Bahan */}
        <View style={styles.quickActionRow}>
          <TouchableOpacity
            style={styles.quickActionBtn}
            onPress={() =>
              navigation.navigate('SearchTab', {
                initialQuery: quickFilter.trim(),
              })
            }
          >
            <Text style={styles.quickActionText}>
              🔍 Cari via Endpoint Search API
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionBtnSecondary}
            onPress={() => navigation.navigate('IngredientsTab')}
          >
            <Text style={styles.quickActionTextSecondary}>
              🥕 Cari Berdasarkan Bahan
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Kategori / Tag Resep */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Kategori & Tag Kuliner</Text>
        <Text style={styles.cacheInfoText}>
          Cache: {lastUpdatedText} ({recipes.length} resep)
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesScroll}
      >
        {categoryList.map((tag) => {
          const isActive = selectedTag === tag;
          return (
            <TouchableOpacity
              key={tag}
              style={[
                styles.categoryChip,
                isActive && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedTag(tag)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  isActive && styles.categoryChipTextActive,
                ]}
              >
                {tag === 'All' ? '🍽️ Semua Resep' : tag}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Judul Daftar Resep */}
      <View style={styles.listSubheader}>
        <Text style={styles.listSubheaderTitle}>
          {selectedTag === 'All'
            ? 'Rekomendasi Resep Pilihan'
            : `Kategori: ${selectedTag}`}
        </Text>
        {quickFilter.trim() ? (
          <TouchableOpacity onPress={() => setQuickFilter('')}>
            <Text style={styles.resetFilterText}>Reset Filter</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <FlatList
        data={recipes}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <RecipeCard recipe={item} onPress={handleSelectRecipe} />
        )}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={
          <EmptyState
            icon="🥗"
            title="Tidak Ada Resep yang Cocok"
            message={`Tidak ditemukan resep pada kategori "${selectedTag}" dengan filter "${quickFilter}".`}
            actionLabel="Tampilkan Semua Resep"
            onAction={() => {
              setSelectedTag('All');
              setQuickFilter('');
            }}
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
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
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  headerWrapper: {
    paddingTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  heroBanner: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  brandBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
  },
  brandBadgeText: {
    color: '#DCFCE7',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  qaErrorButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  qaErrorButtonActive: {
    backgroundColor: COLORS.error,
    borderColor: '#FCA5A5',
  },
  qaErrorButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  appTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: 13,
    color: '#DCFCE7',
    lineHeight: 19,
    marginBottom: SPACING.lg,
  },
  searchBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  searchFlex: {
    flex: 1,
  },
  quickActionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  quickActionBtn: {
    flex: 1,
    minWidth: 145,
    backgroundColor: '#FFFFFF',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  quickActionText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  quickActionBtnSecondary: {
    flex: 1,
    minWidth: 145,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  quickActionTextSecondary: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  cacheInfoText: {
    fontSize: 11,
    color: COLORS.primaryMedium,
    fontWeight: '600',
  },
  categoriesScroll: {
    paddingBottom: SPACING.md,
    gap: SPACING.sm,
  },
  categoryChip: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: SPACING.sm,
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  listSubheader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  listSubheaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  resetFilterText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.error,
  },
});

export default HomeScreen;
