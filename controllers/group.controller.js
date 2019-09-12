const groupModel = require("../models/group.model");
const messagesModel = require("../models/group-message.model");
const getFriends = require("../models/user.model").getFriends;

exports.getUserGroups = (req, res, next) => {
    groupModel.getUserGroups(req.session.userId).then(groups => {
        res.render("groups", {
            pageTitle: "Groups",
            isUser: req.session.userId,
            friendRequests: req.friendRequests,
            groups: groups
        }).catch(err => {
            res.redirect("/error");
        });
    });
};

exports.getCreateGroup = (req, res, next) => {
    getFriends(req.session.userId)
        .then(friends => {
            res.render("create-group", {
                pageTitle: "Create Group",
                isUser: req.session.userId,
                friendRequests: req.friendRequests,
                friends: friends
            });
        })
        .catch(err => {
            res.redirect("/error");
        });
};

exports.postCreateGroup = (req, res, next) => {
    groupModel
        .createGroup(req.body)
        .then(id => {
            res.redirect("/groups/" + id);
        })
        .catch(err => {
            res.redirect("/error");
        });
};

exports.getGroup = (req, res, next) => {
    let chatId = req.params.id;
    messagesModel.getMessages(chatId).then(messages => {
        // return res.send(messages);
        if (messages.length === 0) {
            groupModel.getGroupInfo(chatId).then(data => {
                res.render("group-chat", {
                    pageTitle: data.name,
                    isUser: req.session.userId,
                    friendRequests: req.friendRequests,
                    messages: messages,
                    group: data
                });
            });
        } else {
            res.render("group-chat", {
                pageTitle: messages[0].group.name,
                isUser: req.session.userId,
                friendRequests: req.friendRequests,
                messages: messages,
                group: messages[0].group
            });
        }
    });
};
