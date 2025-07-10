import {
    StyleSheet,
    Text,
    View,
    Alert,
    ActivityIndicator,
    ScrollView,
    RefreshControl,
} from "react-native";
import React, {
    useLayoutEffect,
    useContext,
    useEffect,
    useState,
} from "react";
import { useNavigation } from "@react-navigation/native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { UserType } from "../context/UserContext.js";
import User from "../components/User.jsx";

const HomeScreen = () => {
    const navigation = useNavigation();
    const { setUserId } = useContext(UserType);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);



    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "",
            headerLeft: () => (
                <Text style={styles.headerTitle}>Chat with people</Text>
            ),
            headerRight: () => (
                <View style={styles.headerIcons}>
                    <Ionicons
                        onPress={() => navigation.navigate("Chats")}
                        name="chatbox-ellipses-outline"
                        size={24}
                        color="black"
                    />
                    <MaterialIcons
                        onPress={() => navigation.navigate("Friends")}
                        name="people-outline"
                        size={24}
                        color="black"
                    />
                </View>
            ),
        });
    },[]);



    const fetchUsers = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem("authToken");
            if (!token) {
                navigation.navigate("Login");
                return;
            }

            const decoded = jwtDecode(token);
            const userId = decoded.userId;
            setUserId(userId);

            const { data } = await axios.get(
                `http://10.0.2.2:8000/api/users/${userId}`
            );

            if (data.success) {
                setLoading(false);
                setUsers(data.userdata);
            }
        } catch (error) {
            console.error("Fetch users error:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    },[]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchUsers();
        setRefreshing(false);
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#4A55A2" />
                </View>
            ) : (
                <ScrollView
                    contentContainerStyle={styles.userList}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                >
                    {users?.length > 0 ? (
                        users?.map((user) => <User key={user._id} item={user} />)
                    ) : (
                        <View style={styles.notfound}>
                            <Text>No users found</Text>
                        </View>
                    )}

                </ScrollView>
            )}
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9f9f9",
    },
    userList: {
        padding: 10,
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    notfound: {
        alignItems: "center",
        marginTop: 20
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 10,
    },
    headerIcons: {
        flexDirection: "row",
        marginRight: 10,
        gap: 15,
    },
});
