import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
  Image,
  Text,
  Pressable,
  TextInput,
  useColorScheme,
  StyleSheet
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { BlueTitleText } from '@/components/BlueTitleText';


export default function Homepage(){
    const router = useRouter();
    const colorScheme = useColorScheme();

    const TextFieldColor = colorScheme === 'dark' ? '#2c2c2c' : '#FFFFFF';
    const TextColor = colorScheme === 'dark' ? '#dce1e8' : '#B3B9C2';

    return (
        <Stack>
        <Stack.Screen name="home" options={{}} />
      </Stack>
    );
}