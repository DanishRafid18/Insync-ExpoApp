import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  Image,
  Pressable,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import Background from '../Background';
import { useFocusEffect } from '@react-navigation/native';


interface EventData {
  event_id: number;
  event_name: string;
  start_time: string;
  end_time: string;
  location: string | null;
  description: string;
  privacy: string;
  story: string | null;
  repeat_event: string;
}

export default function Events(): JSX.Element {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const colorScheme = useColorScheme();
  const router = useRouter();
  const TextColor = colorScheme === 'dark' ? '#000000' : '#000000';

  const fetchEventData = async () => {
    try {
      const response = await fetch(
        'https://deco3801-foundjesse.uqcloud.net/restapi/event.php?user=1'
      );
      if (!response.ok) {
        console.error('HTTP error:', response.status);
        return;
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        //get current date and time
        const now = new Date();

        //filter out past events
        const upcomingEvents = data.filter((event: EventData) => {
          const eventEndTime = new Date(event.end_time);
          return eventEndTime >= now;
        });
        console.log('Fetched events:', upcomingEvents);
        setEvents(upcomingEvents);
      } else {
        console.error('Invalid data format:', data);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetchEventData();
    }, [])
  );

  const handleDelete = async (eventId: number) => {
    //confirm deletion
    Alert.alert(
      "Delete Event",
      "Are you sure you want to delete this event?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteEvent(eventId),
        },
      ],
      { cancelable: true }
    );
  };
  

  const deleteEvent = async (eventId: number) => {
    try {
      const response = await fetch(`https://deco3801-foundjesse.uqcloud.net/restapi/event.php`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ event_id: eventId }),
      });
  
      if (response.ok) {
        Alert.alert("Success", "Event deleted successfully!");
        // Remove the deleted event from the state
        setEvents((prevEvents) => prevEvents.filter((event) => event.event_id !== eventId));
      } else {
        const errorData = await response.json();
        console.error('Delete error:', errorData);
        Alert.alert("Error", errorData.message || "Failed to delete the event.");
      }
    } catch (error) {
      console.error('Network error:', error);
      Alert.alert("Error", "An error occurred while deleting the event.");
    }
  };

  return (
    <View  style={styles.container }>
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
          <Text style={styles.backText}>Events</Text>
        </Pressable>
        
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : events.length > 0 ? (
          events.map((event, event_id) => (
            <Pressable
              key={event_id}
              style={[
                styles.EventContainer,
                {
                  height: 150,
                  width: '80%',
                  borderRadius: 10,
                  overflow: 'hidden',
                  marginTop: 20,
                  alignSelf: 'center',
                },
              ]}
            >
              <View style={styles.textContainer}>
                <Text style={[styles.eventName, { color: TextColor }]}>
                  {event.event_name}
                </Text>
                <Text style={[styles.eventDetails, { color: TextColor }]}>
                  Start: {event.start_time}
                </Text>
                <Text style={[styles.eventDetails, { color: TextColor }]}>
                  End: {event.end_time}
                </Text>
                <Text style={[styles.eventDetails, { color: TextColor }]}>
                  {event.location}
                </Text>
                <Text style={[styles.eventDetails, { color: TextColor }]}>
                  {event.description}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(event.event_id)}
              >
                <Image
                  style={styles.deleteButton}
                  source={require('@/assets/images/deleteIcon.png')}
                />
              </TouchableOpacity>
            </Pressable>
          ))
        ) : (
          <Text style={styles.noDataText}>No events found.</Text>
        )}
      </ScrollView>
      <TouchableOpacity
      onPress={() => {
        router.push("/drawer/CreateEvent");
      }}
       style={styles.addButton}>
      <Image
        source={require('@/assets/images/add_icon.png')}
      />

    </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
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
  headerWrapper: {
    position: 'static',
    zIndex: 1,
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
  deleteButton: {
    width: 40,
    height: 30,
    resizeMode: 'contain',
    alignSelf: 'flex-end',
    marginRight: 5
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 20,
    marginTop: 20,
    zIndex:1,
    height: "500%"
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
