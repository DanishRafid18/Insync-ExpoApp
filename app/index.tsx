import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
  Image,
  Text,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function IndexScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#5081FF' }}>
      <StatusBar backgroundColor="#5081FF" />
      <Pressable
        style={{ flex: 1 }}
        onPress={() => {
          router.replace('/Login');
        }}
      >
        <View style={{ flex: 1, backgroundColor: '#5081FF' }}>
          <View style={{ alignItems: 'center', marginTop: "50%" }}>
            <Image
              source={require('@/assets/images/WhiteTransparentLogo.png')}
              resizeMode="contain"
              style={{ width: 300, height: 300 }}
            />
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              marginBottom: 50,
            }}
          >
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
      </Pressable>
    </SafeAreaView>
  );
}
