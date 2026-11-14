// src/components/EmptyState.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../constants/colors';

const EmptyState = ({
  icon = '🍲',
  title = 'Resep Tidak Ditemukan',
  message = 'Kami tidak menemukan resep yang cocok dengan kata kunci pencarian Anda. Coba gunakan kata kunci lain.',
  actionLabel,
  onAction,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>

      {actionLabel && onAction ? (
        <TouchableOpacity
          style={styles.actionButton}
          activeOpacity={0.85}
          onPress={onAction}
        >
          <Text style={styles.actionText}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.xxxl,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  icon: {
    fontSize: 34,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  message: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 320,
    marginBottom: SPACING.lg,
  },
  actionButton: {
    backgroundColor: COLORS.primarySoft,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  actionText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '700',
  },
});

export default EmptyState;

