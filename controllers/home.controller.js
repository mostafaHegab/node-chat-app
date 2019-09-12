const userModel = require("../models/user.model");

exports.getHome = (req, res, next) => {
    res.render("index", {
        pageTitle: "Home",
        isUser: req.session.userId,
        friendRequests: req.friendRequests
    });
};

exports.getFriends = (req, res, next) => {
    userModel
        .getFriends(req.session.userId)
        .then(friends => {
            res.render("friends", {
                pageTitle: "Friends",
                isUser: req.session.userId,
                friendRequests: req.friendRequests,
                friends: friends
            });
        })
        .catch(err => {
            res.redirect("/error");
        });
};
