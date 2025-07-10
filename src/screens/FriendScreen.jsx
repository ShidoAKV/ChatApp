import { Text, View ,StyleSheet} from "react-native";
import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { UserType } from "../context/UserContext.js";
import FriendRequest from "../components/FriendRequest.jsx";

const FriendScreen = () => {
  const { userId } = useContext(UserType);
  const [friendRequests, setFriendRequests] = useState([]);


 const fetchFriendRequests = async () => {
    try {
      const {data} = await axios.get(
        `http://10.0.2.2:8000/api/friend-request/${userId}`
      );
      if (data.success) {
         
        const friendRequestsData =data?.user?.friendRequests?.map((friendRequest) => ({
          _id: friendRequest._id,
          name: friendRequest.name,
          email: friendRequest.email,
          image: friendRequest.image,
        }));
     
        setFriendRequests(friendRequestsData);
      }
    } catch (err) {
      console.log("error message", err);
    }
  };

  useEffect(() => {
   if(userId){ 
    fetchFriendRequests();
  }
  },[]);

  
  


  return (
    <View style={styles.contianer}>
      {friendRequests&& <Text>Your Friend Requests!</Text>}

      {friendRequests?.map((item, index) => (
        <FriendRequest
          key={index}
          item={item}
          friendRequests={friendRequests}
          setFriendRequests={setFriendRequests}
        />
      ))}
    </View>
  );
};

export default FriendScreen;

const styles=StyleSheet.create(
{
  contianer:{
  padding: 10, 
  marginHorizontal: 12 
}
}
)