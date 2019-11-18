const router = require("express").Router();

const authGuard = require("./guards/auth.guard");
const homeController = require("../controllers/home.controller");

router.get("/", authGuard.isAuth, homeController.getHome);

router.get("/friends", authGuard.isAuth, homeController.getFriends);

router.get("/search", authGuard.isAuth, homeController.getSearch)

module.exports = router;
