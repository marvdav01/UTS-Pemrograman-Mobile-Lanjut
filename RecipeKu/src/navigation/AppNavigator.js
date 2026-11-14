// src/navigation/AppNavigator.js
import React from 'react';
import { Text, View, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import IngredientsScreen from '../screens/IngredientsScreen';
import DetailScreen from '../screens/DetailScreen';
import CookingInstructionsScreen from '../screens/CookingInstructionsScreen';
import { COLORS } from '../constants/colors';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabIcon = ({ emoji, focused }) => (
  <View style={[styles.iconWrap, focused && styles.iconWrapFocused]}>
    <Text style={styles.iconEmoji}>{emoji}</Text>
  </View>
);

const MainTabNavigator = () => {
  const insets = useSafeAreaInsets();
  // Pastikan jarak aman dari sistem navigasi HP (3-button bar / gesture bar Android & iOS)
  const bottomSafeInset = Math.max(
    insets.bottom,
    Platform.OS === 'android' ? 16 : 10
  );

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.surface,
        },
        headerTitleAlign: 'left',
        headerTitleStyle: {
          fontWeight: '800',
          color: COLORS.textPrimary,
          fontSize: 17,
        },
        headerShadowVisible: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          height: 64 + bottomSafeInset,
          paddingBottom: bottomSafeInset + 4,
          paddingTop: 8,
          elevation: 12,
          shadowColor: '#0F172A',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
        },
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 2,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
          lineHeight: 16,
          marginTop: 2,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: 'Beranda',
          headerTitle: '🌿 RecipeKu – Explorer',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🏠" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="SearchTab"
        component={SearchScreen}
        options={{
          title: 'Cari Resep',
          headerTitle: '🔍 Pencarian Resep (API)',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🔎" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="IngredientsTab"
        component={IngredientsScreen}
        options={{
          title: 'Cari Bahan',
          headerTitle: '🥕 Filter Bahan Makanan',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🥕" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const getInitialNavigationState = () => {
  if (typeof window === 'undefined' || !window.location?.search) {
    return undefined;
  }
  const params = new URLSearchParams(window.location.search);
  const screen = params.get('screen');
  const q = params.get('q') || '';
  const id = Number(params.get('id') || 1);
  const ing = params.get('ing') || 'Garlic';

  if (screen === 'search') {
    return {
      routes: [
        {
          name: 'MainTabs',
          state: {
            index: 1,
            routes: [
              { name: 'HomeTab' },
              { name: 'SearchTab', params: { initialQuery: q } },
              { name: 'IngredientsTab' },
            ],
          },
        },
      ],
    };
  }
  if (screen === 'ingredients') {
    return {
      routes: [
        {
          name: 'MainTabs',
          state: {
            index: 2,
            routes: [
              { name: 'HomeTab' },
              { name: 'SearchTab' },
              {
                name: 'IngredientsTab',
                params: { preselectedIngredient: ing },
              },
            ],
          },
        },
      ],
    };
  }
  if (screen === 'detail') {
    return {
      index: 1,
      routes: [
        { name: 'MainTabs' },
        {
          name: 'Detail',
          params: { recipeId: id, recipeName: 'Classic Margherita Pizza' },
        },
      ],
    };
  }
  if (screen === 'instructions') {
    return {
      index: 1,
      routes: [
        { name: 'MainTabs' },
        {
          name: 'CookingInstructions',
          params: { recipeId: id },
        },
      ],
    };
  }
  return undefined;
};

const AppNavigator = () => {
  const initialState = React.useMemo(() => getInitialNavigationState(), []);

  return (
    <NavigationContainer initialState={initialState}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.surface,
          },
          headerTintColor: COLORS.primary,
          headerTitleStyle: {
            fontWeight: '800',
            color: COLORS.textPrimary,
            fontSize: 16,
          },
          contentStyle: {
            backgroundColor: COLORS.background,
          },
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={MainTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={({ route }) => ({
            title: route?.params?.recipeName || 'Detail Resep',
          })}
        />
        <Stack.Screen
          name="CookingInstructions"
          component={CookingInstructionsScreen}
          options={{
            title: 'Langkah-Langkah Memasak',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  iconWrap: {
    width: 44,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapFocused: {
    backgroundColor: COLORS.primarySoft,
  },
  iconEmoji: {
    fontSize: 17,
  },
});

export default AppNavigator;
