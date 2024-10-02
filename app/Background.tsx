import React from 'react';
import { View, Text, StyleSheet, Dimensions, useColorScheme,Image, Button, Pressable } from 'react-native';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';

const Background = () => {
  const { height: screenHeight } = Dimensions.get('window');
  const navigation = useNavigation()
  const headerHeight = screenHeight * 0.15;
  const colorScheme = useColorScheme();
  const MenuIcon = colorScheme === 'dark' ? require('@/assets/images/MenuBlack.png') : require('@/assets/images/MenuWhite.png');
  return (
    <View style={[styles.headerContainer, { height: headerHeight, borderBottomLeftRadius: 10, borderBottomRightRadius: 10,}]}>
      
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position:"relative",
    backgroundColor: '#5081FF',
    alignContent: 'space-around',
    zIndex: 0
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Background;
