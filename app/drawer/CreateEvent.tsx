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
import { useRouter } from 'expo-router';
import Background from '../Background';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { ImagePickerAsset } from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { Dropdown } from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateEvent = () => {
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
  const [uploading, setUploading] = useState<boolean>(false); //for setting up the loading... button
  const [userId, setUserId] = useState<string | null>(null);

  //fetch userId from AsyncStorage
  useEffect(() => {
    const getUserId = async () => {
      try {
        const id = await AsyncStorage.getItem('user_id');
        if (id !== null) {
          setUserId(id);
        }
      } catch (error) {
        console.error('Error retrieving user_id:', error);
      }
    };

    getUserId();
  }, []);

  //function to pick an image
  const pickImage = async () => {
    //request permission to access media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Camera roll permissions are required to select an image.'
      );
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0]);
    }
  };

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

  //function to format Date object to 'Y-m-d H:i:s'
  const formatDate = (date: Date): string => {
    const year = date.getFullYear(); //getting the whole year. e.g. "2024"
    const month = ('0'+(date.getMonth()+1)).slice(-2); //for some reason january is 0 so 1 is added to the value. Slice(-2) ensures the month is always two digits
    const day = ('0'+date.getDate()).slice(-2); //same for the rest
    const hours = ('0'+date.getHours()).slice(-2);
    const minutes = ('0'+date.getMinutes()).slice(-2);
    const seconds = ('0'+date.getSeconds()).slice(-2);
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleSubmit = async () => {
    if (!userId) {
      Alert.alert('Error', 'User ID not found. Please log in again.');
      return;
    }
    setUploading(true);

    //i have to use FormData to upload a picture
    let formData = new FormData();
    formData.append('event_name', eventName);
    formData.append('user', userId);
    formData.append('start_time', formatDate(startDateTime));
    formData.append('end_time', formatDate(endDateTime));
    formData.append('location', location);
    formData.append('description', description);
    formData.append('privacy', privacy);
    formData.append('repeat_event', repeatEvent);

    if (image) {
      //extract filename and type
      const uriParts = image.uri.split('/');
      const fileName = uriParts[uriParts.length - 1];
      const fileTypeMatch = /\.(\w+)$/.exec(fileName); //get the file type
      const fileType = fileTypeMatch ? `image/${fileTypeMatch[1]}` : `image`; //check if its a valid file type

      formData.append('photo', {
        uri: image.uri,
        name: fileName,
        type: fileType,
      } as any);
    }

    try {
      const response = await fetch(
        'https://deco3801-foundjesse.uqcloud.net/restapi/upload_event_photo.php',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        }
      );

      if (response.status === 201) {
        Alert.alert('Success', 'Event created successfully!');
        router.back();//back after success
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        Alert.alert('Error', errorData.message || 'Failed to create event.');
      }
    } catch (error) {
      console.error('Network Error:', error);
      Alert.alert('Error', 'An error occurred while creating the event.');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => { //reset form when pressing back
    setEventName('');
    setStartDateTime(new Date());
    setEndDateTime(new Date());
    setLocation('');
    setDescription('');
    setPrivacy('Not Private');
    setRepeatEvent('No Repeat');
    setImage(null);
  };
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
        <Image
          style={styles.backIcon}
          source={require('@/assets/images/BackIcon.png')}
        />
        <Text style={styles.backText}>Create Event</Text>
      </Pressable>
    </View>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
          <Pressable onPress={pickImage} style={styles.imagePickerButton}>
            <Text style={styles.imagePickerText}>Pick an Image</Text>
          </Pressable>
          {image && (
            <Image
              source={{ uri: image.uri }}
              style={styles.selectedImage} />
          )}

          {/* Submit Button */}
          <Pressable
            style={[styles.submitButton, uploading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={uploading}
          >
            <Text style={styles.submitButtonText}>
              {uploading ? 'Uploading...' : 'Create Event'}
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

export default CreateEvent;
