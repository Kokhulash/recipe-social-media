import { FaRegComment, FaRegHeart, FaTrash } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegBookmark } from "react-icons/fa6";
import { useState } from "react";
import { Link } from "react-router-dom";

const Post = ({ post }) => {
    const [comment, setComment] = useState("");
    const postOwner = post.user;
    const isLiked = false;
    const isMyPost = true;
    const isCommenting = false;

    const formattedDate = new Date(post.createdAt).toLocaleDateString();

    const handleDeletePost = () => {};
    const handlePostComment = (e) => {
        e.preventDefault();
    };
    const handleLikePost = () => {};
    const handleVideoClick = () => {
        if (post.videoLink) {
            window.open(post.videoLink, "_blank");
        }
    };

    return (
        <div className='flex gap-2 items-start p-4 border-b border-gray-700'>
            <div className='avatar'>
                <Link to={`/profile/${postOwner.username}`} className='w-10 rounded-full overflow-hidden'>
                    <img src={postOwner.profileImg || "/avatar-placeholder.png"} />
                </Link>
            </div>
            <div className='flex flex-col flex-1'>
                <div className='flex justify-between items-start'>
                    <div>
                        <Link to={`/profile/${postOwner.username}`} className='font-bold'>
                            {postOwner.fullName}
                        </Link>
                        <p className='text-sm text-gray-500'>
                            @{postOwner.username} · {formattedDate}
                        </p>
                    </div>
                    {isMyPost && (
                        <FaTrash className='cursor-pointer hover:text-red-500' onClick={handleDeletePost} />
                    )}
                </div>

                <div className='mt-2'>
                    <h2 className='text-xl font-bold mb-1'>{post.title}</h2>
                    <p className='text-gray-300'>{post.description}</p>

                    <div className='my-2 grid gap-2'>
                        <img src={post.img} alt='recipe' className='rounded-lg max-h-80 object-contain border' />

                        {post.videoLink && (
                            <button
                                className='btn btn-primary mt-3'
                                onClick={handleVideoClick}
                            >
                                Watch Recipe Video
                            </button>
                        )}

                        <div className='text-sm text-gray-400'>
                            <p><strong>Ingredients:</strong> {post.ingredients.join(', ')}</p>
                            <p><strong>Categories:</strong> {post.categories.join(', ')}</p>
                            <p><strong>Servings:</strong> {post.servings}</p>
                            <p><strong>Prep Time:</strong> {post.preparationTime}</p>
                            <p><strong>Cook Time:</strong> {post.cookingTime}</p>
                            <p><strong>Instructions:</strong></p>
                            <ol className='list-decimal ml-5'>
                                {post.instructions.map((step, index) => (
                                    <li key={index}>{step}</li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </div>

                <div className='flex justify-between mt-4'>
                    <div className='flex gap-4 items-center justify-between'>
                        <div
                            className='flex gap-1 items-center cursor-pointer group'
                            onClick={() => document.getElementById("comments_modal" + post._id).showModal()}
                        >
                            <FaRegComment className='w-4 h-4 text-slate-500 group-hover:text-sky-400' />
                            <span className='text-sm text-slate-500 group-hover:text-sky-400'>
                                {post.comments.length}
                            </span>
                        </div>
                        <dialog id={`comments_modal${post._id}`} className='modal'>
                            <div className='modal-box rounded border border-gray-600'>
                                <h3 className='font-bold text-lg mb-4'>COMMENTS</h3>
                                <div className='flex flex-col gap-3 max-h-60 overflow-auto'>
                                    {post.comments.length === 0 ? (
                                        <p className='text-sm text-slate-500'>
                                            No comments yet 🤔 Be the first one 😉
                                        </p>
                                    ) : (
                                        post.comments.map((comment) => (
                                            <div key={comment._id} className='flex gap-2 items-start'>
                                                <div className='avatar'>
                                                    <div className='w-8 rounded-full'>
                                                        <img
                                                            src={comment.user.profileImg || "/avatar-placeholder.png"}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className='font-bold'>{comment.user.fullName} <span className='text-sm text-gray-500'>@{comment.user.username}</span></p>
                                                    <p className='text-sm'>{comment.text}</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <form className='flex gap-2 items-center mt-4 border-t border-gray-600 pt-2' onSubmit={handlePostComment}>
                                    <textarea
                                        className='textarea w-full p-1 rounded text-md resize-none border border-gray-800 focus:outline-none'
                                        placeholder='Add a comment...'
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                    />
                                    <button className='btn btn-primary rounded-full btn-sm text-white px-4'>
                                        {isCommenting ? <span className='loading loading-spinner loading-md'></span> : "Post"}
                                    </button>
                                </form>
                            </div>
                            <form method='dialog' className='modal-backdrop'>
                                <button>close</button>
                            </form>
                        </dialog>

                        <div className='flex gap-1 items-center group cursor-pointer'>
                            <BiRepost className='w-6 h-6 text-slate-500 group-hover:text-green-500' />
                            <span className='text-sm text-slate-500 group-hover:text-green-500'>0</span>
                        </div>
                        <div className='flex gap-1 items-center group cursor-pointer' onClick={handleLikePost}>
                            <FaRegHeart className={`w-4 h-4 ${isLiked ? "text-pink-500" : "text-slate-500"} group-hover:text-pink-500`} />
                            <span className={`text-sm ${isLiked ? "text-pink-500" : "text-slate-500"} group-hover:text-pink-500`}>
                                {post.likes.length}
                            </span>
                        </div>
                    </div>
                    <div className='flex gap-2 items-center'>
                        <FaRegBookmark className='w-4 h-4 text-slate-500 cursor-pointer' />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Post;
