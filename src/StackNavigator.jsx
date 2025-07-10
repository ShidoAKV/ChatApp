import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen.jsx";
import RegisterScreen from "./screens/RegisterScreen.jsx";
import HomeScreen from "./screens/HomeScreen.jsx";
import { UserContext } from "./context/UserContext.js";
import FriendScreen from "./screens/FriendScreen.jsx";
import ChatsScreen from "./screens/ChatsScreen.jsx";
import ChatMessagesScreen from "./screens/ChatMessagesScreen.jsx";

const StackNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <UserContext>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen}  />
          <Stack.Screen name="Register" component={RegisterScreen}  />
          <Stack.Screen name="Home" component={HomeScreen}  />
          <Stack.Screen name="Friends" component={FriendScreen}  />
          <Stack.Screen name="Chats" component={ChatsScreen}  />
          <Stack.Screen name="Messages" component={ChatMessagesScreen}  />
        </Stack.Navigator>
      </NavigationContainer>
    </UserContext>
  );
};

export default StackNavigator;
