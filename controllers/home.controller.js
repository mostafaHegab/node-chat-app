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

exports.getSearch = (req, res, next) => {
    if (!req.query.name) {
        res.render('search', {
            pageTitle: "Search",
            isUser: req.session.userId,
            friendRequests: req.friendRequests,
            users: null,
            searchMode: false
        })
    } else {
        userModel.getUsers({ username: {
            $regex: new RegExp("^" + req.query.name, "i")
        } })
            .then(users => {
                console.log(users)
                res.render('search', {
                    pageTitle: "Search",
                    isUser: req.session.userId,
                    friendRequests: req.friendRequests,
                    users: users,
                    searchMode: true
                })
            })
            .catch(err => {
                res.redirect("/error");
            });
    }
}
