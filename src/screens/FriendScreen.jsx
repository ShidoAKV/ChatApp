import { Text, View, StyleSheet, ScrollView } from "react-native";
import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { UserType } from "../context/UserContext.js";
import FriendRequest from "../components/FriendRequest.jsx";

const FriendScreen = () => {
  const { userId } = useContext(UserType);
  const [friendRequests, setFriendRequests] = useState([]);

  const fetchFriendRequests = async () => {
    try {
      const { data } = await axios.get(
        `http://10.0.2.2:8000/api/friend-request/${userId}`
      );
      if (data.success) {
        const friendRequestsData = data?.user?.friendRequests?.map(
          (friendRequest) => ({
            _id: friendRequest._id,
            name: friendRequest.name,
            email: friendRequest.email,
            image: friendRequest.image,
          })
        );
        setFriendRequests(friendRequestsData);
      }
    } catch (err) {
      console.log("error message", err);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchFriendRequests();
    }
  }, []);

  return (
    <ScrollView style={styles.container}>
      {friendRequests.length > 0 && (
        <Text style={styles.heading}>Your Friend Requests</Text>
      )}
       {friendRequests.length===0 && (
        <Text style={styles.heading}>No Friend Requests!</Text>
      )}

      {friendRequests.map((item, index) => (
        <FriendRequest
          key={index}
          item={item}
          friendRequests={friendRequests}
          setFriendRequests={setFriendRequests}
        />
      ))}
    </ScrollView>
  );
};

export default FriendScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090808ff',
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
});
