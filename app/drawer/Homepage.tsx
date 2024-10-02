import React, { useEffect, useState,  } from 'react';
import { View, Text, StyleSheet, useColorScheme, Image, Pressable } from 'react-native';
import Background from '../Background';
import {Picker} from '@react-native-picker/picker';
import { Dropdown, SelectCountry } from 'react-native-element-dropdown';

interface UserData {
  first_name: string;
  status: string;
}

const data = [
  { label: 'Chilling', value: 'Chilling' },
  { label: 'Do not disturb', value: 'Do not disturb' }
];

export default function Homepage(): JSX.Element {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const colorScheme = useColorScheme();
  const TextColor = colorScheme === 'dark' ? '#FFFFFF' : '#FFFFFF'; 
  const [value, setValue] = useState(null);
  const GalleryImage = require('@/assets/images/HomepageGallery.jpg');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = 1;
        const response = await fetch(
          `https://deco3801-foundjesse.uqcloud.net/restapi/api.php?user_id=${userId}`
        );

        if (!response.ok) {
          console.error('HTTP error:', response.status);
          return;
        }

        const data = await response.json();
        console.log('Fetched data:', data);

        if (Array.isArray(data) && data.length > 0) {
          setUserData(data[0]);
        } else {
          console.error('Invalid data format:', data);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      <Background></Background>
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : userData ? (
        <View style={styles.overlay}>
          <Text style={{
            fontSize: 28,
            fontWeight: 'bold',
            marginTop: 20,
            color: TextColor,
            zIndex: 2
          }}>
            Welcome, {userData.first_name}!
          </Text>
          <Dropdown
            data={data}
            style={{width: "50%", marginTop: 10}}
            iconColor = {TextColor}
            iconStyle = {{justifyContent: "flex-start" }}
            selectedTextStyle={{color: TextColor}}
            placeholderStyle = {{color: TextColor}}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder= {userData.status}
            searchPlaceholder="Search..."
            value={value}
            onChange={item => {
              setValue(value);
            }}
          />
          <Text style={{
            fontSize: 15,
            marginTop: 10,
            color: TextColor,
            zIndex: 2
          }}>
            Welcome back to your family in InSync
          </Text>
        </View>
      ) : (
        <Text style={styles.noDataText}>No user data found.</Text>
        
      )}
      
      <Pressable
        style={[
          styles.headerContainer,
          {
            height: '25%',
            width: '80%',
            borderRadius: 10,
            overflow: 'hidden',
            marginTop: 20,
            alignSelf: 'center',
          },
        ]}
      >
        <Image
          source={GalleryImage}
          resizeMode="cover"
          style={{
            width: '100%',
            height: '100%',
          }}
        />
        <View style={styles.textContainer}>
          <Text style={styles.textOverImage}>View Gallery</Text>
        </View>
      </Pressable>

      <Pressable
        style={[
          styles.headerContainer,
          {
            height: '25%',
            width: '80%',
            borderRadius: 10,
            overflow: 'hidden',
            marginTop: 20,
            alignSelf: 'center',
          },
        ]}
      >
        <Image
          source={GalleryImage}
          resizeMode="cover"
          style={{
            width: '100%',
            height: '100%',
          }}
        />
        <View style={styles.textContainer}>
          <Text style={styles.textOverImage}>View Your Events</Text>
        </View>
      </Pressable>
    
    </View>
  );
}

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    position: 'relative',
  },
  
  overlay: {
    position: 'absolute',
    marginLeft: 20,
    zIndex: 1,
  },
  loadingText: {
  },
  noDataText: {
  },
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
  textContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',    
  },
  textOverImage: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
