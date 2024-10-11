import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, ScrollView, Button } from 'react-native';
import Background from '../Background';
import * as ImagePicker from 'expo-image-picker';


interface ImageItem {
  filename: string;
  url: string;
}

export default function UploadStory() {
    const [image, setImage] = useState<string | null>(null);

    const pickImage = async () => {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      console.log(result);
  
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    };
  
    return (
      <View style={styles.container}>
        <Button title="Pick an image from camera roll" onPress={pickImage} />
        {image && <Image source={{ uri: image }} style={styles.image} />}
      </View>
    );
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginTop: 150
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
});
