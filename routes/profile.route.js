const router = require("express").Router();

const authGuard = require("./guards/auth.guard");
const profileController = require("../controllers/profile.controller");

router.get("/", authGuard.isAuth, profileController.getProfile);

router.get("/:id", authGuard.isAuth, profileController.getProfile);

module.exports = router;
