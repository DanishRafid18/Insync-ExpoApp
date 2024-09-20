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


export default function LoginScreen(){
    const router = useRouter();
    const colorScheme = useColorScheme();

    const TextFieldColor = colorScheme === 'dark' ? '#2c2c2c' : '#FFFFFF';
    const TextColor = colorScheme === 'dark' ? '#dce1e8' : '#B3B9C2';

    const headerBackgroundColor = colorScheme === 'dark' ? '#2c2c2c' : '#FFFFFF';
    const headerLogo = colorScheme === 'dark' ? require('@/assets/images/WhiteTransparentLogo.png') : require('@/assets/images/BlackTransparentLogo.png');
    const headerTintColor = colorScheme === 'dark' ? '#FFFFFF' : '#000000';

    return (
      <SafeAreaView style={{ flex: 1}}>

        <View style= {{ width: 325, alignSelf: 'center', marginTop: 100 }}>
            <BlueTitleText>
                Login
            </BlueTitleText>

            <Text style={{color: TextColor, fontFamily: 'DMSansBold', fontSize: 17, marginBottom: 20}}>
              Please sign in to continue
            </Text>

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
            placeholder='Username'
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
                    color: colorScheme === 'dark' ? '#FFFFFF' : '#000000'
                    
                }}
            placeholder='Password'
            placeholderTextColor={TextColor}
            >
            </TextInput>
            <Pressable onPress={() => {
            
              router.replace('/Homepage');
            }}
            style = {({pressed}) => [
                  { //pressed code from https://reactnative.dev/docs/pressable under
                    backgroundColor: pressed ? 'rgb(210, 230, 255)' :  "#5081FF",  padding: 10, borderRadius: 5, marginLeft: "65%", marginTop: 20
                  }
                ]}>
              <Text style={{textAlign:'center', fontFamily: "DMSansBold", color: "#FFFFFF", fontSize: 20,}} >
                LOGIN
              </Text>
            </Pressable>
        </View>
        
        <View style={{flexDirection:'row', alignSelf: 'center', position:"absolute", bottom: 0, marginBottom: "20%"}}>       
          <Text style = {{marginRight: 10, color: colorScheme === 'dark' ? '#FFFFFF' : '#000000'}}> 
            Don't have an account? 
          </Text>
          <Pressable onPress={() => {
            
          router.push('/SignUp');
        }}>
            {({pressed}) => (
              <Text style={{fontFamily:'DMSansBold',color: pressed ? "#88a9fc" : "#5081FF" }}>
                {pressed ? 'Sign Up' : 'Sign Up'}
                </Text>
            )}
          </Pressable>
        </View> 
      </SafeAreaView>
    );
}