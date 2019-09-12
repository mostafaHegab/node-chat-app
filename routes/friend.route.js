const router = require("express").Router();
const bodyParser = require("body-parser").urlencoded({ extended: true });

const authGuard = require("./guards/auth.guard");
const friendController = require("../controllers/friend.controller");

router.post("/cancel", authGuard.isAuth, bodyParser, friendController.cancel);

router.post("/accept", authGuard.isAuth, bodyParser, friendController.accept);

router.post("/reject", authGuard.isAuth, bodyParser, friendController.reject);

router.post("/delete", authGuard.isAuth, bodyParser, friendController.delete);

module.exports = router;
