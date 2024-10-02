
import React from 'react';
import { View, Text, StyleSheet, Dimensions, useColorScheme,Image, Button, Pressable } from 'react-native';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';

const DefaultHeader = () => {
  const { height: screenHeight } = Dimensions.get('window');
  const navigation = useNavigation()
  const headerHeight = screenHeight * 0.10;
  const colorScheme = useColorScheme();
  const MenuIcon = colorScheme === 'dark' ? require('@/assets/images/MenuBlack.png') : require('@/assets/images/MenuWhite.png');

  const openDrawer = () =>{
    navigation.dispatch(DrawerActions.toggleDrawer)
  }

  return (
    <View style={[styles.headerContainer, { height: headerHeight, }]}>
      <Pressable onPress={openDrawer}>
      <Image
          source={MenuIcon}
          resizeMode="contain"
          style={{ width: "15%", height: "30%", marginBottom: "2%", marginTop: "15%", }}
        />
        </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#5081FF',
    alignContent: 'space-around',
    zIndex: 1000
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default DefaultHeader;
