import express from "express";
import {protectRoute} from "../middleware/protectRoute.js";
import {
    createPost,
    deletePost,
    commentOnPost,
    likeUnLikePost,
    getAllPosts,
    getLikedPosts, getFollowingPosts, getUserPosts
} from "../controllers/post.controller.js";

const router = express.Router();

router.get("/likes/:id",protectRoute,getLikedPosts);
router.get("/following",protectRoute,getFollowingPosts);
router.get("/user/:username",protectRoute,getUserPosts);
router.get("/all",protectRoute,getAllPosts);
router.post("/create",protectRoute,createPost);
router.delete("/:id",protectRoute,deletePost);
router.post("/like/:id",protectRoute,likeUnLikePost);
router.post("/comment/:id",protectRoute,commentOnPost);


export default router;