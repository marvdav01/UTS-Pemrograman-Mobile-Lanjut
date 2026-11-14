// src/components/Loading.js
import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../constants/colors';

const Loading = ({
  message = 'Memuat resep lezat untuk Anda...',
  subMessage = 'Mengambil data dari server DummyJSON API',
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.spinnerWrapper}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
        <Text style={styles.title}>{message}</Text>
        {subMessage ? <Text style={styles.subtitle}>{subMessage}</Text> : null}

        {/* Skeleton Card Preview untuk menjaga UX tetap nyaman */}
        <View style={styles.skeletonList}>
          {[1, 2].map((item) => (
            <View key={item} style={styles.skeletonCard}>
              <View style={styles.skeletonImage} />
              <View style={styles.skeletonLineWide} />
              <View style={styles.skeletonLineShort} />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.xl,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  card: {
    width: '100%',
    alignItems: 'center',
  },
  spinnerWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  skeletonList: {
    width: '100%',
    gap: SPACING.md,
  },
  skeletonCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  skeletonImage: {
    width: '100%',
    height: 110,
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.sm,
  },
  skeletonLineWide: {
    width: '75%',
    height: 14,
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: 6,
    marginBottom: 8,
  },
  skeletonLineShort: {
    width: '45%',
    height: 12,
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: 6,
  },
});

export default Loading;

