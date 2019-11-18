const mongoose = require("mongoose");

const DB_URL = "mongodb://localhost:27017/chat-app";

const messageSchema = mongoose.Schema({
    group: { type: mongoose.Schema.Types.ObjectId, ref: "group" },
    content: String,
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    timestamp: Number
});

const Message = mongoose.model("group-message", messageSchema);

exports.getMessages = async groupId => {
    try {
        await mongoose.connect(DB_URL);
        let messages = await Message.find({ group: groupId }, null, {
            sort: {
                timestamp: 1
            }
        })
            .populate({
                path: "group", // field
                model: "group", // model
                populate: {
                    path: "users",
                    model: "user",
                    select: "username image"
                }
            })
            .populate({
                path: "sender",
                model: "user",
                select: "username image"
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
