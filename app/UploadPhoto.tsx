import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Button,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlueTitleText } from '@/components/BlueTitleText';
import Background from './Background';

const UploadPhoto = () => {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  //fetch user_id from AsyncStorage
  useEffect(() => {
    const getUserId = async () => {
      try {
        const id = await AsyncStorage.getItem('user_id');
        if (id !== null) {
          setUserId(id);
        } else {
          Alert.alert('Error', 'User ID not found. Please sign up again.');
          router.replace('/SignUp'); 
        }
      } catch (error) {
        console.error('Error retrieving user_id:', error);
        Alert.alert('Error', 'An error occurred while retrieving user information.');
        router.replace('/SignUp');
      }
    };

    getUserId();
  }, []);

  //function to pick an image like others
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Camera roll permissions are required to select an image.'
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3]
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleUpload = async () => {
    if (!image || !userId) {
      Alert.alert('Error', 'Image or User ID is missing.');
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append('uploader', userId);

    //extract filename and type
    const uriParts = image.split('/');
    const fileName = uriParts[uriParts.length - 1];
    const fileTypeMatch = /\.[0-9a-z]+$/i.exec(fileName); //https://stackoverflow.com/questions/6582171/javascript-regex-for-matching-extracting-file-extension
    const fileType = fileTypeMatch ? `image/${fileTypeMatch[0].substring(1).toLowerCase()}` : `image`;

    formData.append('photo', {
      uri: image,
      name: fileName,
      type: fileType,
    } as any);

    try {
      const response = await fetch(
        'https://deco3801-foundjesse.uqcloud.net/restapi/upload_photo_user.php',
        {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Profile photo uploaded successfully!');
        router.replace('/Login');
      } else {
        Alert.alert('Error', data.message || 'Failed to upload photo.');
      }
    } catch (error) {
      console.error('Upload Error:', error);
      Alert.alert('Error', 'An error occurred while uploading the photo.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <BlueTitleText style={{fontSize: 30, marginBottom: 30, alignSelf: 'center'}}>
          Upload your picture!
          </BlueTitleText>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Pressable
            style={[
              styles.uploadButton,
              (!image || uploading) && styles.buttonDisabled,
            ]}
            onPress={handleUpload}
            disabled={!image || uploading}
          >
            {uploading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.uploadButtonText}>Upload Photo</Text>
            )}
          </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    marginTop: 50,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerWrapper: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  backText: {
    color: '#EFF3FF',
    fontWeight: 'bold',
    fontSize: 25,
    marginLeft: 10,
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    marginBottom: 30,
    textAlign: 'center',
  },
  imagePickerButton: {
    backgroundColor: '#5081FF',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  imagePickerText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  selectedImage: {
    width: 200,
    height: 200,
    marginTop: 20,
    borderRadius: 5,
  },
  uploadButton: {
    backgroundColor: '#5081FF',
    padding: 15,
    borderRadius: 5,
    marginTop: 40,
    width: '100%',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#A0C1FF',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default UploadPhoto;