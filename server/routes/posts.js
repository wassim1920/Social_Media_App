import express from "express"
import {
    getFeedPosts, 
    getUserPosts,
    likePost
}from "../controllers/posts.js"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router();

router.get("/", verifyToken, getFeedPosts);
// only the user posts not all the post in home page
router.get("/:userId/posts", verifyToken, getUserPosts);

//update
router.patch("/:id/like", verifyToken, likePost);

export default router; 

