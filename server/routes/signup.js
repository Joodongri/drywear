const express = require("express");
const router = express.Router();
const usercontroller = require("../controllers/userController");

router.post("/", usercontroller.createUser, (req, res) => {
    return res.json('Success: user created');
});

module.exports = router;