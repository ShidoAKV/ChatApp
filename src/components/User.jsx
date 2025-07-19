import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import React, { useContext, useState, useEffect } from "react";
import { UserType } from "../context/UserContext.js";
import axios from 'axios';

const User = ({ item }) => {
  const { userId } = useContext(UserType);
  const [requestSent, setRequestSent] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);
  const [userFriends, setUserFriends] = useState([]);



  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const { data } = await axios.get(`http://10.0.2.2:8000/api/friend-requests/sent/${userId}`);
        if (data.success) setFriendRequests(data.data);
        else console.log("Error", data.message);
      } catch (error) {
        console.log("Error fetching friend requests:", error);
      }
    };

    fetchFriendRequests();
  }, [userId]);

  useEffect(() => {
    const fetchUserFriends = async () => {
      try {
        const { data } = await axios.get(`http://10.0.2.2:8000/api/friends/${userId}`);
        if (data.success) setUserFriends(data.data);
        else console.log("Error retrieving user friends:", data.message);
      } catch (error) {
        console.log("Error fetching friends:", error);
      }
    };

    fetchUserFriends();
  }, [userId]);

  const sendFriendRequest = async (currentUserId, selectedUserId) => {
    try {
      const { data } = await axios.post("http://10.0.2.2:8000/api/friend-request", {
        currentUserId,
        selectedUserId,
      });
      if (data.success) {
        setRequestSent(true);
        socket.emit("friendRequestSent", { from: currentUserId, to: selectedUserId }); // Optional: socket emit
      }
    } catch (error) {
      console.log("Error sending friend request:", error);
    }
  };

  const isFriend = userFriends.includes(item._id);
  const isRequestSent = requestSent || friendRequests.some((friend) => friend._id === item._id);

  return (
    <Pressable style={styles.userContainer}>
      <Image
        style={styles.userImage}
        source={{ uri: item?.image || "https://via.placeholder.com/50" }}
      />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item?.name}</Text>
        <Text style={styles.userEmail}>{item?.email}</Text>
      </View>

      {isFriend ? (
        <Pressable style={[styles.button, styles.friendsButton]}>
          <Text style={styles.buttonText}>Friends</Text>
        </Pressable>
      ) : isRequestSent ? (
        <Pressable style={[styles.button, styles.sentButton]}>
          <Text style={styles.buttonText}>Request Sent</Text>
        </Pressable>
      ) : (
        <Pressable
          onPress={() => sendFriendRequest(userId, item?._id)}
          style={[styles.button, styles.addButton]}
        >
          <Text style={styles.buttonText}>Add Friend</Text>
        </Pressable>
      )}
    </Pressable>
  );
};

export default User;

const styles = StyleSheet.create({
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    borderWidth: 1,            
    borderColor: "#e5eaeeff",
    borderRadius:10,
    padding:10
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    resizeMode: "cover",
    borderWidth:1,
    borderColor:'#969191ff'
  },
  userInfo: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontWeight: "bold",
  },
  userEmail: {
    color: "#b5b0b0ff",
  },
  button: {
    padding: 10,
    borderRadius: 6,
    width: 105,
  },
  friendsButton: {
    backgroundColor: "#82CD47",
  },
  sentButton: {
    backgroundColor: "gray",
  },
  addButton: {
    backgroundColor: "#567189",
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontSize: 13,
  },
});
