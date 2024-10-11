import React, { useState } from 'react';
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
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import Background from '../Background';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { ImagePickerAsset } from 'expo-image-picker';


const CreateEvent = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const TextFieldColor = colorScheme === 'dark' ? '#2c2c2c' : '#FFFFFF';
  const TextColor = colorScheme === 'dark' ? '#dce1e8' : '#B3B9C2';

  const [eventName, setEventName] = useState('');
  const [startDateTime, setStartDateTime] = useState(new Date());
  const [endDateTime, setEndDateTime] = useState(new Date());
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<ImagePickerAsset | null>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0]);
    }
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear(); //getting the whole year. e.g. "2024"
    const month = ('0'+(date.getMonth()+1)).slice(-2); //for some reason january is 0 so 1 is added to the value. Slice(-2) ensures the month is always two digits
    const day = ('0'+date.getDate()).slice(-2); //same for the rest
    const hours = ('0'+date.getHours()).slice(-2);
    const minutes = ('0'+date.getMinutes()).slice(-2);
    const seconds = ('0'+date.getSeconds()).slice(-2);
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleSubmit = async () => {
    const body = {
      event_name: eventName,
      user: 1,
      start_time: formatDate(startDateTime),
      end_time: formatDate(endDateTime),
      location: location,
      description: description,
      privacy: 'Not Private',
      story: image ? image.base64 : null,

    };

    try {
      const response = await fetch('https://deco3801-foundjesse.uqcloud.net/restapi/event.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        console.error('Invalid data format:', body);
        Alert.alert('Failed to create event');
        return;
      }

      const data = await response.json();
      console.log('Event created successfully:', data);

      Alert.alert('Event created successfully');

      router.back();
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('An error occurred');
    }
  };

  return (
    
    //KeyboardAvoidingView not working
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}  style={styles.keyboardAvoidingView} >
      <Background/>
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
            <Text style={styles.backText}>Create Event</Text>
          </Pressable>
        </View>
        
      
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.form}>
          {/* Event Name Form */}
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
            onChangeText={(text) => setEventName(text)}
          />

          {/* Start Time Picker */}
          <Text style={styles.formText}>Start Time:</Text>
            <DateTimePicker
              value={startDateTime}
              mode='datetime'
              display='default'
              onChange={(event, selectedDate) => {
                if (selectedDate) {
                  setStartDateTime(selectedDate);
                }
              }}
            />

          {/* End Time Picker */}
          <Text style={styles.formText}>End Time:</Text>
            <DateTimePicker
              value={endDateTime}
              mode='datetime'
              display='default'
              onChange={(event, selectedDate) => {
                if (selectedDate) {
                  setEndDateTime(selectedDate);
                }
              }}
            />

          {/* Location Form */}
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
            onChangeText={(text) => setLocation(text)}
          />

          {/* Description Form */}
          <Text style={styles.formText}>Description:</Text>
          <TextInput
            style={[
              styles.inputField,
              {
                backgroundColor: TextFieldColor,
                color: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
                height: 150,
              },
            ]}
            placeholder='Description'
            placeholderTextColor={TextColor}
            multiline={true}
            value={description}
            onChangeText={(text) => setDescription(text)}
          />

          <Text style={styles.formText}>Event Image:</Text>
                <Pressable onPress={pickImage} style={styles.imagePickerButton}>
                  <Text style={styles.imagePickerText}>Pick an image</Text>
                </Pressable>
                {image && (
                  <Image
                    source={{ uri: image.uri }}
                    style={{ width: 50, height: 50, marginTop: 10 }}
                  />
                )}

          <Pressable style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </Pressable>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "500%"
  },
  keyboardAvoidingView:{
    flex: 1,
    height: "500%"
  },
  imagePickerButton: {
    backgroundColor: '#5081FF',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '75%',
    alignItems: 'center',
  },
  imagePickerText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  formText:{
    alignSelf:"center",
    marginBottom: 10,
    width:"75%",
  },
  form:{
    flex: 1,
    alignItems:"center",
    marginTop: 20,
    justifyContent: 'space-between',
    height: "1000%"
  },
  inputField:{
    borderWidth: 1, 
    borderColor:"#5081FF", 
    borderRadius:5, 
    height: 50,
    padding: 10,
    marginBottom: 20,
    width: "75%",
    alignSelf: "center"
  },
  headerWrapper: {
    position: 'static',
    zIndex: 1,
    marginTop: 50
  },
  submitButton: {
    backgroundColor: '#5081FF',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    width: '75%',
    alignItems: 'center',
    marginBottom:100
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  backButton: {
    flexDirection: 'row',
    marginLeft: 20,
    marginTop: 40,
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
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 20,
    marginTop: 20,
    zIndex:1
  },
  EventContainer: {
    backgroundColor: '#FFFFFF',
    alignContent: 'space-around',
    zIndex: 1,
  },
  textContainer: {
    padding: 10,
  },
  eventName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  eventDetails: {
    fontSize: 14,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
  },
  noDataText: {
    marginTop: 20,
    fontSize: 18,
  },
});
export default CreateEvent;
