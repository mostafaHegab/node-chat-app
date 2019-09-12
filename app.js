const express = require("express");
const path = require("path");
const session = require("express-session");
const SessionStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
const socketIO = require("socket.io");

const authRouter = require("./routes/auth.route");
const profileRouter = require("./routes/profile.route");
const friendRouter = require("./routes/friend.route");
const homeRouter = require("./routes/home.route");
const chatRouter = require("./routes/chat.route");
const groupRouter = require("./routes/group.route");

const getFrientRequests = require("./models/user.model").getFriendRequests;

const app = express();
const server = require("http").createServer(app);
const io = socketIO(server);

io.onlineUsers = {};

require("./sockets/friend.socket")(io);
require("./sockets/init.socket")(io);
require("./sockets/chat.socket")(io);
require("./sockets/group.socket")(io);

app.use(express.static(path.join(__dirname, "assets")));
app.use(express.static(path.join(__dirname, "images")));
app.use(flash());

const STORE = new SessionStore({
    uri:
        "mongodb+srv://kmrscript:kmrscript@cluster0-eb4ve.mongodb.net/chat-app?retryWrites=true&w=majority",
    collection: "sessions"
});

app.use(
    session({
        secret: "this is my secret secret to hash express sessions ......",
        saveUninitialized: false,
        store: STORE
    })
);

app.set("view engine", "ejs");
app.set("views", "views");

app.use((req, res, next) => {
    let userId = req.session.userId;
    if (userId) {
        getFrientRequests(userId)
            .then(requests => {
                req.friendRequests = requests;
                next();
            })
            .catch(err => res.redirect("/error"));
    } else {
        next();
    }
});

app.use("/", authRouter);
app.use("/", homeRouter);
app.use("/profile", profileRouter);
app.use("/friend", friendRouter);
app.use("/chat", chatRouter);
app.use("/groups", groupRouter);

app.get("/error", (req, res, next) => {
    res.status(500);
    res.render("error.ejs", {
        isUser: req.session.userId,
        pageTitle: "Error",
        friendRequests: req.friendRequests
    });
});

app.use((req, res, next) => {
    res.status(404);
    res.render("not-found", {
        isUser: req.session.userId,
        pageTitle: "Page Not Found",
        friendRequests: req.friendRequests
    });
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log("server listen on port " + port);
});
