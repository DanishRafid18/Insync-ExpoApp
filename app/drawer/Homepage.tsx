import React, { useEffect, useState,  } from 'react';
import { View, Text, StyleSheet, useColorScheme, Image, Pressable } from 'react-native';
import Background from '../Background';
import {Picker} from '@react-native-picker/picker';
import { Dropdown, SelectCountry } from 'react-native-element-dropdown';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const EventImage = require('@/assets/images/HomepageEvent.jpg');
  const [userId, setUserId] = useState<string | null>(null);
  const [familyIcons, setFamilyIcons] = useState<string[]>([]);

  const router = useRouter();


  //fetch userId from AsyncStorage
  useEffect(() => {
    const getUserId = async () => {
      try {
        const id = await AsyncStorage.getItem('user_id');
        if (id !== null) {
          setUserId(id);
        } else {
          console.error('No user_id found in AsyncStorage');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error retrieving user_id:', error);
        setLoading(false);
      }
    };

    getUserId();
  }, []);
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (userId !== null) {
        try {
          //fetch user data
          console.log(userId)
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
  
          //fetch family icons
          const familyResponse = await fetch(
            `https://deco3801-foundjesse.uqcloud.net/restapi/family.php?user=${userId}`
          );
  
          if (!familyResponse.ok) {
            console.error('Family HTTP error:', familyResponse.status);
            return;
          }
  
          const familyData = await familyResponse.json();
          console.log('Fetched family data:', familyData);
  
          if (Array.isArray(familyData) && familyData.length > 0) {
            //extract icon filenames and construct full URLs
            const icons = familyData.map((item) => `https://deco3801-foundjesse.uqcloud.net/uploads/${item.icon}`);
            setFamilyIcons(icons);
          } else {
            console.error('Invalid family data format:', familyData);
          }
        } catch (error) {
          console.error('Fetch error:', error);
        } finally {
          setLoading(false);
        }
      }
    };
  
    fetchUserData();
  }, [userId]);

  return (
    <View style={styles.container}>
      <Background></Background>
      {loading ? (
        <Text>Loading...</Text>
      ) : userData ? (
        <><View style={styles.overlay}>
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
          <View style={styles.iconsContainer}>
              {familyIcons.map((iconUrl, index) => (
                <Image
                  key={index}
                  source={{ uri: iconUrl }}
                  style={styles.familyIcon}
                  resizeMode="cover" />
              ))}
              <Pressable
              onPress={() => {
                router.push('./InviteMember');
              }}
              >
              <Image
                  key={"add_member"}
                  source={require('@/assets/images/add_family_icon.png')}
                  style={styles.addfamilyIcon}
                  resizeMode="cover" />
                  </Pressable>
            </View>
            </>
      ) : (
        <Text>No user data found.</Text>
        
      )}
      
      <Pressable
      onPress={() => {
        router.push('./Gallery');
      }}
        style={[
          styles.headerContainer,
          {
            height: '25%',
            width: '80%',
            borderRadius: 10,
            overflow: 'hidden',
            marginTop: "55%",
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
      onPress={() => {
        router.push('/drawer/Events');
      }}
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
          source={EventImage}
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
  iconsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: "35%",
    width: 400,
    zIndex: 2,
    backgroundColor: "#FFFFFF",
    alignSelf: 'flex-end',
    position:'absolute',
    padding: 10,
    borderTopLeftRadius: 100,
    borderBottomLeftRadius: 100,
    shadowOpacity: 0.3,
    shadowOffset: {width: 0, height: 4}
  },
  familyIcon: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  addfamilyIcon: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#5081FF',
  }
});
