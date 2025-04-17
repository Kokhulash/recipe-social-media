import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import {generateTokenAndSetCookies} from "../lib/utils/generateToken.js";

export const signup = async (req, res) => {
    try {
        const {fullName, username, email, password} = req.body;

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                error: "Invalid email format"
            })
        }

        const existingUser = await User.findOne({username});

        if (existingUser) {
            return res.status(400).json({
                error: "Username is already taken"
            })
        }

        const existingEmail = await User.findOne({email});

        if (existingEmail) {
            return res.status(400).json({
                error: "Email is already taken"
            })
        }

        if (password.length < 6) {
            return res.status(400).json({
                error: "Password must be at least 6 characters long"
            })
        }
        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            username,
            email,
            password: hashedPassword,
        })

        if (newUser) {
            generateTokenAndSetCookies(newUser._id, res);
            await newUser.save();

            res.status(200).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                userName: newUser.username,
                email: newUser.email,
                profileImage: newUser.profileImage,
                coverImg: newUser.coverImg,
                link: newUser.link,
                followers: newUser.followers,
                following: newUser.following,
            })
        } else {
            res.status(400).json({
                error: "Invalid user data"
            })
        }
    } catch (e) {
        console.log("Error in signup controller: ", e);

        res.status(500).json({
            error: "Internal server error"
        })
    }
}

export const login = async (req, res) => {
    try {
        const {username, password} = req.body;

        const user = await User.findOne({ username });
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        if(!user || !isPasswordCorrect) {
            return res.status(400).json({
                error: "Invalid username or password"
            })
        }

        generateTokenAndSetCookies(user._id,res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            userName: user.username,
            email: user.email,
            profileImage: user.profileImage,
            coverImg: user.coverImg,
            link: user.link,
            followers: user.followers,
            following: user.following,
        })

    } catch (e) {
        console.log("Error in login controller: ", e.message);

        res.status(500).json({
            error: "Internal server error"
        })
    }
}

export const logout = async (req, res) => {
    try {
        res.cookie("token", "", {
            maxAge : 0
        });

        res.status(200).json({
            message: "Logged out successfully"
        })
    } catch (e) {
        console.log("Error in logout controller", e.message);
        res.status(500).json({
            error: "Internal server error"
        })
    }
}

export const getMe = async (req, res) => {
    try{
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json(user);
    } catch (e) {
        console.log("Error in getMe controller", e.message);
        res.status(500).json({
            error: "Internal server error"
        });
    }
}