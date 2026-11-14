// src/components/ErrorState.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../constants/colors';

const ErrorState = ({
  title = 'Gagal Memuat Data Resep',
  message = 'Terjadi gangguan koneksi internet atau server sedang tidak merespons. Silakan periksa jaringan Anda dan coba lagi.',
  errorDetails,
  onRetry,
  retryLabel = 'Coba Lagi (Retry)',
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>⚠️</Text>
        </View>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>

        {errorDetails ? (
          <View style={styles.detailBox}>
            <Text style={styles.detailLabel}>Detail Teknis:</Text>
            <Text style={styles.detailText}>{errorDetails}</Text>
          </View>
        ) : null}

        {onRetry && (
          <TouchableOpacity
            style={styles.retryButton}
            activeOpacity={0.85}
            onPress={onRetry}
          >
            <Text style={styles.retryButtonText}>🔄 {retryLabel}</Text>
          </TouchableOpacity>
        )}
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
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xxl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: COLORS.errorSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  iconText: {
    fontSize: 30,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  message: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.lg,
  },
  detailBox: {
    width: '100%',
    backgroundColor: '#FEF2F2',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.error,
    marginBottom: 2,
  },
  detailText: {
    fontSize: 12,
    color: '#991B1B',
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.pill,
    width: '100%',
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default ErrorState;
