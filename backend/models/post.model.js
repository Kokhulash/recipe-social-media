import mongoose from 'mongoose';

const recipePostSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    img: {
        type: String,
        //required: true
    },
    ingredients: [
        {
            type: String,
            required: true
        }
    ],
    categories: [
        {
            type: String,
            //required: true
        }
    ],
    description: {
        type: String,
        //required: true
    },
    servings: {
        type: String,
        //required: true
    },
    instructions: [
        {
            type: String,
            //required: true
        }
    ],
    preparationTime: {
        type: String,
        //required: true
    },
    cookingTime: {
        type: String,
        //required: true
    },
    videoLink: {
        type: String,
        default: null
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    comments: [
        {
            text: {
                type: String,
                required: true,
            },
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            }
        }
    ]
}, {
    timestamps: true
});

const Post = mongoose.model("Post", recipePostSchema);

export default Post;