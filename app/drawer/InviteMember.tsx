import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  useColorScheme,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback, 
  Keyboard,
  Platform,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import Background from '../Background';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { ImagePickerAsset } from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { Dropdown } from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlueTitleText } from '@/components/BlueTitleText';

export default function InviteMember() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const navigation = useNavigation();
  
    const TextFieldColor = colorScheme === 'dark' ? '#2c2c2c' : '#FFFFFF';
    const TextColor = colorScheme === 'dark' ? '#dce1e8' : '#B3B9C2';
  
    const handleSubmit = async () => {
        Alert.alert('Invite sent!');
        router.back();//back after success
      };
   
  
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ width: 325, alignSelf: 'center', marginTop: 100 }}>
          <BlueTitleText style={{fontSize: 30}}>Invite Family Member</BlueTitleText>
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
              marginTop: 20
            }}
            placeholder="Name"
            placeholderTextColor={TextColor}
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
            placeholder="Email"
            placeholderTextColor={TextColor}
            secureTextEntry={true}
          />
  
          <Pressable
            onPress={handleSubmit}
            style={({ pressed }) => [
              {

                backgroundColor: pressed ? 'rgb(210, 230, 255)' : '#5081FF',
                padding: 10,
                borderRadius: 5,
                marginTop: 20,
                maxWidth: 400,
                alignSelf: 'flex-end'
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
              Send Invite
            </Text>
          </Pressable>
        </View>
        <View style={{ flexDirection: 'row', alignSelf: 'center', position: 'absolute', bottom: 0, marginBottom: '20%' }}>
          <Pressable
            onPress={() => {
              router.back();
            }}
          >
            {({ pressed }) => (
              <Text style={{ fontFamily: 'DMSansBold', color: pressed ? '#88a9fc' : '#5081FF', fontSize: 30}}>
                {pressed ? 'Back' : 'Back'}
              </Text>
            )}
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }