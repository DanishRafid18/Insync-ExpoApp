import React from 'react';
import { Drawer } from 'expo-router/drawer';
import DefaultHeader from '../DefaultHeader';

export default function DrawerLayout() {
  return (
    <Drawer>
      <Drawer.Screen name="Homepage" options={{header: () => <DefaultHeader />, drawerType: 'front'}} />
      <Drawer.Screen name="Events" options={{header: () => <DefaultHeader/>,  drawerItemStyle: { display: 'none' }, drawerType: 'front'}} />
      <Drawer.Screen name="CreateEvent" options={{headerShown: false,  drawerItemStyle: { display: 'none' }, drawerType: 'front'}} />
      <Drawer.Screen name="Gallery" options={{header: () => <DefaultHeader/>, drawerType: 'front'}} />
      <Drawer.Screen name="UploadStory" options={{headerShown: false,  drawerItemStyle: { display: 'none' }, drawerType: 'front'}} />
      <Drawer.Screen name="InviteMember" options={{headerShown: false,  drawerItemStyle: { display: 'none' }, drawerType: 'front'}} />
      <Drawer.Screen name="UploadtoGallery" options={{headerShown: false,  drawerItemStyle: { display: 'none' }, drawerType: 'front'}} />

    </Drawer>
  );
}