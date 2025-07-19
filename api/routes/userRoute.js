import express from 'express';
import jwt from "jsonwebtoken";
import User from '../model/user.js';
import Message from '../model/message.js';
import { io } from '../index.js';
import { upload } from '../middleware/multer.js';
// import { Strategy as LocalStrategy } from "passport-local";
import {v2 as cloudinary} from 'cloudinary';

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const { name, email, password, image } = req.body;
        
        const newUser = new User({ name, email, password, image });

        await newUser.save();
        return res.json({success:true,message:'user registered successfully'});
    } catch (error) {
        console.log(error);
        return res.json({success:false,message:error});
    }
});


const createToken = (userId) => {
  const payload = { userId };
  return jwt.sign(payload, "yourSecretKey", { expiresIn: "1h" });
};


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.json({success:false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({success:false, message: "User not found" });
    }

    
    if (user.password !== password) {
      return res.json({success:false, message: "Invalid password" });
    }

    const token = createToken(user._id);

    return res.json({success:true, token, userId: user._id, message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error);
    return res.json({success:false,message: "Internal server error" });
  }
});

router.get("/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const users = await User.find({ _id: { $ne: userId } });

    return res.json({
      success: true,
      message: "Users fetched successfully",
      userdata: users,
    });
  } catch (err) {
    console.log("Error retrieving users", err);
    return res.json({ success: false, message: "Error retrieving users" });
  }
});

router.post("/friend-request", async (req, res) => {
  try {
    const { currentUserId, selectedUserId } = req.body;

    await User.findByIdAndUpdate(selectedUserId, {
      $push: { friendRequests: currentUserId }, 
    });

    await User.findByIdAndUpdate(currentUserId, {
      $push: { sentFriendRequests: selectedUserId },
    });

    return res.json({ success: true, message: "Friend request sent" });
  } catch (error) {
    return res.json({ success: false, message: "Failed to send friend request" });
  }
});


router.get("/friend-request/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId)
      .populate("friendRequests", "name email image")
      .lean();
      if(!user){
        return res.json({ success: false, message: "User not found" });
      }
     
    return res.json({ success: true, message: "Friend requests fetched",user});
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Failed to fetch friend requests" });
  }
});

router.post("/friend-request/accept", async (req, res) => {
  try {
    const { senderId, recepientId } = req.body;

    await User.findByIdAndUpdate(senderId, {
      $pull: { sentFriendRequests: recepientId },
      $addToSet: { friends: recepientId },
    });

    await User.findByIdAndUpdate(recepientId, {
      $pull: { friendRequests: senderId }, 
      $addToSet: { friends: senderId },
    });

    return res.json({ success: true, message: "Friend request accepted" });
  } catch (error) {
    console.error("Error accepting friend request:", error);
    return res.json({ success: false, message: "Failed to accept friend request" });
  }
});


router.get("/accepted-friends/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
  
    
    const user = await User.findById(userId).populate("friends", "name email image").lean();
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
  
    
   return res.json({success:true, message: "Friends fetched", data: user.friends });
  } catch (error) {
    console.error(error);
   return res.json({ success: false, message: "Failed to fetch friends" });
  }
});




router.post("/messages", upload.single("image"), async (req, res) => {
  try {
    const { senderId, recepientId, messageType, messageText } = req.body;
    const filepath = req.file?.path;

    if (messageType === "image" && !req.file) {
      return res.json({
        success: false,
        message: "Uploading please wait...",
      });
    }

    const newMessage = new Message({
      senderId,
      recepientId,
      messageType,
      message: messageText || "",
      timestamp: new Date(),
    });

    if (filepath) {
      const imageUpload = await cloudinary.uploader.upload(filepath, {
        resource_type: 'image',
      });
      const imageURL = imageUpload?.secure_url;
      newMessage.imageUrl = imageURL;
    }

    await newMessage.save();

    io.to(recepientId).emit("newMessage", newMessage);

    return res.json({
      success: true,
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    console.error("Error saving message:", error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});


router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const recepientId = await User.findById(userId);
   return  res.json({ success: true, message: "User fetched", data: recepientId });
  } catch (error) {
    console.log(error);
   return  res.json({ success: false, message: "Failed to fetch user" });
  }
});

router.get("/messages/:senderId/:recepientId", async (req, res) => {
  try {
    const { senderId, recepientId } = req.params;
    const messages = await Message.find({
      $or: [
        { senderId, recepientId },
        { senderId: recepientId, recepientId: senderId },
      ],
    }).populate("senderId", "_id name");

   
   return res.json({ success: true, message: "Messages fetched", data: messages });
  } catch (error) {
    console.log(error);
   return res.json({ success: false, message: "Failed to fetch messages" });
  }
});

router.post("/deleteMessages", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.json({ success: false, message: "Invalid message list" });
    }
    await Message.deleteMany({ _id: { $in: messages } });
   return res.json({ success: true, message: "Messages deleted successfully" });
  } catch (error) {
    console.log(error);
   return res.json({ success: false, message: "Failed to delete messages" });
  }
});


router.get("/friend-requests/sent/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId)
      .populate("sentFriendRequests", "name email image")
      .lean();
   return res.json({ success: true, message: "Sent friend requests fetched", data: user.sentFriendRequests });
  } catch (error) {
    console.log("Error", error);
   return res.json({ success: false, message: "Failed to fetch sent friend requests" });
  }
});

router.get("/friends/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate("friends");

    if (!user) return res.json({ success: false, message: "User not found" });

    const friendIds = user.friends.map((friend) => friend._id);
   return res.json({ success: true, message: "Friends list fetched", data: friendIds });
  } catch (error) {
    console.log("Error", error);
   return res.json({ success: false, message: "Failed to fetch friends" });
  }
});





export default router;
