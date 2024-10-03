import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  useColorScheme,
  Image,
  Pressable,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import Background from '../Background';

interface EventData {
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
  const TextColor = colorScheme === 'dark' ? '#FFFFFF' : '#000000';

  useEffect(() => {
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
        console.log('Fetched events:', data);
        if (Array.isArray(data)) {
          setEvents(data);
        } else {
          console.error('Invalid data format:', data);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, []);

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
          <Text style={styles.backText}>Back</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : events.length > 0 ? (
          events.map((event, index) => (
            <Pressable
              key={index}
              // onPress={() => {
              //   console.log(`Event pressed: ${event.event_name}`);
              // }}
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
              </View>
            </Pressable>
          ))
        ) : (
          <Text style={styles.noDataText}>No events found.</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
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
