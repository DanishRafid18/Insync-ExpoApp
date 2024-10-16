import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
  Image,
  Text,
  Pressable,
  TextInput,
  useColorScheme,
  Alert,
  StyleSheet,
  Button
} from 'react-native';
import { useRouter } from 'expo-router';
import { BlueTitleText } from '@/components/BlueTitleText';
import * as ImagePicker from 'expo-image-picker';


export default function UploadPhoto(){
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
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
      <BlueTitleText style={{fontSize: 30, marginBottom: 30, alignSelf: 'center'}}>
          Upload your picture!
          </BlueTitleText>
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