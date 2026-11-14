// App.js
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppNavigator from './src/navigation/AppNavigator';
import { STALE_TIME, GC_TIME } from './src/hooks/useRecipes';

// Inisialisasi QueryClient untuk pengelolaan Server State, Caching, Refetching, dan Retry
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME, // Data tetap fresh selama 5 menit
      gcTime: GC_TIME,       // Data disimpan di memori cache selama 30 menit
      retry: 1,              // Mencoba ulang otomatis 1x sebelum masuk ke ErrorState
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="dark" />
        <AppNavigator />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

