import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Background from "../Background";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format } from "date-fns"; //https://www.npmjs.com/package/date-fns
import Ionicons from "@expo/vector-icons/Ionicons";
export default function ConfirmPage(): JSX.Element {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [uploading, setUploading] = useState<boolean>(false);

  const {
    eventName,
    startDateTime,
    endDateTime,
    location,
    description,
    privacy,
    repeatEvent,
    imageUri,
    userId,
  } = params;

  const formatDateDisplay = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "yyyy-MM-dd HH:mm:ss"); //format the DateTime from the CreateEvent.tsx back to DateTime from String(toISOString)
  };

  const handleSubmit = async () => {
    setUploading(true);

    //create FormData and change everything back to string
    let formData = new FormData();
    formData.append("event_name", eventName as string);
    formData.append("user", userId as string);
    formData.append("start_time", formatDateDisplay(startDateTime as string));
    formData.append("end_time", formatDateDisplay(endDateTime as string));
    formData.append("location", location as string);
    formData.append("description", description as string);
    formData.append("privacy", privacy as string);
    formData.append("repeat_event", repeatEvent as string);

    if (imageUri) {
      //extract filename and type
      const uriParts = (imageUri as string).split("/");
      const fileName = uriParts[uriParts.length - 1];
      const fileTypeMatch = /\.[0-9a-z]+$/i.exec(fileName); //https://stackoverflow.com/questions/6582171/javascript-regex-for-matching-extracting-file-extension
      const fileType = fileTypeMatch
        ? `image/${fileTypeMatch[0].substring(1).toLowerCase()}`
        : `image`;

      formData.append("photo", {
        uri: imageUri as string,
        name: fileName,
        type: fileType,
      } as any);
    }

    try {
      const response = await fetch(
        "https://deco3801-foundjesse.uqcloud.net/restapi/upload_event_photo.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        }
      );

      if (response.status === 201) {
        Alert.alert("Success", "Event created successfully!");
        router.push("./Events"); //navigate back to Events
      } else {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        Alert.alert("Error", errorData.message || "Failed to create event.");
      }
    } catch (error) {
      console.error("Network Error:", error);
      Alert.alert("Error", "An error occurred while creating the event.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
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
            <Ionicons name="arrow-back-outline" size={24} color="white" />
            <Text style={styles.backText}>Confirm Event</Text>
          </Pressable>
          <Image
            style={{
              width: 400,
              height: 70,
              resizeMode: "contain",
              marginTop: 50,
            }}
            source={require("@/assets/images/progress_confirm.png")}
          />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {/* Display Event Details */}
          <Text style={styles.label}>Event Name:</Text>
          <Text style={styles.value}>{eventName}</Text>

          <Text style={styles.label}>Start Time:</Text>
          <Text style={styles.value}>
            {formatDateDisplay(startDateTime as string)}
          </Text>

          <Text style={styles.label}>End Time:</Text>
          <Text style={styles.value}>
            {formatDateDisplay(endDateTime as string)}
          </Text>

          <Text style={styles.label}>Location:</Text>
          <Text style={styles.value}>{location}</Text>

          <Text style={styles.label}>Description:</Text>
          <Text style={styles.value}>{description}</Text>

          <Text style={styles.label}>Privacy:</Text>
          <Text style={styles.value}>{privacy}</Text>

          <Text style={styles.label}>Repeat Event:</Text>
          <Text style={styles.value}>{repeatEvent}</Text>

          {imageUri && (
            <>
              <Text style={styles.label}>Event Image:</Text>
              <Image
                source={{ uri: imageUri as string }}
                style={styles.image}
              />
            </>
          )}

          {/* Submit Button */}
          <Pressable
            style={[styles.submitButton, uploading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={uploading}
          >
            <Text style={styles.submitButtonText}>
              {uploading ? "Submitting..." : "Submit Event"}
            </Text>
          </Pressable>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
  },
  headerWrapper: {
    marginTop: 20,
    marginBottom: 10,
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  backText: {
    color: "#EFF3FF",
    fontWeight: "bold",
    fontSize: 25,
    marginLeft: 10,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: "center",
    marginTop: 30,
  },
  label: {
    alignSelf: "flex-start",
    marginBottom: 5,
    fontWeight: "bold",
    fontSize: 16,
    width: "100%",
  },
  value: {
    alignSelf: "flex-start",
    marginBottom: 15,
    fontSize: 16,
    width: "100%",
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 10,
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: "#5081FF",
    padding: 15,
    borderRadius: 5,
    marginTop: 40,
    width: "100%",
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#A0C1FF",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 18,
  },
});
