// src/components/SearchBar.js
import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../constants/colors';

const SearchBar = ({
  value,
  onChangeText,
  onClear,
  onSubmit,
  placeholder = 'Cari resep masakan (contoh: Pizza, Pasta, Chicken)...',
  autoFocus = false,
  editable = true,
  onPressContainer,
}) => {
  const content = (
    <View style={styles.container}>
      <Text style={styles.searchIcon}>🔍</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        autoFocus={autoFocus}
        editable={editable}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
      />
      {value && value.length > 0 ? (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={onClear}
          accessibilityLabel="Hapus pencarian"
        >
          <Text style={styles.clearText}>✕</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );

  if (onPressContainer && !editable) {
    return (
      <TouchableOpacity activeOpacity={0.85} onPress={onPressContainer}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    height: 48,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    paddingVertical: SPACING.sm,
  },
  clearButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.xs,
  },
  clearText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
});

export default SearchBar;

