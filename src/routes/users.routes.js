const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users.controller");

router.post("/register", usersController.register);
router.post("/login", usersController.login);
router.get("/", usersController.getAllUsers);
router.get("/:id", usersController.getUserById);

module.exports = router