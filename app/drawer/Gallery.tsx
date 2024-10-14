import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, ScrollView, Text, Dimensions, Pressable } from 'react-native';
import Background from '../Background';
import { router } from 'expo-router';

interface ImageItem {
  photo_id: number;
  filename: string;
  upload_date: string;
  url: string;
}

export default function Gallery() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true); //loading state

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('https://deco3801-foundjesse.uqcloud.net/restapi/photo.php?uploader=1');
        if (!response.ok) {
          console.error('HTTP error:', response.status);
          return;
        }
        const json = await response.json();

        //the base URL where images are hosted
        const baseURL = 'https://deco3801-foundjesse.uqcloud.net/uploads/';

        //map the fetched data to include the full image URL
        const imagesWithURL: ImageItem[] = json.map((item: any) => ({
          photo_id: item.photo_id,
          filename: item.filename,
          upload_date: item.upload_date,
          url: `${baseURL}${item.filename}`, //the constructed URL. so for example: https://deco3801-foundjesse.uqcloud.net/IMG_6427.jpg
        }));

        setImages(imagesWithURL);
        console.log("Images fetched successfully:", imagesWithURL);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false); //end loading
      }
    };
    fetchImages();
  }, []);

  return (
    <>
      <Background />
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
          <Text style={styles.backText}>Gallery</Text>
        </Pressable>
        
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.imageContainer}>
          {loading ? (
            <Text style={styles.loadingText}>Loading images...</Text>
          ) : images.length > 0 ? (
            images.map((item) => (
              <View key={item.photo_id} style={styles.itemContainer}>
                <Image
                  source={{ uri: item.url }}
                  style={styles.image}
                  resizeMode="cover"
                />
                <Text style={styles.uploadDate}>
                  Photo Last updated on: {"\n"}{item.upload_date}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>No images found.</Text>
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  galleryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 20,
    color: '#5081FF',
  },
  container: {
    flexGrow: 1,
    padding: 10,
    paddingBottom: 30,
    marginTop: 50,
    backgroundColor: 'transparent',
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  image: {
    width: Dimensions.get('window').width / 2 - 20,
    height: 200,
    margin: 10,
    borderRadius: 10,
    backgroundColor: '#E0E0E0',
  },
  loadingText: {
    fontSize: 18,
    color: '#5081FF',
  },
  noDataText: {
    fontSize: 18,
    color: '#5081FF',
  },
  uploadDate:{
    fontSize: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
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
});
