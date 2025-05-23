import User from "../models/user.model.js";
import Post from "../models/post.model.js";

import {v2 as cloudinary} from "cloudinary";
import Notification from "../models/notification.model.js";

export const createPost = async (req, res) => {
    try {
        const {
            title ,
            ingredients ,
            categories ,
            description,
            servings,
            instructions,
            preparationTime,
            cookingTime,
            videoLink,
        } = req.body;
        let {img} = req.body;

        const userId = req.user._id.toString();

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false, message: "User not found"
            })
        }

        const requiredFields = { title, img, ingredients, categories, description, servings, instructions, preparationTime, cookingTime };

        for (const [key, value] of Object.entries(requiredFields)) {
            if (!value) {
                return res.status(400).json({
                    success: false,
                    message: `${key} is required`
                });
            }
        }

        if (img) {
            const uploadedResponse = cloudinary.uploader.upload(img);
            img = (await uploadedResponse).secure_url;
        }

        const newPost = new Post({
            user: userId,
            title,
            img,
            ingredients,
            categories,
            description,
            servings,
            instructions,
            preparationTime,
            cookingTime,
            videoLink: videoLink || null
        })

        await newPost.save();

        res.status(201).json(newPost);

    } catch (e) {
        res.status(500).json({
            success: false, message: e.message
        })
        console.log("Error in createPost controller: ", e.message);
    }
}

export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false, message: "Post not found"
            })
        }

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                success: false, message: "You are not authorized to delete this post"
            })
        }

        if (post.img) {
            const imgId = post.img.split("/").pop().split(".")[0];

            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true, message: "Post deleted successfully"
        })
    } catch (e) {
        console.log("Error in deletePost controller: ", error);
        res.status(404).json({
            error: "Internal server error"
        })
    }
}

export const commentOnPost = async (req, res) => {
    try {
        const {text} = req.body;
        const postId = req.params.id;
        const userId = req.user._id;

        if (!text) {
            return res.status(400).json({
                success: false, message: "Please provide text"
            })
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false, message: "Post not found"
            })
        }

        const comment = {user: userId, text};

        post.comments.push(comment);

        await post.save();

        res.status(200).json(post)
    } catch (e) {
        console.log("Error in commentOnPost controller: ", e.message);
        res.status(500).json({
            success: false, message: "Internal Server Error"
        })
    }
}

export const likeUnLikePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false, message: "Post not found"
            })
        }

        const userLikedPost = post.likes.includes(userId);

        if (userLikedPost) {
            //unlike post
            await Post.updateOne({
                _id: postId
            }, {
                $pull: {
                    likes: userId
                }
            });

            await User.updateOne({
                _id: userId,
            },{
                $pull: {
                    likedPosts: postId
                }
            });

            const updatedLikes = post.likes.filter((id) => id.toString() !== userId.toString());
            res.status(200).json(updatedLikes);
        } else {
            post.likes.push(userId);

            await User.updateOne({
                _id: userId,
            },{
                $push: {
                    likedPosts: postId
                }
            })
            await post.save();

            const notification = new Notification({
                from: userId, to: post.user, type: "like"
            })

            await notification.save();

            const updatedLikes = post.likes;
            res.status(200).json(updatedLikes);
        }

    } catch (e) {
        console.log("Error in likeUnLikePost controller: ", e.message);
        res.status(404).json({
            success: false, message: "Internal server error"
        })
    }
}

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({
            createdAt: -1
        }).populate({
            path: "user", select: "-password"
        }).populate({
            path: "comments.user", select: "-password"
        })

        if (posts.length === 0) {
            return res.status(200).json([])
        }

        res.status(200).json(posts);
    } catch (e) {
        console.log("Error in getAllPosts controller: ", e.message);
        res.status(404).json({
            success: false, message: "Internal server error"
        })
    }
}

export const getLikedPosts = async (req, res) => {
    const userId = req.params.id;

    try{
        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({
                error: "User not found"
            })
        }

        const likedPosts = await Post.find({
            _id : {$in: user.likedPosts }
        }).populate({
            path: "user",
            select: "-password"
        }).populate({
            path: "comments.user",
            select: "-password"
        })

        res.status(200).json(likedPosts);
    } catch (e) {
        console.log("Error in getLikedPosts controller: ", e.message);
        res.status(500).json({
            success: false, message: "Internal server error"
        })
    }
}

export const getFollowingPosts = async (req, res) => {
    try {
         const userId = req.user._id;
         const user = await User.findById(userId);

         if(!user){
             return res.status(404).json({
                 error: "User not found"
             })
         }

         const following = user.following;

         const feedPosts = await Post.find({
             user: {
                 $in: following
             }
         }).sort({
             createdAt: -1
         }).populate({
             path: "user",
             select: "-password"
         }).populate({
             path: "comments.user",
             select: "-password"
         });

         res.status(200).json(feedPosts);

    } catch (e) {
        console.log("Error in getFollowingPosts controller: ", e.message);
        res.status(404).json({
            error: "Internal server error"
        })
    }
}

export const getUserPosts = async (req, res) => {
    try{
        const username = req.params.username;

        const user = await User.findOne({username});

        if(!user){
            return res.status(404).json({
                error: "User not found"
            })
        }

        const userPosts = await Post.find({
           user: user._id
        }).sort({ createdAt: -1 }).populate({
            path: "user",
            select: "-password"
        }).populate({
            path: "comments.user",
            select: "-password"
        });

        res.status(200).json(userPosts);
    }catch (e) {
        console.log("Error in getUserPosts controller: ", e.message);
        res.status(500).json({
            error: "Internal server error"
        })
    }
}