import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./src/models/user.model.js";
import { UnRegisteredUser } from "./src/models/unRegisteredUser.model.js";

dotenv.config();

const check = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    const email = "abhishekmusmade342@gmail.com";
    const username = "abhishek";

    const userByEmail = await User.findOne({ email });
    const userByUsername = await User.findOne({ username });
    const unreg = await UnRegisteredUser.findOne({ email });

    console.log("Check for SkillSwap Users:");
    console.log("User by email:", userByEmail ? `Found (Name: ${userByEmail.name}, Username: ${userByEmail.username})` : "Not Found");
    console.log("User by username:", userByUsername ? "Found" : "Not Found");

    console.log("Unregistered entry:", unreg ? "Found" : "Not Found");

    await mongoose.connection.close();
};

check();
