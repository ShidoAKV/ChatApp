import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { UserType } from "../context/UserContext.js";
import axios from 'axios';

const UserChat = ({ item }) => {
  const { userId } = useContext(UserType);
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();

  const fetchMessages = async () => {
    try {
      const { data } = await axios.get(
        `http://10.0.2.2:8000/api/messages/${userId}/${item._id}`
      );
      if (data.success) {
        setMessages(data?.data);
      } else {
        console.log("Error showing messages:", data.message);
      }
    } catch (error) {
      console.log("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  },[]);

  const getLastMessage = () => {
    const userMessages = messages.filter(
      (message) => message?.messageType === "text"
    );
    return userMessages[userMessages.length - 1];
  };

  const lastMessage = getLastMessage();

  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", options);
  };

  return (
    <Pressable
      onPress={() =>
        navigation.navigate("Messages", { recepientId: item._id })
      }
      style={styles.container}
    >
      <Image
        style={styles.userImage}
        source={{ uri: item?.image || "https://via.placeholder.com/50" }}
      />

      <View style={styles.content}>
        <Text style={styles.userName}>{item?.name}</Text>
        {lastMessage && (
          <Text style={styles.lastMessage}>{lastMessage?.message}</Text>
        )}
      </View>

      <View>
        <Text style={styles.time}>
          {lastMessage && formatTime(lastMessage?.timeStamp)}
        </Text>
      </View>
    </Pressable>
  );
};

export default UserChat;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 0.7,
    borderColor: "#D0D0D0",
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    padding: 10,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    resizeMode: "cover",
  },
  content: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: "500",
  },
  lastMessage: {
    marginTop: 3,
    color: "gray",
    fontWeight: "500",
  },
  time: {
    fontSize: 11,
    fontWeight: "400",
    color: "#585858",
  },
});
