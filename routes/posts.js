const express = require("express");
const router = express.Router();
const validation = require("../middlewares/validateRequest");
const auth = require("../middlewares/auth");
const multer = require("multer");
const {creatPostValid ,updatePostValid} = require("../utils/validation/posts");
const { getPosts, getPostById, createPosts,getHesPosts,updatePost,deletePost } = require("../controllers/posts");
const singleImageUpload = require("../middlewares/uploadSingleImage");
const upload = multer();
const deleteImage=require("../middlewares/deleteImage")

router.post(
  "/",
  auth,
  upload.single("image"),
  validation(creatPostValid),
  singleImageUpload,
   createPosts
);

router.get("/",auth,getPosts)
router.get("/user",auth,getHesPosts)
router.get("/:id",auth,getPostById)

router.patch("/:id",auth,upload.single("image"),validation(updatePostValid),singleImageUpload,updatePost)
router.delete("/:id",auth,deletePost)





 module.exports=router