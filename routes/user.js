const express = require("express");
const router = express.Router();
const { createUser, loginUser } = require("../utils/validation/user")
const validation =require("../middlewares/validateRequest")
const { signup, login ,refreshToken} = require("../controllers/user");
const multer = require("multer");
const upload = multer();
const singleImageUpload = require("../middlewares/uploadSingleImage");


router.post("/signup",  upload.single("image"),validation(createUser),singleImageUpload, signup);
router.post("/login",validation(loginUser), login);


router.post("/refresh-token",refreshToken)

module.exports = router; 