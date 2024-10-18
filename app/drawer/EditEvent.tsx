import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  useColorScheme,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback, 
  Keyboard,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Background from '../Background';
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { ImagePickerAsset } from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { Dropdown } from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditEvent = () => {
    //most of these const are from CreateEvent.tsx
    const router = useRouter();
    const colorScheme = useColorScheme();
    const TextFieldColor = colorScheme === 'dark' ? '#2c2c2c' : '#FFFFFF';
    const TextColor = colorScheme === 'dark' ? '#dce1e8' : '#B3B9C2';
    
    const [eventName, setEventName] = useState<string>('');
    const [startDateTime, setStartDateTime] = useState<Date>(new Date());
    const [endDateTime, setEndDateTime] = useState<Date>(new Date());
    const [location, setLocation] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [privacy, setPrivacy] = useState<string>('Not Private');
    const [repeatEvent, setRepeatEvent] = useState<string>('No Repeat');
    const [image, setImage] = useState<ImagePickerAsset | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);
    const [userId, setUserId] = useState<string | null>(null);
    
    const { event_id } = useLocalSearchParams();

    
    useEffect(() => {
      const getUserId = async () => {
        try {
          const id = await AsyncStorage.getItem('user_id');
          if (id !== null) {
            setUserId(id);
          } else {
            console.error('No user_id found in AsyncStorage');
            Alert.alert('Error', 'User ID not found. Please log in again.');
            router.back();
          }
        } catch (error) {
          console.error('Error retrieving user_id:', error);
          Alert.alert('Error', 'An error occurred while retrieving user information.');
          router.back();
        }
      };
  
      getUserId();
    }, []);
    
    const privacyOptions = [
      { label: 'Private', value: 'Private' },
      { label: 'Not Private', value: 'Not Private' },
    ];
  
    const repeatOptions = [
      { label: 'No Repeat', value: 'No Repeat' },
      { label: 'Daily', value: 'Daily' },
      { label: 'Weekly', value: 'Weekly' },
      { label: 'Monthly', value: 'Monthly' },
      { label: 'Yearly', value: 'Yearly' },
    ];
  
    const formatDate = (date: Date): string => {
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2);
      const day = ('0' + date.getDate()).slice(-2);
      const hours = ('0' + date.getHours()).slice(-2);
      const minutes = ('0' + date.getMinutes()).slice(-2);
      const seconds = ('0' + date.getSeconds()).slice(-2);
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };
  
    //handle Submit Function Updated to Use JSON and PUT
    const handleSubmit = async () => {
      if (!userId) {
        Alert.alert('Error', 'User ID not found. Please log in again.');
        return;
      }
      if (!event_id) {
        Alert.alert('Error', 'Event ID not provided.');
        return;
      }
      setUploading(true);
  
      const body = {
        event_id: event_id, //include event_id for the PUT request
        event_name: eventName,
        start_time: formatDate(startDateTime),
        end_time: formatDate(endDateTime),
        location: location,
        description: description,
        privacy: privacy,
        repeat_event: repeatEvent,
      };
  
      try {
        const response = await fetch(
          'https://deco3801-foundjesse.uqcloud.net/restapi/event.php',
          {
            method: 'PUT', //change to PUT from post in CreateEvent.tsx
            headers: {
              'Content-Type': 'application/json', //use JSON header instead of form-data
            },
            body: JSON.stringify(body),
            
          }
          
        );
        console.log(body)
        if (response.ok) {
          Alert.alert('Success', 'Event updated successfully!');
          router.back();
        } else {
          const errorData = await response.json();
          console.error('Error response:', errorData);
          Alert.alert('Error', errorData.message || 'Failed to update event.');
        }
      } catch (error) {
        console.error('Network Error:', error);
        Alert.alert('Error', 'An error occurred while updating the event.');
      } finally {
        setUploading(false);
      }
    };
  
    const resetForm = () => {
      setEventName('');
      setStartDateTime(new Date());
      setEndDateTime(new Date());
      setLocation('');
      setDescription('');
      setPrivacy('Not Private');
      setRepeatEvent('No Repeat');
      setImage(null);
    };
    const submitThenResetForm = () => {
        handleSubmit();
        resetForm();
    }  
  return (
    
    <><Background /><KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingView}
    >
      {/* Header */}
      <View style={styles.headerWrapper}>
      <Pressable
        onPress={() => {
          resetForm();
          router.push("/drawer/Events");
        }}
        style={styles.backButton}
      >
<Ionicons name="arrow-back-outline" size={24} color="white" />
        <Text style={styles.backText}>Edit Event</Text>
      </Pressable>
    </View>
      <TouchableWithoutFeedback>
        <ScrollView contentContainerStyle={styles.form}>

          {/* Event Name */}
          <Text style={styles.formText}>Event Name:</Text>
          <TextInput
            style={[
              styles.inputField,
              {
                backgroundColor: TextFieldColor,
                color: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
              },
            ]}
            placeholder='Event Name'
            placeholderTextColor={TextColor}
            value={eventName}
            onChangeText={setEventName} />

          {/* Start Time */}
          <Text style={styles.formText}>Start Time:</Text>
          <DateTimePicker
            value={startDateTime}
            mode='datetime'
            display='default'
            onChange={(event, selectedDate) => {
              if (selectedDate) {
                setStartDateTime(selectedDate);
              }
            } } />

          {/* End Time */}
          <Text style={styles.formText}>End Time:</Text>
          <DateTimePicker
            value={endDateTime}
            mode='datetime'
            display='default'
            onChange={(event, selectedDate) => {
              if (selectedDate) {
                setEndDateTime(selectedDate);
              }
            } } />

          {/* Location */}
          <Text style={styles.formText}>Location:</Text>
          <TextInput
            style={[
              styles.inputField,
              {
                backgroundColor: TextFieldColor,
                color: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
              },
            ]}
            placeholder='Location'
            placeholderTextColor={TextColor}
            value={location}
            onChangeText={setLocation} />

          {/* Description */}
          <Text style={styles.formText}>Description:</Text>
          <TextInput
            style={[
              styles.inputField,
              styles.textArea,
              {
                backgroundColor: TextFieldColor,
                color: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
              },
            ]}
            placeholder='Description'
            placeholderTextColor={TextColor}
            multiline={true}
            numberOfLines={4}
            value={description}
            onChangeText={setDescription} />

          {/* Privacy and Repeat Event Dropdowns Side by Side */}
          <View style={styles.rowContainer}>
            {/* Privacy Dropdown */}
            <View style={styles.dropdownWrapper}>
              <Text style={styles.dropdownLabel}>Privacy:</Text>
              <Dropdown
                style={styles.dropdown}
                data={privacyOptions}
                labelField="label"
                valueField="value"
                placeholder="Select Privacy"
                dropdownPosition='top'
                value={privacy}
                onChange={(item) => {
                  setPrivacy(item.value);
                } }
                selectedTextStyle={{ color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' }}
                containerStyle={{ backgroundColor: TextFieldColor }}
                placeholderStyle={{ color: TextColor }} />
            </View>

            {/* Repeat Event Dropdown */}
            <View style={styles.dropdownWrapper}>
              <Text style={styles.dropdownLabel}>Repeat Event:</Text>
              <Dropdown
                style={styles.dropdown}
                data={repeatOptions}
                labelField="label"
                valueField="value"
                placeholder="Select Repeat"
                dropdownPosition='top'
                value={repeatEvent}
                onChange={(item) => {
                  setRepeatEvent(item.value);
                } }
                selectedTextStyle={{ color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' }}
                containerStyle={{ backgroundColor: TextFieldColor }}
                placeholderStyle={{ color: TextColor }} />
            </View>
          </View>

          {/* Image Picker */}
          <Text style={styles.formText}>Event Image:</Text>
          {image && (
            <Image
              source={{ uri: image.uri }}
              style={styles.selectedImage} />
          )}

          {/* Submit Button */}
          <Pressable
            style={[styles.submitButton, uploading && styles.buttonDisabled]}
            onPress={submitThenResetForm}
            disabled={uploading}
          >
            <Text style={styles.submitButtonText}>
              {uploading ? 'Uploading...' : 'Edit Event'}
            </Text>
          </Pressable>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView></>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    marginTop: 50
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
  form: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
    marginTop: 30
  },
  formText: {
    alignSelf: 'flex-start',
    marginBottom: 5,
    marginTop: 15,
    fontWeight: 'bold',
    fontSize: 16,
    width: '100%',
  },
  inputField: {
    borderWidth: 1, 
    borderColor: '#5081FF', 
    borderRadius: 5, 
    height: 50,
    padding: 10,
    marginBottom: 20,
    width: '100%',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  dropdownWrapper: {
    flex: 1,
    marginRight: 10,
  },
  dropdownLabel: {
    marginBottom: 5,
    fontWeight: 'bold',
    fontSize: 16,
  },
  dropdown: {
    height: 50,
    borderColor: '#5081FF',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
  },
  imagePickerButton: {
    backgroundColor: '#5081FF',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  imagePickerText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  selectedImage: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: '#5081FF',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#A0C1FF',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default EditEvent;
