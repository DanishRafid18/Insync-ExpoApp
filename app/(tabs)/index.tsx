import { Image, StyleSheet, Platform, Text, SafeAreaView, ScrollView, StatusBar, View } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#5081FF' }}>
  <StatusBar backgroundColor="#5081FF" />
  <View style={{ flex: 1, backgroundColor: '#5081FF' }}>
    <View style={{ alignItems: 'center', marginTop: 50 }}>
      <Image
        source={require('@/assets/images/WhiteTransparentLogo.png')}
        resizeMode="contain"
        style={{ width: 300, height: 300 }}
      />
    </View>
    <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 50 }}>
      <Text
        style={{
          fontSize: 20,
          color: '#ffffff',
          textAlign: 'center',
          fontFamily: 'Inter',
        }}
      >
        Press anywhere to start
      </Text>
    </View>
  </View>
</SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
