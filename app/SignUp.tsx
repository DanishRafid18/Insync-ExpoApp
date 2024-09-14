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
import { useRouter } from 'expo-router';
import { BlueTitleText } from '@/components/BlueTitleText';


export default function SignUpScreen(){
    const router = useRouter();
    const colorScheme = useColorScheme();

    const TextFieldColor = colorScheme === 'dark' ? '#2c2c2c' : '#FFFFFF';
    const TextColor = colorScheme === 'dark' ? '#dce1e8' : '#B3B9C2';

    return (
      <SafeAreaView style={{ flex: 1}}>
        <View style= {{ width: 325, alignSelf: 'center', marginTop: 100 }}>
            <BlueTitleText style = {{width:500, fontSize: 40, marginBottom: 30}}>
                Create Account
            </BlueTitleText>
            <TextInput 
            style = 
                {{
                    backgroundColor: TextFieldColor, 
                    borderWidth: 1, 
                    borderColor:"#5081FF", 
                    borderRadius:5, 
                    height: 50,
                    padding: 10,
                    color: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
                    marginBottom: 20
                }}
            placeholder='Full Name'
            placeholderTextColor={TextColor}
            >
            </TextInput>
            <TextInput 
            style = 
                {{
                    backgroundColor: TextFieldColor, 
                    borderWidth: 1, 
                    borderColor:"#5081FF", 
                    borderRadius:5, 
                    height: 50,
                    padding: 10,
                    color: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
                    marginBottom: 20
                }}
            placeholder='Email'
            placeholderTextColor={TextColor}
            >
            </TextInput>
            <TextInput 
            style = 
                {{
                    backgroundColor: TextFieldColor, 
                    borderWidth: 1, 
                    borderColor:"#5081FF", 
                    borderRadius:5, 
                    height: 50,
                    padding: 10,
                    color: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
                    marginBottom: 20
                }}
            placeholder='Password'
            placeholderTextColor={TextColor}
            >
            </TextInput>
            <TextInput 
            style = 
                {{
                    backgroundColor: TextFieldColor, 
                    borderWidth: 1, 
                    borderColor:"#5081FF", 
                    borderRadius:5, 
                    height: 50,
                    padding: 10,
                    color: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
                    marginBottom: 20
                }}
            placeholder='Confirm Password'
            placeholderTextColor={TextColor}
            >
            </TextInput>
            <Pressable style = {({pressed}) => [
                  { //pressed code from https://reactnative.dev/docs/pressable under
                    backgroundColor: pressed ? 'rgb(210, 230, 255)' :  "#5081FF",  width: 125, height: 60, padding:12,  borderRadius: 5, marginLeft: "65%", marginTop: 20
                  }
                ]}>
              <Text style={{textAlign:'center', fontFamily: "DMSansBold", color: "#FFFFFF", fontSize: 25,}} >
                SIGN UP
              </Text>
            </Pressable>
        </View>
      </SafeAreaView>
    );
}