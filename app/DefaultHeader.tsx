import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  useColorScheme,
  Image,
  Pressable,
} from 'react-native';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';

const DefaultHeader = () => {
  const { height: screenHeight } = Dimensions.get('window');
  const navigation = useNavigation();
  const headerHeight = screenHeight * 0.1;
  const colorScheme = useColorScheme();
  const MenuIcon =
    colorScheme === 'dark'
      ? require('@/assets/images/MenuBlack.png')
      : require('@/assets/images/MenuWhite.png');

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.toggleDrawer());
  };

  return (
    <View style={[styles.headerContainer, { height: headerHeight }]}>
      <Pressable onPress={openDrawer}>
        <Image
          source={MenuIcon}
          resizeMode="contain"
          style={{
            width: 40,
            height: 40,
            marginLeft: 10,
            marginTop: 50
          }}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#5081FF',
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1000,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default DefaultHeader;
