import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  Image,
  Pressable,
  Button,
  Switch,
  Alert,
} from "react-native";
import Background from '../Background';
import {Picker} from '@react-native-picker/picker';
import { Dropdown, SelectCountry } from 'react-native-element-dropdown';
import { useRouter } from 'expo-router';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  TouchableOpacity,
} from "@gorhom/bottom-sheet";
import { StatusBar } from "expo-status-bar";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CustomRadioButton from "../../components/CustomRadioButton";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons/faChevronDown";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from "@expo/vector-icons/Ionicons";



interface UserData {
  first_name: string;
  status: string;
}

const data = [
  { label: 'Chilling', value: 'Chilling' },
  { label: "Occupied", value: "Occupied" },
  { label: 'Do Not Disturb', value: 'Do Not Disturb' }
];

export default function Homepage(): JSX.Element {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const colorScheme = useColorScheme();
  const TextColor = colorScheme === 'dark' ? '#FFFFFF' : '#FFFFFF'; 
  const [value, setValue] = useState(null);
  const [selectedText, setSelectedText] = useState<string>("Chilling");
  const [radioValue, setRadioValue] = useState<string>("Chilling");
  const GalleryImage = require('@/assets/images/HomepageGallery.jpg');
  const EventImage = require('@/assets/images/HomepageEvent.jpg');
  const [userId, setUserId] = useState<string | null>(null);
  const [familyIcons, setFamilyIcons] = useState<string[]>([]);
  const [updatingStatus, setUpdatingStatus] = useState<boolean>(false); //state for status update


  const router = useRouter();

    //Bottom sheet
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["55%"], []);
  const handleClosePress = () => bottomSheetRef.current?.close();
  const handleSnapPress = useCallback((index: any) => {
    bottomSheetRef.current?.snapToIndex(index);
  }, []);
  const [isDisabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  //background on bottomsheet
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        {...props}
      />
    ),
    []
  );

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
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (userId !== null) {
        try {
          //fetch user data
          console.log(userId)
          const response = await fetch(
            `https://deco3801-foundjesse.uqcloud.net/restapi/api.php?user_id=${userId}`
          );
  
          if (!response.ok) {
            console.error('HTTP error:', response.status);
            return;
          }
  
          const data = await response.json();
          console.log('Fetched data:', data[0]);
          setSelectedText(data[0].status) //set the status from the database
  
          if (Array.isArray(data) && data.length > 0) {
            setUserData(data[0]);
          } else {
            console.error('Invalid data format:', data);
          }
  
          //fetch family icons
          const familyResponse = await fetch(
            `https://deco3801-foundjesse.uqcloud.net/restapi/family.php?user=${userId}`
          );
  
          if (!familyResponse.ok) {
            console.error('Family HTTP error:', familyResponse.status);
            return;
          }
  
          const familyData = await familyResponse.json();
          console.log('Fetched family data:', familyData);
  
          if (Array.isArray(familyData) && familyData.length > 0) {
            //extract icon filenames and construct full URLs
            const icons = familyData.map((item) => `https://deco3801-foundjesse.uqcloud.net/uploads/${item.icon}`);
            setFamilyIcons(icons);
          } else {
            console.error('Invalid family data format:', familyData);
          }
        } catch (error) {
          console.error('Fetch error:', error);
        } finally {
          setLoading(false);
        }
      }
    };
  
    fetchUserData();
  }, [userId]);

    //function to handle status update with PUT request
    const updateStatus = async (newStatus: string) => {
      if (!userId) {
        Alert.alert('Error', 'User ID is missing.');
        return;
      }
  
      setUpdatingStatus(true); //loading
  
      try {
        const response = await fetch('https://deco3801-foundjesse.uqcloud.net/restapi/api.php', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
            status: newStatus,
          }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          Alert.alert('Success', 'Status updated successfully.');
          setRadioValue(newStatus);
          setSelectedText(newStatus);
          if (userData) {
            setUserData({ ...userData, status: newStatus });
          }
        } else {
          console.error('PUT error:', data);
          Alert.alert('Error', data.message || 'Failed to update status.');
        }
      } catch (error) {
        console.error('Update Status Error:', error);
        Alert.alert('Error', 'An error occurred while updating status.');
      } finally {
        setUpdatingStatus(false);
      }
    };

    const handleRadioPress = (value: string) => {
      setRadioValue(value);
      setSelectedText(value);
      console.log("Selected Radio Value:", value);
      updateStatus(value); //call the updateStatus function
      handleClosePress();
    };

  const statusColors: { [key: string]: string } = {
    Chilling: "#33FD2F", // Green
    Occupied: "#FFC250", // Yellow
    "Do Not Disturb": "#FF5050", // Red
    "Auto Status": "#7300FF"
  };

  return (
    <View style={styles.container}>
      <BottomSheet
        ref={bottomSheetRef}
        enablePanDownToClose={true}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        index={-1}
        style={styles.bottomSheetContainer}
      >
        <BottomSheetView style={styles.contentContainer}>
          <Text style={styles.containerHeadline}>User Status</Text>
          <View style={styles.row}>
            <Text style={styles.subtitle}>Auto Status</Text>
            <Switch
              trackColor={{ false: "#C7C7CC", true: "#5081FF" }}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isDisabled}
            />
          </View>
          <View>
            <Text style={styles.description}>
              Your status will change based on your event
            </Text>
          </View>
          <View>
            <View style={styles.main}>
              <View style={styles.round}></View>
              <CustomRadioButton
                label="Chilling"
                selected={radioValue === "Chilling"}
                onPress={() => {
                  if (!isDisabled) {
                    handleRadioPress("Chilling");
                    handleClosePress();
                  }
                }}
                isEnabled={!isDisabled}
                style={[
                  styles.radioButton,
                  isDisabled && styles.disabledButton,
                ]}
              />
            </View>
            <View style={styles.main}>
              <View style={styles.round1}></View>
              <CustomRadioButton
                label="Occupied"
                selected={radioValue === "Occupied"}
                onPress={() => {
                  if (!isDisabled) {
                    handleRadioPress("Occupied");
                    handleClosePress();
                  }
                }}
                isEnabled={!isDisabled}
                style={[
                  styles.radioButton,
                  isDisabled && styles.disabledButton,
                ]}
              />
            </View>
            <View style={styles.main}>
              <View style={styles.round2}></View>
              <CustomRadioButton
                label="Do Not Disturb"
                selected={radioValue === "Do Not Disturb"}
                onPress={() => {
                  if (!isDisabled) {
                    handleRadioPress("Do Not Disturb");
                    handleClosePress();
                  }
                }} //+
                isEnabled={!isDisabled}
                style={[
                  styles.radioButton,
                  isDisabled && styles.disabledButton,
                ]}
              />
            </View>
          </View>
        </BottomSheetView>
      </BottomSheet>
      <Background></Background>
      {loading ? (
        <Text>Loading...</Text>
      ) : userData ? (
        <><View style={styles.overlay}>
            <Text style={{
              fontSize: 28,
              fontWeight: 'bold',
              marginTop: 20,
              color: TextColor,
              zIndex: 2
            }}>
              Welcome, {userData.first_name}!
            </Text>
            {/* <Dropdown
              data={data}
            style={{width: "50%", marginTop: 10}}
            iconColor = {TextColor}
            iconStyle = {{justifyContent: "flex-start" }}
            selectedTextStyle={{color: TextColor}}
            placeholderStyle = {{color: TextColor}}
              maxHeight={300}
              labelField="label"
              valueField="value"
            placeholder= {userData.status}
              searchPlaceholder="Search..."
              value={value}
              onChange={item => {
                setValue(value);
            }}
          /> */}
            <Pressable
            style={styles.button}
            onPress={() => {
              if (!isDisabled) {
                handleSnapPress(0);
              }
            }}
            disabled={isDisabled}
          >
            {/* dynamically set the background color based on the selectedText or Auto Status */}
            <View
              style={[
                styles.status,
                {
                  backgroundColor: isDisabled
                    ? statusColors["Auto Status"]
                    : statusColors[selectedText] || "#C7C7CC",
                },
              ]}
            ></View>
            {/* conditionally render "Auto Status" or the selected text */}
            <Text style={styles.buttonText}>
              {isDisabled ? "Auto Status" : selectedText}
            </Text>
            <FontAwesomeIcon
              icon={faChevronDown}
              style={{ color: "#fff", marginLeft: 10 }}
            />
          </Pressable>
          <Text
            style={{
              fontSize: 15,
              marginTop: 10,
              color: TextColor,
              zIndex: 2,
            }}
          >
              Welcome back to your family in InSync
            </Text>
          </View>
          <View style={styles.iconsContainer}>
              {familyIcons.map((iconUrl, index) => (
                <Image
                  key={index}
                  source={{ uri: iconUrl }}
                  style={styles.familyIcon}
                  resizeMode="cover" />
              ))}
              <Pressable
              onPress={() => {
                router.push("./InviteMember");
              }}
            >
              <Ionicons name="add-circle-outline" size={50} color="#5081FF" />
            </Pressable>
            </View>
            </>
      ) : (
        <Text>No user data found.</Text>
        
      )}
      
      <Pressable
      onPress={() => {
        router.push('./Gallery');
      }}
        style={[
          styles.headerContainer,
          {
            height: '25%',
            width: '80%',
            borderRadius: 10,
            overflow: 'hidden',
            marginTop: "55%",
            alignSelf: 'center',
          },
        ]}
      >
        <Image
          source={GalleryImage}
          resizeMode="cover"
          style={{
            width: '100%',
            height: '100%',
          }}
        />
        <View style={styles.textContainer}>
          <Text style={styles.textOverImage}>View Gallery</Text>
        </View>
      </Pressable>

      <Pressable
      onPress={() => {
        router.push('/drawer/Events');
      }}
        style={[
          styles.headerContainer,
          {
            height: '25%',
            width: '80%',
            borderRadius: 10,
            overflow: 'hidden',
            marginTop: 20,
            alignSelf: 'center',
          },
        ]}
      >
        <Image
          source={EventImage}
          resizeMode="cover"
          style={{
            width: '100%',
            height: '100%',
          }}
        />
        <View style={styles.textContainer}>
          <Text style={styles.textOverImage}>View Your Events</Text>
        </View>
      </Pressable>
    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    marginLeft: 20,
    zIndex: 0,
  },
  button: {
    backgroundColor: "#5081FF",
    // padding: 10,
    borderRadius: 5,
    flexDirection: "row", // Align elements horizontally
    alignItems: "center", // Vertically center items
    marginTop: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  status: {
    width: 16, // Circle size
    height: 16,
    borderRadius: 8, // Make it a circle
    marginRight: 10, // Spacing between the circle and text
  },
  //bottomsheet
  bottomSheetContainer: {
    zIndex: 10000,
  },
  contentContainer: {
    flex: 1,
    alignItems: "flex-start",
  },
  containerHeadline: {
    fontSize: 24,
    fontWeight: "600",
    padding: 20,
    textAlign: "center",
    width: "100%",
  },
  row: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#4E4E4E",
  },
  description: {
    color: "#B5B5B5",
    textAlign: "left",
    paddingLeft: 10,
    marginBottom: 10,
  },
  main: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    margin: 8,
  },
  radioButton: {
  },
  disabledButton: {
    opacity: 0.5, 
  },
  round: {
    height: 22,
    width: 22,
    borderRadius: 20,
    backgroundColor: "#33FD2F",
    marginLeft: 10,
    marginRight: 20,
  },
  round1: {
    height: 22,
    width: 22,
    borderRadius: 20,
    backgroundColor: "#FFC250",
    marginLeft: 10,
    marginRight: 20,
  },
  round2: {
    height: 22,
    width: 22,
    borderRadius: 20,
    backgroundColor: "#FF5050",
    marginLeft: 10,
    marginRight: 20,
  },
  headerContainer: {
    position:"relative",
    backgroundColor: '#5081FF',
    alignContent: 'space-around',
    zIndex: -1
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  textContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',    
  },
  textOverImage: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  iconsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: "35%",
    width: 370,
    zIndex: -1,
    backgroundColor: "#FFFFFF",
    alignSelf: 'flex-end',
    position:'absolute',
    padding: 10,
    borderTopLeftRadius: 100,
    borderBottomLeftRadius: 100,
    shadowOpacity: 0.3,
    shadowOffset: {width: 0, height: 4}
  },
  familyIcon: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  addfamilyIcon: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#5081FF',
  }
});
