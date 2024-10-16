import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  TextInput,
  useColorScheme,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { BlueTitleText } from '@/components/BlueTitleText';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  const TextFieldColor = colorScheme === 'dark' ? '#2c2c2c' : '#FFFFFF';
  const TextColor = colorScheme === 'dark' ? '#dce1e8' : '#B3B9C2';

  //state variables for email and password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  //function to handle login
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    const data = {
      email: email,
      password: password,
    };
    try {
      const response = await fetch('https://deco3801-foundjesse.uqcloud.net/restapi/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const json = await response.json();

      if (json.status === 'success') {
        const userId = json.user_id;

        //store user_id in AsyncStorage
        await AsyncStorage.setItem('user_id', userId.toString()); //https://react-native-async-storage.github.io/async-storage/docs/usage/

        Alert.alert('Success', 'Login successful');

        //navigate to the homepage
        router.replace('./drawer/Homepage');
      } else {
        Alert.alert('Error', json.message);
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An error occurred. Please try again.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ width: 325, alignSelf: 'center', marginTop: 100 }}>
        <BlueTitleText>Login</BlueTitleText>

        <Text
          style={{
            color: TextColor,
            fontFamily: 'DMSansBold',
            fontSize: 17,
            marginBottom: 20,
          }}
        >
          Please sign in to continue
        </Text>

        <TextInput
          style={{
            backgroundColor: TextFieldColor,
            borderWidth: 1,
            borderColor: '#5081FF',
            borderRadius: 5,
            height: 50,
            padding: 10,
            color: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
            marginBottom: 20,
          }}
          placeholder="Email"
          placeholderTextColor={TextColor}
          value={email}
          onChangeText={text => setEmail(text)}
          autoCapitalize="none"
          keyboardType="email-address"
          autoCorrect={false}
        />

        <TextInput
          style={{
            backgroundColor: TextFieldColor,
            borderWidth: 1,
            borderColor: '#5081FF',
            borderRadius: 5,
            height: 50,
            padding: 10,
            color: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
          }}
          placeholder="Password"
          placeholderTextColor={TextColor}
          value={password}
          onChangeText={text => setPassword(text)}
          secureTextEntry={true}
        />

        <Pressable
          onPress={handleLogin}
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? 'rgb(210, 230, 255)' : '#5081FF',
              padding: 10,
              borderRadius: 5,
              marginLeft: '65%',
              marginTop: 20,
            },
          ]}
        >
          <Text
            style={{
              textAlign: 'center',
              fontFamily: 'DMSansBold',
              color: '#FFFFFF',
              fontSize: 20,
            }}
          >
            LOGIN
          </Text>
        </Pressable>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'center',
          position: 'absolute',
          bottom: 0,
          marginBottom: '20%',
        }}
      >
        <Text
          style={{
            marginRight: 10,
            color: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
          }}
        >
          Don't have an account?
        </Text>
        <Pressable
          onPress={() => {
            router.replace('/SignUp');
          }}
        >
          {({ pressed }) => (
            <Text
              style={{
                fontFamily: 'DMSansBold',
                color: pressed ? '#88a9fc' : '#5081FF',
              }}
            >
              Sign Up
            </Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
