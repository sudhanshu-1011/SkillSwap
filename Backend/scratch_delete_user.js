import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./src/models/user.model.js";

dotenv.config();

const deleteUser = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    const email = "abhishekmusmade342@gmail.com";
    
    const result = await User.deleteOne({ email });
    console.log(`Deletion result for ${email}:`, result);

    await mongoose.connection.close();
};

deleteUser();
