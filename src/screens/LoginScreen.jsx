import {
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  Alert,
  StatusBar
} from "react-native";
import axios from 'axios';
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();


  const handleLogin = async() => {
      try { 
        if(!email||!password){
          Alert.alert('Enter the credentials')
        }
       
        const {data}=await axios.post("http://10.0.2.2:8000/api/login",{email,password});
        if(data.success){
          const token=data.token;
          await AsyncStorage.setItem('authToken',token);
          setEmail('');
          setPassword('');
          navigation.replace('Home');
        }else{
          Alert.alert(data.message);
        }
      } catch (error) {
         console.log(error);
      }
   
  };

  // useEffect(() => {
  //   const checkToken = async () => {
  //     try {
  //       const token = await AsyncStorage.getItem("authToken");
  //       if (token) {
  //         navigation.navigate("Home");
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   checkToken();
  // },[]);

  

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#4A55A2" barStyle="light-content" />
      <KeyboardAvoidingView
        style={styles.board}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.heading}>Welcome Back 👋</Text>
          <Text style={styles.subheading}>Login to your account</Text>

          <View style={styles.card}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={[styles.label, { marginTop: 20 }]}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <Pressable style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </Pressable>

            <Pressable onPress={() => navigation.navigate("Register")}>
              <Text style={styles.registerText}>
                Don't have an account? <Text style={{ color: "#4A55A2" }}>Sign Up</Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 25,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#4A55A2",
  },
  subheading: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    marginBottom: 30,
    marginTop: 5,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 25,
    elevation: 4, // Android shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  label: {
    fontSize: 16,
    color: "#444",
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#000",
  },
  button: {
    marginTop: 30,
    backgroundColor: "#4A55A2",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  registerText: {
    marginTop: 20,
    fontSize: 14,
    textAlign: "center",
    color: "#666",
  },
  board:{
    flex:1
  }
});
