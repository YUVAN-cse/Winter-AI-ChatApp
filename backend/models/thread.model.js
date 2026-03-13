import mongoose from "mongoose";
import User from "./user.model.js";
import Message from "./message.model.js";

const threadSchema = new mongoose.Schema({
    threadId: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
        }
    ],
    role: {
        type: String,
        enum: ["user", "assistant"],
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
        index: true
    },
});

const Thread = mongoose.model("Thread", threadSchema);

export default Thread;