import {ScrollView, Pressable} from "react-native";
import React, { useContext,useEffect,useState } from "react";
import { UserType } from "../context/UserContext.js";
import UserChat from "../components/UserChat.jsx";
import axios from 'axios';

const ChatsScreen = () => {
  const [acceptedFriends, setAcceptedFriends] = useState([]);
  const { userId } = useContext(UserType);
 
  useEffect(() => {
    const acceptedFriendsList = async () => {
      try {
        const {data} = await axios.get(`http://10.0.2.2:8000/api/accepted-friends/${userId}`);
     
        if (data.success) {
          setAcceptedFriends(data?.data);
        }
      } catch (error) {
        console.log("error showing the accepted friends", error);
      }
    };

    acceptedFriendsList();
  },[]);
  
 
 
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Pressable>
          {acceptedFriends?.map((item,index) => (
              <UserChat key={index} item={item}/>
          ))}
      </Pressable>
    </ScrollView>
  );
};

export default ChatsScreen;
