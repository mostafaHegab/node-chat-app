const newMessage = require("../models/group-message.model").newMessage;

module.exports = io => {
    io.on("connection", socket => {
        socket.on("joinGroup", chatId => {
            socket.join(chatId);
        });
        socket.on("sendGroupMessage", (msg, cb) => {
            newMessage(msg).then(() => {
                io.to(msg.group).emit("newGroupMessage", msg);
                cb();
            });
        });
    });
};
