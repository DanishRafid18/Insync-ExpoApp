import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
  Button,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import Background from '../Background';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function UploadtoGallery(): JSX.Element {
    const [image, setImage] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [familyMembers, setFamilyMembers] = useState<any[]>([]);
    const [selectedFamilyMembers, setSelectedFamilyMembers] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
  
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
      const fetchFamilyMembers = async () => {
        if (userId !== null) {
          try {
            //fetch family members
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
              //exclude the user themselves
              const filteredFamily = familyData.filter(
                (member) => member.user_id.toString() !== userId
              );
  
              //include icon URLs
              const baseURL = 'https://deco3801-foundjesse.uqcloud.net/uploads/';
              const familyWithIcons = filteredFamily.map((member) => ({
                ...member,
                iconUrl: `${baseURL}${member.icon}`,
              })); //set iconUrl to https://deco3801-foundjesse.uqcloud.net/uploads/${their icon filename}
  
              setFamilyMembers(familyWithIcons);
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
  
      fetchFamilyMembers();
    }, [userId]);
  
    //handle icon selection
    const handleIconPress = (memberId: string) => {
      if (selectedFamilyMembers.includes(memberId)) {
        //deselect if already selected
        setSelectedFamilyMembers(selectedFamilyMembers.filter((id) => id !== memberId)); //keep only those IDs that are not equal to the memberId being passed in. so if the id is the same as the one being pressed => bye bye
      } else {
        //select the member
        setSelectedFamilyMembers([...selectedFamilyMembers, memberId]); //add the id to selectedFamilyMembers
        console.log(memberId);
      }
    };
  
    const pickImage = async () => { //inspired by the code in https://docs.expo.dev/versions/latest/sdk/imagepicker/ 
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, //https://docs.expo.dev/versions/latest/sdk/imagepicker/ a way to only allow Image filetypes
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      console.log(result);
  
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    };

    const handleUpload = async () => {
      if (!image) {
        Alert.alert('Please select an image first.');
        return;
      }
  
      if (userId !== null) {
        try {
          //first, check if the photo already exists for the selected users
          const usersParam = [userId, ...selectedFamilyMembers].join(',');
          console.log('Users Param:', usersParam);
  
          const response = await fetch(
            `https://deco3801-foundjesse.uqcloud.net/restapi/photo_users.php?users=${usersParam}` //it will return either the photo_id or Does not exist
          );
          const data = await response.json();
          console.log(data[0].Photo == "Does not exist");
  
          if (data[0].Photo !== "Does not exist") { //if it already exist(returns a photo_id) => alert
            Alert.alert('Photo already exists for the selected users.');
            return;
          }
  
          const formData = new FormData();
          formData.append('uploader', userId);
          formData.append('photo', {
            uri: image,
            name: 'photo.jpg',
            type: 'image/jpeg',
          } as any);
  
          //now upload the photo
          const uploadResponse = await fetch(
            'https://deco3801-foundjesse.uqcloud.net/restapi/upload_photo_user.php',
            {
              method: 'POST',
              body: formData,
            }
          );
  
          if (uploadResponse.ok) {
            //get the photo_id from the response
            const uploadData = await uploadResponse.json();
            const photo_id = uploadData.photo_id;
            console.log('Uploaded photo_id:', photo_id);
  
            //for each selected family member, make POST request to associate the photo
            const associatePhotoPromises = selectedFamilyMembers.map(async (memberId) => {
              const postData = {
                photo: photo_id,
                user: memberId,
              };
  
              const associateResponse = await fetch(
                'https://deco3801-foundjesse.uqcloud.net/restapi/photo_users.php',
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(postData),
                }
              );
              if (!associateResponse.ok) {
                const errorText = await associateResponse.text();
                console.error(`Failed to associate photo with user ${memberId}:`, errorText);
              } else {
                console.log(`Photo associated with user ${memberId} successfully.`);
              }
            });
  
            await Promise.all(associatePhotoPromises);
  
            Alert.alert('Photo uploaded and associated with family members successfully.');
          } else {
            const errorText = await uploadResponse.text();
            console.error('Upload error:', errorText);
            Alert.alert('Failed to upload photo.');
          }
        } catch (error) {
          console.error('Error uploading photo:', error);
          Alert.alert('An error occurred during upload.');
        }
      }
    };
  
    return (
      <>
        <Background />
        <View style={styles.headerWrapper}>
        <Pressable
          onPress={() => {
            router.push("/drawer/Gallery");
          }}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back-outline" size={24} color="white" />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
      </View>
        <ScrollView contentContainerStyle={styles.container}>
          <Button title="Pick an image from camera roll" onPress={pickImage} />
          {image && <Image source={{ uri: image }} style={styles.image} />}
          <Text style={styles.heading}>Select Family Members in the Photo:</Text>
          {loading ? (
            <Text>Loading family members...</Text>
          ) : (
            <View style={styles.familyContainer}>
              {familyMembers.map((member) => {
                const isSelected = selectedFamilyMembers.includes(member.user_id.toString());
                return (
                  <TouchableOpacity
                    key={member.user_id}
                    style={[
                      styles.familyMember,
                      isSelected && styles.selectedFamilyMember,
                    ]}
                    onPress={() => handleIconPress(member.user_id.toString())}
                  >
                    <Image source={{ uri: member.iconUrl }} style={styles.familyIcon} />
                    <Text style={styles.familyName}>{member.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
          <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
            <Text style={styles.uploadButtonText}>Upload Photo</Text>
          </TouchableOpacity>
        </ScrollView>
      </>
    );
  }

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
    marginTop: 150,
  },
  image: {
    width: '100%',
    height: 200,
    marginVertical: 10,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  familyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  familyMember: {
    alignItems: 'center',
    margin: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 10,
    padding: 5,
  },
  selectedFamilyMember: {
    borderColor: '#5081FF',
  },
  familyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  familyName: {
    marginTop: 5,
    fontSize: 14,
    textAlign: 'center',
  },
  uploadButton: {
    backgroundColor: '#5081FF',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  uploadButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 18,
  },
  headerWrapper: {
    marginTop: 70,
    marginBottom: 10,
    alignItems: 'flex-start',
    paddingHorizontal: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: '#EFF3FF',
    fontWeight: 'bold',
    fontSize: 25,
    marginLeft: 10,
  },
});
