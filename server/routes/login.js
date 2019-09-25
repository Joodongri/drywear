const express = require("express");
const router = express.Router();
const usercontroller = require("../controllers/userController");

router.get("/", usercontroller.verifyUser, (req, res) => {
    return res.status(200).json("verified");
});


module.exports = router;