import React from 'react';
import 'react-native-gesture-handler';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';

import DefaultHeader from '../DefaultHeader';
import { GestureHandlerRefContext } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useRouter } from "expo-router";

import {View, Image} from 'react-native';
import { useSafeAreaFrame, useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetScrollable/BottomSheetFlashList';

function CustomDrawerContent(props: any) {
  const router = useRouter();
  const {top, bottom} = useSafeAreaInsets();
  return (
    <View style={{flex:1}}>
      <View style={{ height: 212,backgroundColor:"#5081FF", marginBottom: -40, flexDirection: 'row', alignItems: "center", justifyContent:"center"}}>
        <Image source={require("../../assets/images/BlackTransparentLogo.png")} style={{width: '80%', height:"40%",resizeMode: 'stretch', marginTop: 20, marginRight: 20}}></Image>
      </View>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        {/* <DrawerItem label={"Logout"} onPress={() => router.replace("/Login")} /> */} 
      </DrawerContentScrollView>

      <View style={{padding: 10, paddingBottom: 20 +bottom}}>
        <DrawerItem label={"Logout"} onPress={() => router.replace("/Login")} icon={({color}) => <MaterialCommunityIcons name="logout" size={34} color= {color} />}labelStyle={{ fontSize: 18 }} />
      </View>
    </View>

 
  );
}
export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>  
    <Drawer drawerContent={CustomDrawerContent} screenOptions={{drawerHideStatusBarOnOpen: true, drawerActiveBackgroundColor: "#5081FF", drawerActiveTintColor:"#fff", drawerInactiveTintColor: "#4E4E4E",    drawerLabelStyle: {                      // Style for the drawer labels
      fontSize: 18,
    }}}> 
      <Drawer.Screen name="Homepage" options={{header: () => <DefaultHeader />, drawerType: 'front'}} />
      <Drawer.Screen name="Events" options={{header: () => <DefaultHeader/>,  drawerItemStyle: { display: 'none' }, drawerType: 'front'}} />
      <Drawer.Screen name="CreateEvent" options={{headerShown: false,  drawerItemStyle: { display: 'none' }, drawerType: 'front'}} />
      <Drawer.Screen name="StoryPicker" options={{headerShown: false,  drawerItemStyle: { display: 'none' }, drawerType: 'front'}} />
      <Drawer.Screen name="ConfirmPage" options={{headerShown: false,  drawerItemStyle: { display: 'none' }, drawerType: 'front'}} />

      <Drawer.Screen name="EditEvent" options={{headerShown: false,  drawerItemStyle: { display: 'none' }, drawerType: 'front'}} />
      <Drawer.Screen name="Gallery" options={{header: () => <DefaultHeader/>, drawerType: 'front'}} />
      <Drawer.Screen name="UploadStory" options={{headerShown: false,  drawerItemStyle: { display: 'none' }, drawerType: 'front'}} />
      <Drawer.Screen name="InviteMember" options={{headerShown: false,  drawerItemStyle: { display: 'none' }, drawerType: 'front'}} />
      <Drawer.Screen name="UploadtoGallery" options={{headerShown: false,  drawerItemStyle: { display: 'none' }, drawerType: 'front'}} />
      <Drawer.Screen name="UpdateGallery" options={{headerShown: false,  drawerItemStyle: { display: 'none' }, drawerType: 'front'}} />
    </Drawer>
    </GestureHandlerRootView>  
  );
}