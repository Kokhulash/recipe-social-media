import { FaClock, FaRegComment, FaUtensils} from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FaRegBookmark} from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner.jsx";
import {formatPostDate} from "../../utils/date/index.js";

const RecipePost = ({ post }) => {
    const [comment, setComment] = useState("");
    const [showFullInstructions, setShowFullInstructions] = useState(false);
    const [showAllIngredients, setShowAllIngredients] = useState(false);
    const { data: authUser } = useQuery({ queryKey: ["authUser"] });
    const queryClient = useQueryClient();

    const postOwner = post.user;
    const isLiked = post.likes.includes(authUser._id);
    const isMyPost = authUser._id === post.user._id;
    const formattedDate = formatPostDate(post.createdAt);

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
                const res = await fetch(`/api/posts/like/${post._id}`, {
                    method: "POST",
                });
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.error || "Something went wrong");
                }
                return data;
            } catch (error) {
                throw new Error(error);
            }
        },
        onSuccess: (updatedLikes) => {
            // this is not the best UX, bc it will refetch all posts
            //queryClient.invalidateQueries({ queryKey: ["posts"] });

            // instead, update the cache directly for that post
            queryClient.setQueryData(["posts"], (oldData) => {
                return oldData.map((p) => {
                    if (p._id === post._id) {
                        return { ...p, likes: updatedLikes };
                    }
                    return p;
                });
            });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const { mutate: commentPost, isPending: isCommenting } = useMutation({
        mutationFn: async () => {
            try {
                const res = await fetch(`/api/posts/comment/${post._id}`, {
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
            } catch (error) {
                throw new Error(error);
            }
        },
        onSuccess: () => {
            toast.success("Comment posted successfully");
            setComment("");
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });


    const handleDeletePost = () => {
        deletePost();
    };

    const handlePostComment = (e) => {
        e.preventDefault();
        if(isCommenting) return;
        commentPost();
    };

    const handleLikePost = () => {
        if(isLiking) return;
        likePost();
    };

    return (
        <div className="card w-full bg-base-100 shadow-xl mb-8 overflow-hidden border border-gray-700">
            {/* Card Header with User Info */}
            <div className="flex gap-2 items-start p-4 border-b border-gray-700">
                <div className='avatar'>
                    <Link to={`/profile/${postOwner.username}`} className='w-8 rounded-full overflow-hidden'>
                        <img src={postOwner.profileImg || "/avatar-placeholder.png"} />
                    </Link>
                </div>
                <div className='flex gap-2 items-center'>
                    <Link to={`/profile/${postOwner.username}`} className='font-bold'>
                        {postOwner.fullName}
                    </Link>
                    <span className='text-gray-700 flex gap-1 text-sm'>
							<Link to={`/profile/${postOwner.username}`}>@{postOwner.username}</Link>
							<span>·</span>
							<span>{formattedDate}</span>
						</span>
                    {isMyPost && (
                        <span className='flex justify-end flex-1'>
								{!isDeleting && <FaTrash className='cursor-pointer hover:text-red-500' onClick={handleDeletePost}/>}

                            {isDeleting && (
                                <LoadingSpinner size={'sm'}/>
                            )}
							</span>
                    )}
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

                <div className='flex justify-between mt-3'>
                    <div className='flex gap-4 items-center w-2/3 justify-between'>
                        <div
                            className='flex gap-1 items-center cursor-pointer group'
                            onClick={() => document.getElementById("comments_modal" + post._id).showModal()}
                        >
                            <FaRegComment className='w-4 h-4  text-slate-500 group-hover:text-sky-400' />
                            <span className='text-sm text-slate-500 group-hover:text-sky-400'>
									{post.comments.length}
								</span>
                        </div>
                        {/* We're using Modal Component from DaisyUI */}
                        <dialog id={`comments_modal${post._id}`} className='modal border-none outline-none'>
                            <div className='modal-box rounded border border-gray-600'>
                                <h3 className='font-bold text-lg mb-4'>COMMENTS</h3>
                                <div className='flex flex-col gap-3 max-h-60 overflow-auto'>
                                    {post.comments.length === 0 && (
                                        <p className='text-sm text-slate-500'>
                                            No comments yet 🤔 Be the first one 😉
                                        </p>
                                    )}
                                    {post.comments.map((comment) => (
                                        <div key={comment._id} className='flex gap-2 items-start'>
                                            <div className='avatar'>
                                                <div className='w-8 rounded-full'>
                                                    <img
                                                        src={comment.user.profileImg || "/avatar-placeholder.png"}
                                                    />
                                                </div>
                                            </div>
                                            <div className='flex flex-col'>
                                                <div className='flex items-center gap-1'>
                                                    <span className='font-bold'>{comment.user.fullName}</span>
                                                    <span className='text-gray-700 text-sm'>
															@{comment.user.username}
														</span>
                                                </div>
                                                <div className='text-sm'>{comment.text}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <form
                                    className='flex gap-2 items-center mt-4 border-t border-gray-600 pt-2'
                                    onSubmit={handlePostComment}
                                >
										<textarea
                                            className='textarea w-full p-1 rounded text-md resize-none border focus:outline-none  border-gray-800'
                                            placeholder='Add a comment...'
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                        />
                                    <button className='btn btn-primary rounded-full btn-sm text-white px-4'>
                                        {isCommenting ? (
                                            <LoadingSpinner size={"md"}/>
                                        ) : (
                                            "Post"
                                        )}
                                    </button>
                                </form>
                            </div>
                            <form method='dialog' className='modal-backdrop'>
                                <button className='outline-none'>close</button>
                            </form>
                        </dialog>
                        <div className='flex gap-1 items-center group cursor-pointer'>
                            <BiRepost className='w-6 h-6  text-slate-500 group-hover:text-green-500' />
                            <span className='text-sm text-slate-500 group-hover:text-green-500'>0</span>
                        </div>
                        <div className='flex gap-1 items-center group cursor-pointer' onClick={handleLikePost}>
                            {isLiking && <LoadingSpinner size={"sm"}/>}
                            {!isLiked && !isLiking && (
                                <FaRegHeart className='w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500' />
                            )}
                            {isLiked && !isLiking &&<FaRegHeart className='w-4 h-4 cursor-pointer text-pink-500 ' />}

                            <span
                                className={`text-sm text-slate-500 group-hover:text-pink-500 ${
                                    isLiked ? "text-pink-500" : ""
                                }`}
                            >
									{post.likes.length}
								</span>
                        </div>
                    </div>
                    <div className='flex w-1/3 justify-end gap-2 items-center'>
                        <FaRegBookmark className='w-4 h-4 text-slate-500 cursor-pointer' />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipePost;
