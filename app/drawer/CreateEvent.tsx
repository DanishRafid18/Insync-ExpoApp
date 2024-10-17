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
import { Dropdown } from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CreateEvent(): JSX.Element {
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

  const resetForm = () => {
    setEventName('');
    setStartDateTime(new Date());
    setEndDateTime(new Date());
    setLocation('');
    setDescription('');
    setPrivacy('Not Private');
    setRepeatEvent('No Repeat');
  };

  const handleNext = () => {
    if (!userId) {
      Alert.alert('Error', 'User ID not found. Please log in again.');
      return;
    }

    //validate required fields
    if (!eventName || !location) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    //pass form data to ImagePickerPage
    router.push({
      pathname: './StoryPicker',
      params: {
        eventName,
        startDateTime: startDateTime.toISOString(), //https://www.w3schools.com/jsref/jsref_toisostring.asp toISOString() is a way to change DateTime to String
        endDateTime: endDateTime.toISOString(),
        location,
        description,
        privacy,
        repeatEvent,
        userId,
      },
    });
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
      <Image
          style = {{width: 400, height: 70, resizeMode: 'contain', marginTop: 50}}
          source={require('@/assets/images/progress_detail.png')}
        />
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

            {/* Next Button */}
            <Pressable style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>Next</Text>
            </Pressable>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    marginTop: 50,
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
  nextButton: {
    backgroundColor: '#5081FF',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

