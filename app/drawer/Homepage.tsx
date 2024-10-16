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
} from "react-native";
import Background from "../Background";
import { Picker } from "@react-native-picker/picker";
import { Dropdown, SelectCountry } from "react-native-element-dropdown";
import { router } from "expo-router";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  TouchableOpacity,
} from "@gorhom/bottom-sheet";
import { StatusBar } from "expo-status-bar";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CustomRadioButton from "../../components/CustomRadioButton";

//icon
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons/faChevronDown";

interface UserData {
  first_name: string;
  status: string;
}

const data = [
  { label: "Chilling", value: "Chilling" },
  { label: "Occupied", value: "Occupied" },
  { label: "Do not disturb", value: "Do not disturb" },
];

export default function Homepage(): JSX.Element {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const colorScheme = useColorScheme();
  const TextColor = colorScheme === "dark" ? "#FFFFFF" : "#FFFFFF";
  const [value, setValue] = useState(null);
  const [radioValue, setRadioValue] = useState<string>("Chilling");

  const [selectedText, setSelectedText] = useState<string>("Chilling");

  const GalleryImage = require("@/assets/images/HomepageGallery.jpg");
  const EventImage = require("@/assets/images/HomepageEvent.jpg");

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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = 1;
        const response = await fetch(
          "https://deco3801-foundjesse.uqcloud.net/restapi/api.php?user_id=${userId}"
        );

        if (!response.ok) {
          console.error("HTTP error:", response.status);
          return;
        }

        const data = await response.json();
        console.log("Fetched data:", data);

        if (Array.isArray(data) && data.length > 0) {
          setUserData(data[0]);
        } else {
          console.error("Invalid data format:", data);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleRadioPress = (value: string) => {
    setRadioValue(value);
    setSelectedText(value);
    console.log("Selected Radio Value:", value);
  };

  const statusColors: { [key: string]: string } = {
    Chilling: "#33FD2F", // Green
    Occupied: "#FFC250", // Yellow
    "Do not disturb": "#FF5050", // Red
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
                label="Do not disturb"
                selected={radioValue === "Do not disturb"}
                onPress={() => {
                  if (!isDisabled) {
                    handleRadioPress("Do not disturb");
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
        <Text style={styles.loadingText}>Loading...</Text>
      ) : userData ? (
        <View style={styles.overlay}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              marginTop: 20,
              color: TextColor,
              zIndex: 2,
            }}
          >
            Welcome, {userData.first_name}!
          </Text>
          {/* <Dropdown
            data={data}
            style={{ width: "50%", marginTop: 10 }}
            iconColor={TextColor}
            iconStyle={{ justifyContent: "flex-start" }}
            selectedTextStyle={{ color: TextColor }}
            placeholderStyle={{ color: TextColor }}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={selectedText} 
            searchPlaceholder="Search..."
            value={selectedText} 
            onFocus={() => handleSnapPress(0)}
            onChange={(item) => {
              setSelectedText(item.label); 
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
            {/* Dynamically set the background color based on the selectedText or Auto Status */}
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

            {/* Conditionally render "Auto Status" or the selected text */}
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
      ) : (
        <Text style={styles.noDataText}>No user data found.</Text>
      )}

      <Pressable
        onPress={() => {
          router.push("./Gallery");
        }}
        style={[
          styles.headerContainer,
          {
            height: "25%",
            width: "80%",
            borderRadius: 10,
            overflow: "hidden",
            marginTop: "45%",
            alignSelf: "center",
          },
        ]}
      >
        <Image
          source={GalleryImage}
          resizeMode="cover"
          style={{
            width: "100%",
            height: "100%",
          }}
        />
        <View style={styles.textContainer}>
          <Text style={styles.textOverImage}>View Gallery</Text>
        </View>
      </Pressable>

      <Pressable
        onPress={() => {
          router.push("./Events");
        }}
        style={[
          styles.headerContainer,
          {
            height: "25%",
            width: "80%",
            borderRadius: 10,
            overflow: "hidden",
            marginTop: 20,
            alignSelf: "center",
          },
        ]}
      >
        <Image
          source={EventImage}
          resizeMode="cover"
          style={{
            width: "100%",
            height: "100%",
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
    // position: "relative",
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
    // Your existing radio button styles here...
  },
  disabledButton: {
    opacity: 0.5, // Make button appear gray
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

  //------------------------------------------------------------
  overlay: {
    position: "absolute",
    marginLeft: 20,
    zIndex: 0,
  },
  loadingText: {},
  noDataText: {},
  headerContainer: {
    position: "relative",
    backgroundColor: "#5081FF",
    alignContent: "space-around",
    zIndex: -1,
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  textContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  textOverImage: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});
