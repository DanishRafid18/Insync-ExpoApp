import React from 'react';
import { View, StyleSheet, Dimensions, useColorScheme } from 'react-native';
import { useNavigation } from 'expo-router';

const Background = () => {
  const { height: screenHeight } = Dimensions.get('window');
  const navigation = useNavigation();
  const headerHeight = screenHeight * 0.15;
  const colorScheme = useColorScheme();
  const MenuIcon = colorScheme === 'dark'
    ? require('@/assets/images/MenuBlack.png')
    : require('@/assets/images/MenuWhite.png');

  return (
    <View
      style={[
        styles.headerContainer,
        {
          height: headerHeight,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
        },
      ]}
    >
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    top: 0,                
    left: 0,
    right: 0,
    backgroundColor: '#5081FF',
    alignContent: 'space-around',
    zIndex: 0,
  }
});

export default Background;
