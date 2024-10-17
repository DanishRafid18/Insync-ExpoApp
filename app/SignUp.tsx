import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
  Image,
  Text,
  Pressable,
  TextInput,
  useColorScheme,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { BlueTitleText } from '@/components/BlueTitleText';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function SignUpScreen(){
    const router = useRouter();
    const colorScheme = useColorScheme();
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const TextFieldColor = colorScheme === 'dark' ? '#2c2c2c' : '#FFFFFF';
    const TextColor = colorScheme === 'dark' ? '#dce1e8' : '#B3B9C2';

    const handleSignUp = async () => {
      if (password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }
  
      try {
        //create FormData and append input values
        const formData = new FormData();
        formData.append('first_name', firstName);
        formData.append('email', email);
        formData.append('password', password);
  
        const response = await fetch('https://deco3801-foundjesse.uqcloud.net/restapi/api.php', {
          method: 'POST',
          body: formData, //use FormData as the body like usual
          headers: {
            'Content-Type': 'multipart/form-data', 
          },
        });
  
        const data = await response.json(); //the POST response will include a newly created user_id
  
        if (response.ok) {
          //save user_id to AsyncStorage, instead of params im trying something
          if (data.user_id) {
            await AsyncStorage.setItem('user_id', data.user_id);
          }
  
          Alert.alert('Success', 'Account created successfully');
          router.replace('/UploadPhoto'); //continue to upload photo
        } else {
          Alert.alert('Error', data.message || 'Something went wrong');
        }
      } catch (error) {
        console.error('Sign Up Error:', error);
        Alert.alert('Error', 'Unable to sign up. Please try again later.');
      }
    };
  
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ width: 325, alignSelf: 'center', marginTop: 100 }}>
          <BlueTitleText style={{ width: 500, fontSize: 40, marginBottom: 30 }}>
            Create Account
          </BlueTitleText>
  
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
            placeholder="Name"
            placeholderTextColor={TextColor}
            value={firstName}
            onChangeText={setFirstName}
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
              marginBottom: 20,
            }}
            placeholder="Email"
            placeholderTextColor={TextColor}
            value={email}
            onChangeText={setEmail}
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
              marginBottom: 20,
            }}
            placeholder="Password"
            placeholderTextColor={TextColor}
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
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
              marginBottom: 20,
            }}
            placeholder="Confirm Password"
            placeholderTextColor={TextColor}
            secureTextEntry={true}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
  
          <Pressable
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? 'rgb(210, 230, 255)' : '#5081FF',
                padding: 10,
                borderRadius: 5,
                marginLeft: '65%',
                marginTop: 20,
              },
            ]}
            onPress={handleSignUp}
          >
            <Text style={{ textAlign: 'center', fontFamily: 'DMSansBold', color: '#FFFFFF', fontSize: 20 }}>
              SIGN UP
            </Text>
          </Pressable>
        </View>
  
        <View style={{ flexDirection: 'row', alignSelf: 'center', position: 'absolute', bottom: 0, marginBottom: '20%' }}>
          <Text style={{ marginRight: 10, color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' }}>
            Have an account?
          </Text>
          <Pressable
            onPress={() => {
              router.replace('/Login');
            }}
          >
            {({ pressed }) => (
              <Text style={{ fontFamily: 'DMSansBold', color: pressed ? '#88a9fc' : '#5081FF' }}>
                {pressed ? 'Login' : 'Login'}
              </Text>
            )}
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }