// src/screens/CookingInstructionsScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRecipeDetail } from '../hooks/useRecipes';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import { COLORS, SPACING, RADIUS } from '../constants/colors';

const CookingInstructionsScreen = ({ route, navigation }) => {
  const recipeId = route?.params?.recipeId;
  const passedRecipe = route?.params?.recipe;
  const insets = useSafeAreaInsets();

  const { data: fetchedRecipe, isLoading, isError, refetch } =
    useRecipeDetail(recipeId);

  const recipe = fetchedRecipe || passedRecipe;
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState({});

  if (isLoading && !recipe) {
    return <Loading message="Menyiapkan Panduan Langkah Memasak..." />;
  }

  if (isError && !recipe) {
    return (
      <ErrorState
        title="Gagal Memuat Langkah Memasak"
        onRetry={refetch}
      />
    );
  }

  const instructions = recipe?.instructions || [];
  const totalSteps = instructions.length;
  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent =
    totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

  const toggleStepComplete = (idx) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: Math.max(insets.bottom + 36, 48) },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Progress Memasak */}
      <View style={styles.headerCard}>
        <Text style={styles.recipeLabel}>👨‍🍳 PANDUAN MEMASAK INTERAKTIF</Text>
        <Text style={styles.recipeName}>{recipe?.name}</Text>

        <View style={styles.progressRow}>
          <Text style={styles.progressText}>
            Progres Selesai: {completedCount} dari {totalSteps} langkah
          </Text>
          <Text style={styles.progressPercentage}>{progressPercent}%</Text>
        </View>

        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${progressPercent}%` },
            ]}
          />
        </View>
      </View>

      {/* Kartu Langkah Aktif (Step-by-Step Focus Card) */}
      {totalSteps > 0 && (
        <View style={styles.focusCard}>
          <View style={styles.focusTopRow}>
            <View style={styles.stepPill}>
              <Text style={styles.stepPillText}>
                Langkah Aktif: {currentStep + 1} / {totalSteps}
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.markBtn,
                completedSteps[currentStep] && styles.markBtnDone,
              ]}
              onPress={() => toggleStepComplete(currentStep)}
            >
              <Text
                style={[
                  styles.markBtnText,
                  completedSteps[currentStep] && styles.markBtnTextDone,
                ]}
              >
                {completedSteps[currentStep]
                  ? '✓ Selesai'
                  : 'Tandai Selesai'}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.focusInstructionText}>
            {instructions[currentStep]}
          </Text>

          <View style={styles.navButtonsRow}>
            <TouchableOpacity
              style={[
                styles.navBtn,
                currentStep === 0 && styles.navBtnDisabled,
              ]}
              disabled={currentStep === 0}
              onPress={() => setCurrentStep((s) => Math.max(0, s - 1))}
            >
              <Text style={styles.navBtnText}>← Sebelumnya</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.navBtnPrimary,
                currentStep === totalSteps - 1 && styles.navBtnDisabled,
              ]}
              disabled={currentStep === totalSteps - 1}
              onPress={() => {
                setCompletedSteps((prev) => ({ ...prev, [currentStep]: true }));
                setCurrentStep((s) => Math.min(totalSteps - 1, s + 1));
              }}
            >
              <Text style={styles.navBtnPrimaryText}>
                Langkah Berikutnya →
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Daftar Seluruh Langkah Memasak */}
      <Text style={styles.allStepsTitle}>Daftar Lengkap Instruksi</Text>
      {instructions.map((stepText, idx) => {
        const isDone = Boolean(completedSteps[idx]);
        const isCurrent = idx === currentStep;
        return (
          <TouchableOpacity
            key={`full-step-${idx}`}
            style={[
              styles.stepRowCard,
              isCurrent && styles.stepRowCardCurrent,
              isDone && styles.stepRowCardDone,
            ]}
            onPress={() => setCurrentStep(idx)}
          >
            <TouchableOpacity
              style={[
                styles.stepNumberCircle,
                isDone && styles.stepNumberCircleDone,
              ]}
              onPress={() => toggleStepComplete(idx)}
            >
              <Text style={styles.stepNumberText}>
                {isDone ? '✓' : idx + 1}
              </Text>
            </TouchableOpacity>
            <View style={styles.stepTextWrapper}>
              <Text style={styles.stepItemLabel}>
                Langkah {idx + 1} {isCurrent ? '• (Sedang Dilihat)' : ''}
              </Text>
              <Text
                style={[
                  styles.stepItemBody,
                  isDone && styles.stepItemBodyDone,
                ]}
              >
                {stepText}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}

      <TouchableOpacity
        style={styles.backToDetailBtn}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backToDetailText}>← Kembali ke Detail Resep</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  headerCard: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  recipeLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#BBF7D0',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  recipeName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: SPACING.md,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressText: {
    fontSize: 12,
    color: '#DCFCE7',
    fontWeight: '600',
  },
  progressPercentage: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: RADIUS.pill,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4ADE80',
    borderRadius: RADIUS.pill,
  },
  focusCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
    borderWidth: 1.5,
    borderColor: COLORS.primaryLight,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  focusTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  stepPill: {
    backgroundColor: COLORS.primarySoft,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: RADIUS.pill,
  },
  stepPillText: {
    color: COLORS.primary,
    fontWeight: '800',
    fontSize: 12,
  },
  markBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  markBtnDone: {
    backgroundColor: COLORS.primary,
  },
  markBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  markBtnTextDone: {
    color: '#FFFFFF',
  },
  focusInstructionText: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.textPrimary,
    lineHeight: 26,
    marginBottom: SPACING.xl,
  },
  navButtonsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  navBtn: {
    flex: 1,
    backgroundColor: COLORS.surfaceMuted,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  navBtnPrimary: {
    flex: 1.3,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  navBtnDisabled: {
    opacity: 0.45,
  },
  navBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  navBtnPrimaryText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  allStepsTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  stepRowCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  stepRowCardCurrent: {
    borderColor: COLORS.primary,
    borderWidth: 1.5,
  },
  stepRowCardDone: {
    backgroundColor: COLORS.primarySurface,
  },
  stepNumberCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  stepNumberCircleDone: {
    backgroundColor: COLORS.primary,
  },
  stepNumberText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  stepTextWrapper: {
    flex: 1,
  },
  stepItemLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 3,
  },
  stepItemBody: {
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  stepItemBodyDone: {
    textDecorationLine: 'line-through',
    color: COLORS.textSecondary,
  },
  backToDetailBtn: {
    marginTop: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 14,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
  },
  backToDetailText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
});

export default CookingInstructionsScreen;

