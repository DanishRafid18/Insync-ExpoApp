import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  Alert,
  Pressable,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Background from '../Background';
import { Ionicons } from '@expo/vector-icons';

const UpdateGallery = () => {
    const router = useRouter();
    const { photo_id } = useLocalSearchParams();  //use useLocalSearchParams to get the params
  
    //ensure photo_id is a string (handle the possibility of an array)
    const normalizedPhotoId = Array.isArray(photo_id) ? photo_id[0] : photo_id;
  
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
  
    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Only images
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    };
  
    const handleUpdate = async () => {
      if (!image) {
        Alert.alert('Please select an image first.');
        return;
      }
  
      if (!normalizedPhotoId) {
        Alert.alert('No photo_id provided.');
        return;
      }
  
      try {
        setLoading(true);
  
        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('photo_id', normalizedPhotoId);  // Use normalizedPhotoId to ensure it's a string
        formData.append('photo', {
          uri: image,
          name: 'photo.jpg',
          type: 'image/jpeg',
        } as any);
  
        const response = await fetch('https://deco3801-foundjesse.uqcloud.net/restapi/update_photo.php', {
          method: 'POST',
          body: formData,
        });
  
        if (response.ok) {
          Alert.alert('Photo updated successfully.');
          router.back();
        } else {
          const errorText = await response.text();
          console.error('Update error:', errorText);
          Alert.alert('Failed to update photo.');
        }
      } catch (error) {
        console.error('Error updating photo:', error);
        Alert.alert('An error occurred during update.');
      } finally {
        setLoading(false);
      }
    };

  return (
    <><Background></Background>
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
    <View style={styles.container}>
      <Text style={styles.heading}>Update Photo</Text>
      <Button title="Pick a new image" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Button title="Update Photo" onPress={handleUpdate} disabled={loading} />
    </View></>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 70,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 300,
    marginVertical: 16,
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

export default UpdateGallery;
