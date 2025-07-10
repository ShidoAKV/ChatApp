import { Text, Pressable, Image, StyleSheet } from "react-native";
import React, { useContext } from "react";
import { UserType } from "../context/UserContext.js";
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';

const FriendRequest = ({ item, friendRequests, setFriendRequests }) => {
  const { userId } = useContext(UserType);
  const navigation = useNavigation();

  const acceptRequest = async (friendRequestId) => {
    try {
      const { data } = await axios.post(
        "http://10.0.2.2:8000/api/friend-request/accept",
        {
          senderId: friendRequestId,
          recepientId: userId,
        }
      );
      if (data.success) {
        setFriendRequests(
          friendRequests?.filter((request) => request._id !== friendRequestId)
        );
        navigation.navigate("Chats");
      }
    } catch (err) {
      console.log("Error accepting the friend request", err);
    }
  };

  return (
    <Pressable style={styles.container}>
      <Image
        style={styles.avatar}
        source={{ uri: item.image || "https://via.placeholder.com/50" }}
      />
      <Text style={styles.message}>
        {item?.name} sent you a friend request!!
      </Text>
      <Pressable
        onPress={() => acceptRequest(item._id)}
        style={styles.acceptButton}
      >
        <Text style={styles.acceptText}>Accept</Text>
      </Pressable>
    </Pressable>
  );
};

export default FriendRequest;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  message: {
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 10,
    flex: 1,
    color: "#333",
  },
  acceptButton: {
    backgroundColor: "#0066b2",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  acceptText: {
    color: "white",
    fontWeight: "500",
    fontSize: 14,
  },
});
