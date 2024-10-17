import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Image, ScrollView, Text, Dimensions, Pressable, Button, TouchableOpacity } from 'react-native';
import Background from '../Background';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";

interface ImageItem {
  is_uploader: boolean;
  photo_id: number;
  filename: string;
  upload_date: string;
  url: string;
  associated_users: number[];
}

interface UserNameMap {
  [key: number]: string;
}

export default function Gallery() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [userNames, setUserNames] = useState<UserNameMap>({});
  const router = useRouter();

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

  useFocusEffect( //https://reactnavigation.org/docs/use-focus-effect/ run when screen is active (get pictures)
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
              associated_users: item.associated_users,
            }));

            setImages(imagesWithURL);
            console.log('Images fetched successfully:', imagesWithURL);

            //extract unique user_ids from all images using Set for a collection of unique values
            const uniqueUserIds = new Set<number>();
            imagesWithURL.forEach(image => {
              image.associated_users.forEach((id: number) => uniqueUserIds.add(id));
            });

            console.log('Unique User IDs:', Array.from(uniqueUserIds));

            await fetchUserNames(uniqueUserIds);

          } catch (error) {
            console.error('Fetch error:', error);
          } finally {
            setLoading(false);
          }
        }
      };

      const fetchUserNames = async (userIds: Set<number>) => { //get the Ids from the set
        const userIdArray = Array.from(userIds);
        console.log('user IDs:', userIdArray);

        const fetchPromises = userIdArray.map(async (id) => { //get their names from each Ids
          try {
            const response = await fetch(`https://deco3801-foundjesse.uqcloud.net/restapi/api.php?user_id=${id}`);
            const data = await response.json();
            console.log(`Fetched data for user_id ${id}:`, data);
            
            if (Array.isArray(data) && data.length > 0) {
              return { id, first_name: data[0].first_name || 'Unknown' };
            } else {
              console.error(`No data found for user_id: ${id}`);
              return { id, first_name: 'Unknown' };
            }
          } catch (error) {
            console.error(`Error fetching user data for user_id: ${id}`, error);
            return { id, first_name: 'Unknown' };
          }
        });

        const usersData = await Promise.all(fetchPromises); //asynchronously wait for fetchPromises to finish, or there might be problems
        console.log('Users Data:', usersData);

        const namesMapping: UserNameMap = {};
        usersData.forEach(user => {
          namesMapping[user.id] = user.first_name;
        });
        console.log('User Names Mapping:', namesMapping);
        setUserNames(namesMapping);
      };

      fetchImages();
    }, [userId])
  );

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
                <View style={styles.detailsContainer}>
                  {/* Display Associated Users' Names */}
                  <Text style={styles.associatedUsers}>
                    {item.associated_users.length > 0
                      ? item.associated_users.map((id) => userNames[id] || 'Unknown').join(', ')
                      : 'No associated users'}
                  </Text>

                  {/* Photo Last Updated On */}
                  <Text style={styles.uploadDate}>
                    Photo Last updated on:{'\n'}
                    {item.upload_date}
                  </Text>

                  <Pressable
                    onPress={() => router.push({ pathname: './UpdateGallery', params: { photo_id: item.photo_id } })} // learned about params from https://stackoverflow.com/questions/76604270/passing-object-using-expo-router verified answer
                    style={({ pressed }) => [
                      {
                        backgroundColor: pressed ? 'rgb(210, 230, 255)' : '#5081FF',
                        padding: 10,
                        borderRadius: 5,
                        marginTop: 20,
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
      <FontAwesomeIcon icon={faPlus} size={38} color="#fff"/>
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
    paddingBottom: 200,
    backgroundColor: 'transparent',
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  image: {
    width: Dimensions.get('window').width / 2 - 20, //https://reactnative.dev/docs/dimensions
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
    textAlign: 'center',
    width: '100%',
  },
  uploadDate: {
    fontSize: 10,
    color: '#333',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerWrapper: {
    marginTop: 20,
    marginBottom: "25%",
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
  detailsContainer: {
    width: '90%',
    alignItems: 'flex-start',
    marginTop: 10,
  },
  associatedUsers: {
    alignSelf: 'flex-start',
    marginBottom: 5,
    fontWeight: 'bold',
    fontSize: 14,
    color: '#5081FF',
  },
});
