import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, } from 'react';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import {
  SafeAreaView,
  StatusBar,
  View,
  Image,
  Text,
  Pressable,
  Button,
} from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import DefaultHeader from './DefaultHeader';
import AuthHeader from './AuthHeader';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Inter: require('../assets/fonts/Inter_28pt-Light.ttf'),
    DMSansBold: require('../assets/fonts/DMSans-Bold.ttf'),
    DMSansVar: require('../assets/fonts/DMSans-VariableFont_opsz,wght.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  
  //the themes codes are from https://reactnavigation.org/docs/themes/, under Basic usage
  const MyDarkTheme = {
    ...DarkTheme, colors:{...DarkTheme.colors, background: "#2c2c2c"}
  }
  const MyLightTheme = {
    ...DefaultTheme, colors:{...DefaultTheme.colors, background: "#EFF3FF"}
  }

  const headerBackgroundColor = colorScheme === 'dark' ? '#2c2c2c' : '#FFFFFF';
  const headerLogo = colorScheme === 'dark' ? require('@/assets/images/WhiteTransparentLogo.png') : require('@/assets/images/BlackTransparentLogo.png');
  const headerTintColor = colorScheme === 'dark' ? '#FFFFFF' : '#000000';

  return (
    <ThemeProvider value={colorScheme === 'dark' ? MyDarkTheme : MyLightTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="Login" options={{ animation: 'fade', header: () => <AuthHeader />, }} />
        <Stack.Screen name="SignUp" options={{
            header: () => <AuthHeader />,animation: 'fade'
          }} 
        />
        <Stack.Screen name="drawer" options={{ headerShown: false }} />
        {/* <Stack.Screen name="CreateEvent" options={{ header: () => <DefaultHeader />}} /> */}
      </Stack>
  </ThemeProvider>
  );
}
