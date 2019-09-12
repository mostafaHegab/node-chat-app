const userModel = require("../models/user.model");

exports.cancel = (req, res, next) => {
    userModel
        .cancelFriendRequest(req.body)
        .then(() => {
            res.redirect("/profile/" + req.body.friendId);
        })
        .catch(err => {
            res.redirect("/error");
        });
};

exports.accept = (req, res, next) => {
    userModel
        .acceptFriendRequest(req.body)
        .then(() => {
            res.redirect("/profile/" + req.body.friendId);
        })
        .catch(err => {
            res.redirect("/error");
        });
};

exports.reject = (req, res, next) => {
    userModel
        .rejectFriendRequest(req.body)
        .then(() => {
            res.redirect("/profile/" + req.body.friendId);
        })
        .catch(err => {
            res.redirect("/error");
        });
};

exports.delete = (req, res, next) => {
    userModel
        .deleteFriend(req.body)
        .then(() => {
            res.redirect("/profile/" + req.body.friendId);
        })
        .catch(err => {
            res.redirect("/error");
        });
};
