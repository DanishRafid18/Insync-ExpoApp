import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Background from '../Background';
import * as ImagePicker from 'expo-image-picker';
import { ImagePickerAsset } from 'expo-image-picker';

export default function StoryPicker(): JSX.Element {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [image, setImage] = React.useState<ImagePickerAsset | null>(null);

  const pickImage = async () => {
    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
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
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0]);
    }
  };

  const resetForm = () => {
    setImage(null);
  };

  const handleNext = () => {
    router.push({
      pathname: './ConfirmPage',
      params: {
        ...params,
        imageUri: image ? image.uri : null, //pass null if no image is selected
      },
    });
  };

  return (
    <>
      <Background />
      
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerWrapper}>
          <Pressable
            onPress={() => {
              resetForm();
              router.back();
            }}
            style={styles.backButton}
          >
            <Image
              style={styles.backIcon}
              source={require('@/assets/images/BackIcon.png')}
            />
            <Text style={styles.backText}>Select Image</Text>
          </Pressable>
          <Image
          style = {{width: 400, height: 70, resizeMode: 'contain', marginTop: 50}}
          source={require('@/assets/images/progress_story.png')}
        />
        </View>

        <View style={styles.content}>
          <Pressable onPress={pickImage} style={styles.imagePickerButton}>
            <Text style={styles.imagePickerText}>Pick an Image</Text>
          </Pressable>
          {image && (
            <Image source={{ uri: image.uri }} style={styles.selectedImage} />
          )}

          {/* Next Button */}
          <Pressable style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Next</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
  },
  headerWrapper: {
    marginTop: 20,
    marginBottom: 10,
    alignItems: 'flex-start',
    paddingHorizontal: 20,
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
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 30,
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
  nextButton: {
    backgroundColor: '#5081FF',
    padding: 15,
    borderRadius: 5,
    marginTop: 40,
    width: '100%',
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
