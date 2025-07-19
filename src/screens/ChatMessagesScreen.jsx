import {
    Text,
    View,
    ScrollView,
    KeyboardAvoidingView,
    TextInput,
    Pressable,
    Platform,
    PermissionsAndroid,
    Alert,
    Image,
    StyleSheet,
} from "react-native";
import React, {
    useState,
    useLayoutEffect,
    useContext,
    useRef,
    useEffect,
} from "react";
import Feather from "react-native-vector-icons/Feather";
import Entypo from "react-native-vector-icons/Entypo";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import EmojiSelector from "react-native-emoji-selector";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { UserType } from "../context/UserContext.js";
import axios from "axios";
import socket from "../context/socket.js";

const ChatMessagesScreen = () => {
    const [showEmojiSelector, setShowEmojiSelector] = useState(false);
    const [selectedMessages, setSelectedMessages] = useState([]);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [selectedImage, setSelectedImage] = useState("");
    const [recepientData, setRecepientData] = useState(null);
    const scrollViewRef = useRef(null);
    const navigation = useNavigation();
    const route = useRoute();
    const { recepientId } = route.params;
    const { userId } = useContext(UserType);

    const handleSend = async () => {
        try {
            const formData = new FormData();
            formData.append("senderId", userId);
            formData.append("recepientId", recepientId);

            if (selectedImage) {
                formData.append("messageType", "image");
                formData.append("image", {
                    uri: selectedImage.uri,
                    name: selectedImage.fileName || selectedImage.name || 'photo.jpg',
                    type: selectedImage.type || 'image/jpeg',
                });
            } else {
                formData.append("messageType", "text");
                formData.append("messageText", message);
            }

            const { data } = await axios.post(
                "http://10.0.2.2:8000/api/messages",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            if (data.success) {
                setMessage("");
                setSelectedImage("");
                fetchMessages();
            } else {
                Alert.alert("Error", "Message not sent");
            }
        } catch (error) {
            console.log("Error in sending message:", error);
        }
    };


    const requestCameraPermission = async () => {
        if (Platform.OS === "android") {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn("Camera permission error:", err);
                return false;
            }
        }
        return true;
    };

    const openCamera = async () => {
        const hasPermission = await requestCameraPermission();
        if (!hasPermission) {
            Alert.alert("Permission Denied", "Cannot access camera.");
            return;
        }

        const options = {
            mediaType: "photo",
            quality: 1,
        };

        launchCamera(options, (response) => {
            if (response.didCancel) {
                console.log("User cancelled camera");
            } else if (response.errorCode) {
                console.log("Camera Error:", response.errorMessage);
            } else if (response.assets?.length > 0) {
                const uri = response.assets[0].uri;
                const imageData = {
                    uri: uri,
                    name: uri.split("/").pop(),
                    type: "image/jpeg"
                };
                setSelectedImage(imageData);

            }
        });
    };

    const pickImageFromGallery = async () => {
        const options = {
            mediaType: "photo",
            quality: 1,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log("User cancelled gallery");
            } else if (response.errorCode) {
                console.log("Gallery Error:", response.errorMessage);
            } else if (response.assets?.length > 0) {
                const asset = response.assets[0];
                const uri = asset.uri;
                const fileName = uri.split("/").pop();
                const match = /\.(\w+)$/.exec(fileName || "");
                const type = match ? `image/${match[1]}` : `image`;

                const imageData = {
                    uri,
                    name: fileName,
                    type,
                };

                setSelectedImage(imageData);

            }
        });
    };

    const fetchMessages = async () => {
        try {
            const { data } = await axios.get(
                `http://10.0.2.2:8000/api/messages/${userId}/${recepientId}`
            );

            if (data.success) {
                setMessages(data?.data);
            } else {
                Alert.alert(data.message);
            }
        } catch (error) {
            console.log("error fetching messages", error);
        }
    };

    const handleSelectMessage = (msg) => {
        const isSelected = selectedMessages.includes(msg._id);
        setSelectedMessages((prev) =>
            isSelected ? prev.filter((id) => id !== msg._id) : [...prev, msg._id]
        );
    };

    const handleContentSizeChange = () => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    };

    const deleteMessages = async (messageIds) => {
        try {
            const { data } = await axios.post("http://10.0.2.2:8000/api/deleteMessages", { messages: messageIds });

            if (data.success) {
                setSelectedMessages((prevSelectedMessages) =>
                    prevSelectedMessages.filter((id) => !messageIds.includes(id))
                );

                fetchMessages();
            } else {
                console.log("error deleting messages", data.message);
            }
        } catch (error) {
            console.log("error deleting messages", error);
        }
    };


    useEffect(() => {
        if (!socket.connected) {
            socket.connect();
        }

        socket.emit("join", userId);

        const handleNewMessage = (msg) => {
             
            setMessages((prevMessages) => [...prevMessages, {
                _id: msg._id,
                message: msg.message,
                timeStamp: msg.timeStamp,
                senderId: msg.senderId,
                imageUrl: msg.imageUrl ,
                messageType: msg.messageType
            }]);
        };

        socket.on("newMessage", handleNewMessage);

        return () => {
            socket.off("newMessage", handleNewMessage);
        };
    }, [socket]);

    useEffect(() => {
        fetchMessages();
    }, []);

    useEffect(() => {
        const fetchRecepientData = async () => {
            try {
                const { data } = await axios.get(
                    `http://10.0.2.2:8000/api/user/${recepientId}`
                );
                if (data.success) {
                    setRecepientData(data?.data);
                }
            } catch (error) {
                console.log("Error retrieving details", error);
            }
        };

        fetchRecepientData();
    }, [recepientId]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "",
            headerLeft: () => (
                <View style={styles.headerLeft}>
                    <Ionicons
                        onPress={() => navigation.goBack()}
                        name="arrow-back"
                        size={24}
                        color="black"
                    />
                    {selectedMessages.length > 0 ? (
                        <Text style={styles.headerCount}>{selectedMessages.length}</Text>
                    ) : (
                        <View style={styles.userInfo}>
                            {recepientData?.image && (
                                <Image source={{ uri: recepientData.image }} style={styles.userImage} />
                            )}
                            <Text style={styles.userName}>
                                {recepientData?.name || "User"}
                            </Text>
                        </View>
                    )}
                </View>
            ),
            headerRight: () => (
                <View style={styles.headerRight}>
                    {selectedMessages.length > 0 ? (
                        <>
                            <Ionicons name="arrow-redo-outline" size={24} color="black" />
                            <Ionicons name="arrow-undo-outline" size={24} color="black" />
                            <FontAwesome name="star" size={24} color="black" />
                            <MaterialIcons
                                onPress={() => deleteMessages(selectedMessages)}
                                name="delete"
                                size={24}
                                color="black"
                            />
                        </>
                    ) : (
                        <MaterialIcons
                            onPress={() => deleteMessages(selectedMessages)}
                            name="delete"
                            size={24}
                            color="black"
                        />
                    )}
                </View>
            ),
        });
    }, [navigation, recepientData, selectedMessages]);

   
    return (
        <KeyboardAvoidingView style={styles.container}>
            <ScrollView
                ref={scrollViewRef}
                contentContainerStyle={styles.scrollContent}
                onContentSizeChange={handleContentSizeChange}
            >
                {messages?.map((msg) => {
                    const isSender = (msg.senderId._id === userId);

                    return (
                        <Pressable
                            onLongPress={() => handleSelectMessage(msg)}
                            key={msg._id}
                            style={[
                                styles.messageContainer,
                                isSender ? styles.senderMessage : styles.receiverMessage,
                                selectedMessages.includes(msg._id) && styles.selectedMessage,
                                { alignSelf: isSender ? "flex-end" : "flex-start" }
                            ]}
                        >
                            {msg.messageType === "text" && (
                                <Text style={styles.messageText}>{msg.message}</Text>
                            )}

                            {msg.messageType === "image" && (
                                <Image
                                    source={{ uri: msg.imageUrl }}
                                    style={styles.messageImage}
                                />
                            )}

                            <Text style={styles.messageTime}>
                                {new Date(msg.timeStamp).toLocaleTimeString("en-US", {
                                    hour: "numeric",
                                    minute: "numeric",
                                    hour12: true,
                                })}
                            </Text>
                        </Pressable>
                    );
                })}

            </ScrollView>
            {selectedImage && (
                <View style={{ padding: 10, alignItems: "center" }}>
                    <Image
                        source={{ uri: selectedImage.uri }}
                        style={{
                            width: 120,
                            height: 120,
                            borderRadius: 10,
                            marginBottom: 10,
                            borderWidth: 1,
                            borderColor: "#ccc",
                        }}
                    />
                    <Pressable
                        onPress={() => setSelectedImage("")}
                        style={{
                            position: "absolute",
                            top: 5,
                            right: 20,
                            backgroundColor: "#fff",
                            borderRadius: 12,
                            paddingHorizontal: 6,
                            paddingVertical: 2,
                            elevation: 2,
                        }}
                    >
                        <Text style={{ color: "red", fontWeight: "bold" }}>X</Text>
                    </Pressable>
                </View>
            )}



            <View style={styles.inputContainer}>

                <TextInput
                    value={message}
                    onChangeText={setMessage}
                    style={styles.textInput}
                    placeholder="Type your message..."
                    placeholderTextColor={'#ffffff'}
                />

                <View style={styles.actionIcons}>
                    <Entypo onPress={pickImageFromGallery} name="image" size={24} color="gray" />
                    <Entypo onPress={openCamera} name="camera" size={24} color="gray" />
                    <Feather name="mic" size={24} color="gray" />
                </View>

                <Pressable onPress={handleSend} style={styles.sendButton}>
                    <Text style={styles.sendButtonText}>Send</Text>
                </Pressable>
            </View>

            {showEmojiSelector && (
                <EmojiSelector
                    onEmojiSelected={(emoji) => setMessage((prev) => prev + emoji)}
                    showSearchBar
                    showTabs
                    showHistory
                    columns={8}
                />
            )}
        </KeyboardAvoidingView>
    );
};

export default ChatMessagesScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#2c2a2aff" },
    scrollContent: { flexGrow: 1 },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: "#ddd",
        marginBottom: Platform.OS === "ios" ? 10 : 25,
    },
    iconMargin: { marginRight: 5 },
    textInput: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 20,
        paddingHorizontal: 10,
        color:'#ffffff',
        
    },
    actionIcons: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 8,
        gap: 7,
    },
    sendButton: {
        backgroundColor: "#007bff",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    sendButtonText: { color: "white", fontWeight: "bold" },
    headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
    headerRight: { flexDirection: "row", alignItems: "center", gap: 10 },
    headerCount: { fontSize: 16, fontWeight: "500" },
    userInfo: { flexDirection: "row", alignItems: "center" },
    userImage: { width: 30, height: 30, borderRadius: 15, resizeMode: "cover" },
    userName: { marginLeft: 5, fontSize: 15, fontWeight: "bold" },
    messageContainer: {
        padding: 10,
        borderRadius: 10,
        marginVertical: 5,
        margin:10,
        maxWidth: "70%",
        backgroundColor: "#eee",
    },

    senderMessage: {
        backgroundColor: "#DCF8C6",
    },

    receiverMessage: {
        backgroundColor: "#fff",
    },

    messageText: {
        fontSize: 16,
        color: "#000",

    },

    messageTime: {
        fontSize: 12,
        color: "gray",
        alignSelf: "flex-end",
    },

    selectedMessage: {
        borderWidth: 2,
        borderColor: "dodgerblue",
    },
    messageImage: {
        width: 200,
        height: 200,
        borderRadius: 10,
        resizeMode: 'cover',
        marginVertical: 5,
    }


});
