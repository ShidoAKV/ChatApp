import express from "express";
import bodyParser from "body-parser";
import passport from "passport";
import cors from "cors";
import connectDB from "./config/db.js";
import router from "./routes/userRoute.js";

const app = express();
const port = 8000;
connectDB();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());


app.use('/api',router);
app.use("/files", express.static("files"));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// app.post("/register", (req, res) => {
//   const { name, email, password, image } = req.body;

//   const newUser = new User({ name, email, password, image });

//   newUser
//     .save()
//     .then(() => res.status(200).json({ message: "User registered successfully" }))
//     .catch((err) => {
//       console.log("Error registering user", err);
//       res.status(500).json({ message: "Error registering the user!" });
//     });
// });


// const createToken = (userId) => {
//   const payload = { userId };
//   return jwt.sign(payload, "Q$r2K6W8n!jCW%Zk", { expiresIn: "1h" });
// };


// app.post("/login", (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password) {
//     return res.status(404).json({ message: "Email and the password are required" });
//   }

//   User.findOne({ email })
//     .then((user) => {
//       if (!user) return res.status(404).json({ message: "User not found" });

//       if (user.password !== password) {
//         return res.status(404).json({ message: "Invalid Password!" });
//       }

//       const token = createToken(user._id);
//       res.status(200).json({ token });
//     })
//     .catch((error) => {
//       console.log("Error finding user", error);
//       res.status(500).json({ message: "Internal server error!" });
//     });
// });


// app.get("/users/:userId", (req, res) => {
//   const loggedInUserId = req.params.userId;

//   User.find({ _id: { $ne: loggedInUserId } })
//     .then((users) => res.status(200).json(users))
//     .catch((err) => {
//       console.log("Error retrieving users", err);
//       res.status(500).json({ message: "Error retrieving users" });
//     });
// });


// app.post("/friend-request", async (req, res) => {
//   const { currentUserId, selectedUserId } = req.body;
//   try {
//     await User.findByIdAndUpdate(selectedUserId, {
//       $push: { freindRequests: currentUserId },
//     });

//     await User.findByIdAndUpdate(currentUserId, {
//       $push: { sentFriendRequests: selectedUserId },
//     });

//     res.sendStatus(200);
//   } catch (error) {
//     res.sendStatus(500);
//   }
// });

// app.get("/friend-request/:userId", async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const user = await User.findById(userId).populate("freindRequests", "name email image").lean();
//     const freindRequests = user.freindRequests;
//     res.json(freindRequests);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });


// app.post("/friend-request/accept", async (req, res) => {
//   try {
//     const { senderId, recepientId } = req.body;

//     const sender = await User.findById(senderId);
//     const recepient = await User.findById(recepientId);

//     sender.friends.push(recepientId);
//     recepient.friends.push(senderId);

//     recepient.freindRequests = recepient.freindRequests.filter(
//       (request) => request.toString() !== senderId.toString()
//     );

//     sender.sentFriendRequests = sender.sentFriendRequests.filter(
//       (request) => request.toString() !== recepientId.toString()
//     );

//     await sender.save();
//     await recepient.save();

//     res.status(200).json({ message: "Friend Request accepted successfully" });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });


// app.get("/accepted-friends/:userId", async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const user = await User.findById(userId).populate("friends", "name email image");
//     const acceptedFriends = user.friends;
//     res.json(acceptedFriends);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });


// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "files/");
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + "-" + file.originalname);
//   },
// });

// const upload = multer({ storage });

// app.post("/messages", upload.single("imageFile"), async (req, res) => {
//   try {
//     const { senderId, recepientId, messageType, messageText } = req.body;

//     const newMessage = new Message({
//       senderId,
//       recepientId,
//       messageType,
//       message: messageText,
//       timestamp: new Date(),
//       imageUrl: messageType === "image" ? req.file.path : null,
//     });

//     await newMessage.save();
//     res.status(200).json({ message: "Message sent Successfully" });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });


// app.get("/user/:userId", async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const recepientId = await User.findById(userId);
//     res.json(recepientId);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });


// app.get("/messages/:senderId/:recepientId", async (req, res) => {
//   try {
//     const { senderId, recepientId } = req.params;

//     const messages = await Message.find({
//       $or: [
//         { senderId, recepientId },
//         { senderId: recepientId, recepientId: senderId },
//       ],
//     }).populate("senderId", "_id name");

//     res.json(messages);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// app.post("/deleteMessages", async (req, res) => {
//   try {
//     const { messages } = req.body;

//     if (!Array.isArray(messages) || messages.length === 0) {
//       return res.status(400).json({ message: "Invalid request body!" });
//     }

//     await Message.deleteMany({ _id: { $in: messages } });

//     res.json({ message: "Messages deleted successfully" });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Internal Server" });
//   }
// });


// app.get("/friend-requests/sent/:userId", async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const user = await User.findById(userId).populate("sentFriendRequests", "name email image").lean();

//     res.json(user.sentFriendRequests);
//   } catch (error) {
//     console.log("Error", error);
//     res.status(500).json({ error: "Internal Server" });
//   }
// });

// app.get("/friends/:userId", async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const user = await User.findById(userId).populate("friends");

//     if (!user) return res.status(404).json({ message: "User not found" });

//     const friendIds = user.friends.map((friend) => friend._id);

//     res.status(200).json(friendIds);
//   } catch (error) {
//     console.log("Error", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });
