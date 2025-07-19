import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Logout = ({ navigation }) => {
  const [token, setToken] = useState('');

  
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('authToken');
        if (storedToken) {
          setToken(storedToken);
          console.log('Current Auth Token:', storedToken); // Optional: for debugging
        }
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };

    fetchToken();
  }, []);

  
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('authToken'); 
      Alert.alert("Logged out", "You have been successfully logged out.");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error logging out:", error);
      Alert.alert("Logout Failed", "An error occurred during logout.");
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: 'https://cdn-icons-png.flaticon.com/512/847/847969.png',
        }}
        style={styles.icon}
      />
      <Text style={styles.title}>Logout</Text>
      <Text style={styles.subtitle}>Are you sure you want to log out?</Text>

      {/* Display token (optional, for debugging) */}
      {token ? (
        <Text style={styles.tokenPreview}>Token: {token.slice(0, 10)}...</Text>
      ) : (
        <Text style={styles.tokenPreview}>No token found</Text>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Yes, Logout</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Logout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 90,
    height: 90,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  tokenPreview: {
    fontSize: 14,
    color: '#999',
    marginBottom: 20,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#E53935',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 16,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 40,
  },
  cancelText: {
    fontSize: 16,
    color: '#333',
  },
});
