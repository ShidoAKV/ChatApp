import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginScreen from "./screens/LoginScreen.jsx";
import RegisterScreen from "./screens/RegisterScreen.jsx";
import HomeScreen from "./screens/HomeScreen.jsx";
import FriendScreen from "./screens/FriendScreen.jsx";
import ChatsScreen from "./screens/ChatsScreen.jsx";
import ChatMessagesScreen from "./screens/ChatMessagesScreen.jsx";
import Logout from "./screens/Logout.jsx";

import { UserContext } from "./context/UserContext.js";

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem('authToken');
      setToken(storedToken);
      setLoading(false);
    };
    fetchToken();
  }, []);

  if (loading) return null; // Or return a loading spinner

  return (
    <UserContext>
      <NavigationContainer>
        <Stack.Navigator>
          {token ? (
            <>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Friends" component={FriendScreen} />
              <Stack.Screen name="Chats" component={ChatsScreen} />
              <Stack.Screen name="Messages" component={ChatMessagesScreen} />
              <Stack.Screen name="logout" component={Logout} options={{ animation: 'slide_from_right' }} />
            </>
          ) : (
            <>
              <Stack.Screen name="Login" component={LoginScreen} options={{ headerBackVisible: false }} />
              <Stack.Screen name="Register" component={RegisterScreen} options={{ headerBackVisible: false }} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </UserContext>
  );
};

export default StackNavigator;
