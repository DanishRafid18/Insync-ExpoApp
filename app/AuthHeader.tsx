import React from 'react';
import { View, Image, Dimensions, useColorScheme } from 'react-native';

const AuthHeader = () => {
  const { height: screenHeight } = Dimensions.get('window');
  const colorScheme = useColorScheme();

  const headerHeight = screenHeight * 0.1;
  const headerLogo =
    colorScheme === 'dark'
      ? require('@/assets/images/WhiteTransparentLogo.png')
      : require('@/assets/images/BlackTransparentLogo.png');
    const headerBackgroundColor = colorScheme === 'dark' ? '#2c2c2c' : '#EFF3FF';

  return (
    <View
      style={{
        height: headerHeight,
        justifyContent: 'flex-end',
        backgroundColor: headerBackgroundColor,
      }}
    >
      <Image
        source={headerLogo}
        style={{
          width: 100,
          height: 40,
          alignSelf: 'flex-start',
          marginLeft: 20
        }}
      />
    </View>
  );
};

export default AuthHeader;
