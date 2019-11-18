const mongoose = require("mongoose");

const Chat = require("./chat.model").Chat;

const DB_URL = "mongodb://localhost:27017/chat-app";

const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    image: { type: String, default: "default-user-image.png" },
    friends: {
        type: [{ name: String, image: String, id: String, chatId: String }],
        default: []
    },
    friendRequests: {
        type: [{ name: String, id: String }],
        default: []
    },
    sentRequests: {
        type: [{ name: String, id: String }],
        default: []
    }
});

const User = mongoose.model("user", userSchema);
exports.User = User;

exports.getUsers = async query => {
    try {
        await mongoose.connect(DB_URL)
        let users = await User.find(query)
        return users
    } catch(err) {
        mongoose.disconnect();
        throw new Error(error);
    }
}

exports.getUserData = id => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() => {
                return User.findById(id);
            })
            .then(data => {
                mongoose.disconnect();
                resolve(data);
            })
            .catch(err => {
                mongoose.disconnect();
                reject(err);
            });
    });
};

exports.sendFriendRequest = async data => {
    // add my data to friend friendRequests
    // add friend data to my sentRequests
    try {
        await mongoose.connect(DB_URL);
        await Promise.all([
            User.updateOne(
                { _id: data.friendId },
                {
                    $push: {
                        friendRequests: { name: data.myName, id: data.myId }
                    }
                }
            ),
            User.updateOne(
                { _id: data.myId },
                {
                    $push: {
                        sentRequests: {
                            name: data.friendName,
                            id: data.friendId
                        }
                    }
                }
            )
        ]);
        mongoose.disconnect();
        return;
    } catch (error) {
        mongoose.disconnect();
        throw new Error(error);
    }
};

exports.cancelFriendRequest = async data => {
    // remove me from friend friendRequests
    // remove friend from my sentRequests
    try {
        await mongoose.connect(DB_URL);
        await Promise.all([
            User.updateOne(
                { _id: data.friendId },
                { $pull: { friendRequests: { id: data.myId } } }
            ),
            User.updateOne(
                { _id: data.myId },
                {
                    $pull: {
                        sentRequests: { id: data.friendId }
                    }
                }
            )
        ]);
        mongoose.disconnect();
        return;
    } catch (error) {
        mongoose.disconnect();
        throw new Error(error);
    }
};

exports.acceptFriendRequest = async data => {
    try {
        await mongoose.connect(DB_URL);
        let newChat = new Chat({
            users: [data.myId, data.friendId]
        });
        let chatDoc = await newChat.save();
        await Promise.all([
            User.updateOne(
                { _id: data.friendId },
                {
                    $pull: { sentRequests: { id: data.myId } }
                }
            ),
            User.updateOne(
                { _id: data.myId },
                {
                    $pull: {
                        friendRequests: { id: data.friendId }
                    }
                }
            ),
            User.updateOne(
                { _id: data.friendId },
                {
                    $push: {
                        friends: {
                            name: data.myName,
                            id: data.myId,
                            image: data.myImage,
                            chatId: chatDoc._id
                        }
                    }
                }
            ),
            User.updateOne(
                { _id: data.myId },
                {
                    $push: {
                        friends: {
                            name: data.friendName,
                            id: data.friendId,
                            image: data.friendImage,
                            chatId: chatDoc._id
                        }
                    }
                }
            )
        ]);
        mongoose.disconnect();
        return;
    } catch (err) {
        mongoose.disconnect();
        throw new Error(err);
    }
};

exports.rejectFriendRequest = async data => {
    try {
        await mongoose.connect(DB_URL);
        await Promise.all([
            User.updateOne(
                { _id: data.friendId },
                {
                    $pull: { sentRequests: { id: data.myId } }
                }
            ),
            User.updateOne(
                { _id: data.myId },
                {
                    $pull: {
                        friendRequests: { id: data.friendId }
                    }
                }
            )
        ]);
        mongoose.disconnect();
        return;
    } catch (err) {
        mongoose.disconnect();
        throw new Error(err);
    }
};

exports.deleteFriend = async data => {
    try {
        await mongoose.connect(DB_URL);
        await Promise.all([
            User.updateOne(
                { _id: data.friendId },
                {
                    $pull: { friends: { id: data.myId } }
                }
            ),
            User.updateOne(
                { _id: data.myId },
                {
                    $pull: {
                        friends: { id: data.friendId }
                    }
                }
            )
        ]);
        mongoose.disconnect();
        return;
    } catch (err) {
        mongoose.disconnect();
        throw new Error(err);
    }
};

exports.getFriendRequests = async id => {
    try {
        await mongoose.connect(DB_URL);
        let data = await User.findById(id, { friendRequests: true });
        mongoose.disconnect();
        return data.friendRequests;
    } catch (error) {
        mongoose.disconnect();
        throw new Error(error);
    }
};

exports.getFriends = async id => {
    try {
        await mongoose.connect(DB_URL);
        let data = await User.findById(id, { friends: true });
        mongoose.disconnect();
        return data.friends;
    } catch (error) {
        mongoose.disconnect();
        throw new Error(error);
    }
};