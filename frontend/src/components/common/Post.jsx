import { FaRegComment, FaRegHeart, FaHeart, FaRegBookmark, FaBookmark, FaTrash, FaClock, FaUtensils } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner.jsx";

const RecipePost = ({ post }) => {
    const [comment, setComment] = useState("");
    const [showFullInstructions, setShowFullInstructions] = useState(false);
    const [showAllIngredients, setShowAllIngredients] = useState(false);
    const { data: authUser } = useQuery({ queryKey: ["authUser"] });
    const queryClient = useQueryClient();

    const { mutate: deletePost, isPending: isDeleting } = useMutation({
        mutationFn: async () => {
            try {
                const res = await fetch(`/api/posts/${post._id}`, {
                    method: "DELETE",
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Something went wrong");
                }

                return data;
            } catch (e) {
                throw new Error(e);
            }
        },
        onSuccess: () => {
            toast.success("Recipe deleted successfully.");
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        }
    });

    const { mutate: likePost, isPending: isLiking } = useMutation({
        mutationFn: async () => {
            try {
                const res = await fetch(`/api/posts/${post._id}/like`, {
                    method: "POST",
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Something went wrong");
                }

                return data;
            } catch (e) {
                throw new Error(e);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        }
    });

    const { mutate: saveComment, isPending: isCommenting } = useMutation({
        mutationFn: async () => {
            try {
                const res = await fetch(`/api/posts/${post._id}/comment`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ text: comment }),
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Something went wrong");
                }

                return data;
            } catch (e) {
                throw new Error(e);
            }
        },
        onSuccess: () => {
            setComment("");
            toast.success("Comment added successfully.");
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        }
    });

    const postOwner = post.user;
    const isLiked = post.likes.includes(authUser?._id);
    const isSaved = false; // This would need to be implemented with a bookmarks feature
    const isMyPost = authUser?._id === post.user._id;

    const handleDeletePost = () => {
        deletePost();
    };

    const handlePostComment = (e) => {
        e.preventDefault();
        if (comment.trim()) {
            saveComment();
        }
    };

    const handleLikePost = () => {
        likePost();
    };

    const handleToggleSave = () => {
        // This would need to be implemented with a bookmarks feature
        toast.success("Bookmark feature coming soon!");
    };

    return (
        <div className="card w-full bg-base-100 shadow-xl mb-8 overflow-hidden border border-gray-700">
            {/* Card Header with User Info */}
            <div className="flex items-start p-4 border-b border-gray-700">
                <div className="avatar">
                    <Link to={`/profile/${postOwner.username}`} className="w-10 h-10 rounded-full overflow-hidden">
                        <img src={postOwner.profileImg || "/avatar-placeholder.png"} alt={postOwner.fullName} />
                    </Link>
                </div>
                <div className="flex flex-col ml-3 flex-1">
                    <div className="flex gap-2 items-center">
                        <Link to={`/profile/${postOwner.username}`} className="font-bold">
                            {postOwner.fullName}
                        </Link>
                        <span className="text-gray-500 flex gap-1 text-sm">
                            <Link to={`/profile/${postOwner.username}`}>@{postOwner.username}</Link>
                        </span>
                        {isMyPost && (
                            <span className="flex justify-end flex-1">
                                {!isDeleting && <FaTrash className="cursor-pointer hover:text-red-500" onClick={handleDeletePost} />}
                                {isDeleting && <LoadingSpinner size={'sm'} />}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Recipe Title */}
            <div className="p-4 pb-0">
                <h2 className="card-title text-2xl font-bold mb-2">{post.title}</h2>

                {/* Categories */}
                <div className="flex flex-wrap gap-2 mb-3">
                    {post.categories.map((category, index) => (
                        <div key={index} className="badge badge-primary">{category}</div>
                    ))}
                </div>
            </div>

            {/* Recipe Image */}
            <figure className="px-4 pt-2">
                <img
                    src={post.img}
                    alt={post.title}
                    className="rounded-lg w-full h-80 object-cover"
                />
            </figure>

            {/* Recipe Info */}
            <div className="card-body pt-3">
                {/* Time and Servings Info */}
                <div className="flex flex-wrap gap-4 mb-3">
                    <div className="flex items-center gap-2">
                        <FaClock className="text-primary" />
                        <span>Prep: {post.preparationTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaClock className="text-primary" />
                        <span>Cook: {post.cookingTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaUtensils className="text-primary" />
                        <span>Serves: {post.servings}</span>
                    </div>
                </div>

                {/* Description */}
                <div className="mb-4">
                    <h3 className="font-bold text-lg mb-2">Description</h3>
                    <p className="text-gray-300">{post.description}</p>
                </div>

                {/* Ingredients Section */}
                <div className="mb-4">
                    <h3 className="font-bold text-lg mb-2">Ingredients</h3>
                    <div className="flex flex-col gap-2">
                        {post.ingredients && typeof post.ingredients === 'string' ?
                            post.ingredients.split(',').map((ingredient, index) => (
                                <div key={index} className="flex items-start gap-2">
                                    <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                                    <span className="text-gray-300">{ingredient.trim()}</span>
                                </div>
                            )) :
                            (Array.isArray(post.ingredients) && post.ingredients.map((ingredient, index) => (
                                <div key={index} className="flex items-start gap-2">
                                    <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                                    <span className="text-gray-300">{ingredient}</span>
                                </div>
                            )))
                        }
                    </div>
                </div>

                {/* Instructions Section */}
                <div className="mb-4">
                    <h3 className="font-bold text-lg mb-2">Instructions</h3>
                    <ol className='list-decimal ml-5'>
                        {post.instructions.map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ol>
                </div>



                {/* Video Link if available */}
                {post.videoLink && (
                    <div className="mb-4">
                        <h3 className="font-bold text-lg mb-2">Video Tutorial</h3>
                        <a
                            href={post.videoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline btn-primary btn-sm"
                        >
                            Watch Video Tutorial
                        </a>
                    </div>
                )}

                {/* Interaction Buttons */}
                <div className="flex justify-between mt-3 pt-3 border-t border-gray-700">
                    <div className="flex gap-6 items-center">
                        {/* Like Button */}
                        <div className="flex gap-1 items-center cursor-pointer" onClick={handleLikePost}>
                            {isLiked ? (
                                <FaHeart className="w-5 h-5 text-red-500" />
                            ) : (
                                <FaRegHeart className="w-5 h-5 text-gray-400 hover:text-red-500" />
                            )}
                            <span className={`text-sm ${isLiked ? "text-red-500" : "text-gray-400"}`}>
                                {post.likes.length}
                            </span>
                        </div>

                        {/* Comment Button */}
                        <div
                            className="flex gap-1 items-center cursor-pointer"
                            onClick={() => document.getElementById(`comments_modal_${post._id}`).showModal()}
                        >
                            <FaRegComment className="w-5 h-5 text-gray-400 hover:text-blue-400" />
                            <span className="text-sm text-gray-400 hover:text-blue-400">
                                {post.comments.length}
                            </span>
                        </div>

                        {/* Share Button */}
                        <div className="flex gap-1 items-center cursor-pointer">
                            <BiRepost className="w-6 h-6 text-gray-400 hover:text-green-500" />
                            <span className="text-sm text-gray-400 hover:text-green-500">Share</span>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="cursor-pointer" onClick={handleToggleSave}>
                        {isSaved ? (
                            <FaBookmark className="w-5 h-5 text-yellow-500" />
                        ) : (
                            <FaRegBookmark className="w-5 h-5 text-gray-400 hover:text-yellow-500" />
                        )}
                    </div>
                </div>
            </div>

            {/* Comments Modal */}
            <dialog id={`comments_modal_${post._id}`} className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-4">Comments</h3>
                    <div className="flex flex-col gap-3 max-h-60 overflow-auto mb-4">
                        {post.comments.length === 0 && (
                            <p className="text-sm text-gray-500">
                                No comments yet. Be the first to comment!
                            </p>
                        )}
                        {post.comments.map((comment, index) => (
                            <div key={index} className="flex gap-2 items-start border-b border-gray-700 pb-3">
                                <div className="avatar">
                                    <div className="w-8 rounded-full">
                                        <img
                                            src={comment.user.profileImg || "/avatar-placeholder.png"}
                                            alt={comment.user.fullName}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-1">
                                        <span className="font-bold">{comment.user.fullName}</span>
                                        <span className="text-gray-500 text-sm">
                                            @{comment.user.username}
                                        </span>
                                    </div>
                                    <div className="text-sm mt-1">{comment.text}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <form
                        className="flex gap-2 items-center mt-4"
                        onSubmit={handlePostComment}
                    >
                        <textarea
                            className="textarea textarea-bordered w-full resize-none focus:outline-none"
                            placeholder="Add a comment..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <button
                            className="btn btn-primary"
                            disabled={isCommenting || !comment.trim()}
                        >
                            {isCommenting ? (
                                <span className="loading loading-spinner"></span>
                            ) : (
                                "Post"
                            )}
                        </button>
                    </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>Close</button>
                </form>
            </dialog>
        </div>
    );
};

export default RecipePost;
