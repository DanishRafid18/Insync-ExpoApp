import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Image, ScrollView, Text, Dimensions, Pressable, Button, TouchableOpacity } from 'react-native';
import Background from '../Background';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

interface ImageItem {
  is_uploader: any;
  photo_id: number;
  filename: string;
  upload_date: string;
  url: string;
}

export default function Gallery() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null);

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

  useFocusEffect(
    useCallback(() => {
      const fetchImages = async () => {
        if (userId !== null) {
          try {
            const response = await fetch(`https://deco3801-foundjesse.uqcloud.net/restapi/photo.php?user_id=${userId}`);
            if (!response.ok) {
              console.error('HTTP error:', response.status);
              return;
            }
            const json = await response.json();

            const baseURL = 'https://deco3801-foundjesse.uqcloud.net/uploads/';

            //map the fetched data to include the full image URL
            const imagesWithURL: ImageItem[] = json.map((item: any) => ({
              photo_id: item.photo_id,
              filename: item.filename,
              upload_date: item.upload_date,
              url: `${baseURL}${item.filename}`,
              is_uploader: item.is_uploader === 1,
            }));

            setImages(imagesWithURL);
            console.log('Images fetched successfully:', imagesWithURL);
          } catch (error) {
            console.error('Fetch error:', error);
          } finally {
            setLoading(false);
          }
        }
      };
      fetchImages();
    }, [userId])
  );

  return (
    <>
    <Background></Background>
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
                  Photo Last updated on:{'\n'}
                  {item.upload_date}
                </Text>
                
                <Pressable
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed ? 'rgb(210, 230, 255)' : '#5081FF',
                    padding: 10,
                    borderRadius: 5,
                    marginTop: 20,
                    alignSelf: 'flex-end'
                  },
                ]}
              >
          <Text
            style={{
              textAlign: 'center',
              fontFamily: 'DMSansBold',
              color: '#FFFFFF',
              fontSize: 20,
            }}
          >
            Edit
          </Text>
        </Pressable>
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>No images found.</Text>
          )}
        </View>
        
      </ScrollView>
      <TouchableOpacity
      onPress={() => {
        router.push("/drawer/UploadtoGallery");
      }}
       style={styles.addButton}>
      <Image
        source={require('@/assets/images/add_icon.png')}
      />
    </TouchableOpacity>
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
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#5081FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 2,
  },
  container: {
    flexGrow: 1,
    padding: 10,
    paddingBottom: 30,
    marginTop: 70,
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
