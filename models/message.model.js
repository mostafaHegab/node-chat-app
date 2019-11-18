const mongoose = require("mongoose");

const DB_URL = "mongodb://localhost:27017/chat-app";

const messageSchema = mongoose.Schema({
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "chat" },
    content: String,
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    timestamp: Number
});

const Message = mongoose.model("message", messageSchema);

exports.getMessages = async chatId => {
    try {
        await mongoose.connect(DB_URL);
        let messages = await Message.find({ chat: chatId }, null, {
            sort: {
                timestamp: 1
            }
        }).populate({
            path: "chat", // field
            model: "chat", // model
            populate: {
                path: "users",
                model: "user",
                select: "username image"
            }
        });
        mongoose.disconnect();
        return messages;
    } catch (error) {
        mongoose.disconnect();
        throw new Error(error);
    }
};

exports.newMessage = async msg => {
    try {
        await mongoose.connect(DB_URL);
        msg.timestamp = Date.now();
        let newMsg = new Message(msg);
        await newMsg.save();
        mongoose.disconnect;
        return;
    } catch (error) {
        mongoose.disconnect();
        throw new Error(error);
    }
};
