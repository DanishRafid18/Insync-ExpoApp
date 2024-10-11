import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import Background from '../Background';

interface ImageItem {
  filename: string;
  url: string;
}

export default function Gallery() {
  const [images, setImages] = useState<ImageItem[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('https://deco3801-foundjesse.uqcloud.net/restapi/photo.php?uploader=1');
        const json: ImageItem[] = await response.json();
        setImages(json);
      } catch (error) {
        console.error(error);
      }
    };
    fetchImages();
  }, []);

  return (
    <><Background />
    <ScrollView  style={styles.container}>
          <View>
              {images.map((item) => (
                  <Image
                      key={item.filename}
                      source={{ uri: item.url }}
                      style={styles.image} />
              ))}
          </View>
      </ScrollView></>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Center the images horizontally
    padding: 10,
    marginTop: 150
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
});
