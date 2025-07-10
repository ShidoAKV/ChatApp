import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  Pressable,
  Alert,
  ScrollView,
  StatusBar,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const navigation = useNavigation();

  const handleRegister = async() => {
    try {
      const user = { name, email, password, image };
       
      const {data}=await axios.post("http://10.0.2.2:8000/api/register",user);

      
      if(data.success){
        Alert.alert(data.message);
        setEmail('');
        setImage('');
        setPassword('');
        setName('');
        navigation.navigate('Home');
      }
      
    } catch (error) {
        Alert.alert(error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#4A55A2" barStyle="light-content" />
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.heading}>Create Account 📝</Text>
          <Text style={styles.subheading}>Register to get started</Text>

          <View style={styles.card}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
            />

            <Text style={[styles.label, styles.marginTop20]}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />

            <Text style={[styles.label, styles.marginTop20]}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <Text style={[styles.label, styles.marginTop20]}>Image URL</Text>
            <TextInput
              style={styles.input}
              placeholder="Profile image URL"
              placeholderTextColor="#999"
              value={image}
              onChangeText={setImage}
            />

            <Pressable style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Register</Text>
            </Pressable>

            <Pressable onPress={() => navigation.goBack()} style={styles.goBack}>
              <Text style={styles.loginText}>
                Already have an account? <Text style={styles.textcolor}>Sign In</Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default RegisterScreen;

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
  textcolor:{
    color: "#4A55A2" 
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
    marginTop: 8,
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
  loginText: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
  },
  keyboardContainer: {
  flex: 1,
},
goBack: {
  marginTop: 20,
},
marginTop20: {
  marginTop: 20,
},

});
