const router = require("express").Router();
const bodyParser = require("body-parser").urlencoded({ extended: true });

const authGuard = require("./guards/auth.guard");
const groupController = require("../controllers/group.controller");

router.get("/", authGuard.isAuth, groupController.getUserGroups);

router.get("/create", authGuard.isAuth, groupController.getCreateGroup);

router.post(
    "/create",
    authGuard.isAuth,
    bodyParser,
    groupController.postCreateGroup
);

router.get("/:id", authGuard.isAuth, groupController.getGroup);

module.exports = router;
