import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Background from '../Background';

interface UserData {
  first_name: string;
  status: string;
}

export default function Homepage(): JSX.Element {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = 1;
        const response = await fetch(
          `https://deco3801-foundjesse.uqcloud.net/restapi/api.php?user_id=${userId}`
        );

        if (!response.ok) {
          console.error('HTTP error:', response.status);
          return;
        }

        const data = await response.json();
        console.log('Fetched data:', data);

        if (Array.isArray(data) && data.length > 0) {
          setUserData(data[0]);
        } else {
          console.error('Invalid data format:', data);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      <Background></Background>
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : userData ? (
        <View style={styles.overlay}>
          <Text style={styles.welcomeText}>Welcome, {userData.first_name}!</Text>
        </View>
      ) : (
        <Text style={styles.noDataText}>No user data found.</Text>
      )}
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
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',

    zIndex: 1,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 120,
    zIndex: 2
  },
  loadingText: {
  },
  noDataText: {
  },
});
