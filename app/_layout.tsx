import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import '@/global.css'
import { useColorScheme } from '@/hooks/useColorScheme';
import { Stack } from 'expo-router';
import {Suspense, useEffect} from 'react';
import { ActivityIndicator } from 'react-native';
import { SQLiteProvider, openDatabaseSync } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '@/drizzle/migrations';
export const DATABASE_NAME = 'tasks';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });


  const expoDb = openDatabaseSync(DATABASE_NAME);
  const db = drizzle(expoDb);
  const { success, error } = useMigrations(db, migrations);
  useDrizzleStudio(db);


  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (

      <Suspense fallback={<ActivityIndicator size="large" />}>
        <SQLiteProvider
            databaseName={DATABASE_NAME}
            options={{ enableChangeListener: true }}
            useSuspense>
          <StatusBar hidden={true}/>
              <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack>
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen name="+not-found" />
                </Stack>
                <StatusBar style="auto" />
              </ThemeProvider>
        </SQLiteProvider>
      </Suspense>
  );
}
