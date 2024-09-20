// Import Dimensions
import React from 'react';
import { View, Text, StyleSheet, Dimensions, useColorScheme,Image } from 'react-native';

const DefaultHeader = () => {
  const { height: screenHeight } = Dimensions.get('window');
  const headerHeight = screenHeight * 0.125;
  const colorScheme = useColorScheme();
  const headerLogo = colorScheme === 'dark' ? require('@/assets/images/BlackTransparentLogo.png') : require('@/assets/images/WhiteTransparentLogo.png');

  return (
    <View style={[styles.headerContainer, { height: headerHeight }]}>
      <Image
          source={headerLogo}
          resizeMode="contain"
          style={{ width: "40%", height: "40%", marginBottom: "2%", alignSelf: 'flex-end' }}
        />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#5081FF',
    justifyContent: 'flex-end',

  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default DefaultHeader;
