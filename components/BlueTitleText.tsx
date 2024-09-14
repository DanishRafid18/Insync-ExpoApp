import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { useEffect } from 'react';
import {
    StyleSheet,
    Text,
    TextProps
  } from 'react-native';

export const BlueTitleText: React.FC<TextProps> =  (props) =>{
    const [loaded] = useFonts({
        DMSansBold: require('../assets/fonts/DMSans-Bold.ttf'),
      });
      useEffect(() => {
        if (loaded) {
          SplashScreen.hideAsync();
        }
      }, [loaded]);
    
      if (!loaded) {
        return null;
      }
    return(
        <Text {...props} style={[
            {...styles.text }, props.style
        ]}>
            {props.children}
        </Text>
    );

}

const styles = StyleSheet.create({
    text:{
        fontSize: 50,
        color: "#5081FF",
        fontFamily: 'DMSansBold',
    }
})