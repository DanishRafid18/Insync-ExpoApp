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
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Background from '../Background';

//NOT USED! (maybe)
export default function UploadStory() {
  const router = useRouter();
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const { event_id } = useLocalSearchParams();
  

  //pick an image
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
        mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
        aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0]);
    }
  };
  const resetForm = () => {
    setImage(null);
  };
  

  const handleUpload = async () => {
    if (!image || !event_id) {
      Alert.alert('Error', 'Image or event ID is missing.');
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('event_id', event_id.toString());

    const uriParts = image.uri.split('/');
    const fileName = uriParts[uriParts.length - 1];
    const fileTypeMatch = /\.[0-9a-z]+$/i.exec(fileName); //https://stackoverflow.com/questions/6582171/javascript-regex-for-matching-extracting-file-extension
    const fileType = fileTypeMatch ? `image/${fileTypeMatch[0].substring(1).toLowerCase()}` : `image`;

    formData.append('photo', {
      uri: image.uri,
      name: fileName,
      type: fileType,
    } as any);

    try {
      const response = await fetch(
        'https://deco3801-foundjesse.uqcloud.net/restapi/update_event.php',
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
        Alert.alert('Success', 'Story uploaded successfully!');
        resetForm();
        router.back();
      } else {
        Alert.alert('Error', data.message || 'Failed to upload story.');
      }
    } catch (error) {
      console.error('Upload Error:', error);
      Alert.alert('Error', 'An error occurred while uploading the story.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Background />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerWrapper}>
          <Pressable
            onPress={() => {
              router.back();
            }}
            style={styles.backButton}
          >
            <Image
              style={styles.backIcon}
              source={require('@/assets/images/BackIcon.png')}
            />
            <Text style={styles.backText}>Upload Story</Text>
          </Pressable>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Pressable onPress={pickImage} style={styles.imagePickerButton}>
            <Text style={styles.imagePickerText}>
              {image ? 'Change Image' : 'Pick an Image'}
            </Text>
          </Pressable>

          {image && (
            <Image source={{ uri: image.uri }} style={styles.selectedImage} />
          )}

          {/* Upload Button */}
          <Pressable
            style={[styles.uploadButton, uploading && styles.buttonDisabled]}
            onPress={handleUpload}
            disabled={uploading}
          >
            {uploading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.uploadButtonText}>Upload Story</Text>
            )}
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    marginTop: 50,
    alignItems: 'center',
  },
  headerWrapper: {
    width: '85%',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
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
    width: '85%',
    alignItems: 'center',
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
  uploadButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
