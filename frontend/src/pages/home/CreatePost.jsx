import { CiImageOn } from "react-icons/ci";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const CreateRecipe = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [title, setTitle] = useState("");
    const [img, setImg] = useState(null);
    const [categories, setCategories] = useState("");
    const [description, setDescription] = useState("");
    const [servings, setServings] = useState("");
    const [preparationTime, setPreparationTime] = useState("");
    const [cookingTime, setCookingTime] = useState("");
    const [videoLink, setVideoLink] = useState("");
    const [ingredientInput, setIngredientInput] = useState("");
    const [ingredientList, setIngredientList] = useState([]);
    const [instructionInput, setInstructionInput] = useState("");
    const [instructionList, setInstructionList] = useState([]);
    const imgRef = useRef(null);

    const { data: authUser } = useQuery({ queryKey: ['authUser'] });
    const queryClient = useQueryClient();

    const { mutate: createPost, isPending, isError } = useMutation({
        mutationFn: async ({
                               title,
                               img,
                               ingredients,
                               categories,
                               description,
                               servings,
                               instructions,
                               preparationTime,
                               cookingTime,
                               videoLink
                           }) => {
            const res = await fetch("/api/posts/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    img,
                    ingredients,
                    categories,
                    description,
                    servings,
                    instructions,
                    preparationTime,
                    cookingTime,
                    videoLink
                })
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Something went wrong");
            }
            return data;
        },
        onSuccess: () => {
            setTitle("");
            setImg(null);
            setIngredientList([]);
            setCategories("");
            setDescription("");
            setServings("");
            setInstructionList([]);
            setPreparationTime("");
            setCookingTime("");
            setVideoLink("");
            setIsExpanded(false);
            toast.success("Post created successfully");
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        createPost({
            title,
            img,
            ingredients: ingredientList,   // ✅ corrected
            categories,
            description,
            servings,
            instructions: instructionList, // ✅ corrected
            preparationTime,
            cookingTime,
            videoLink
        });
    };

    const handleImgChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImg(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    if (!isExpanded) {
        return (
            <div
                className='flex items-start sm:items-center gap-3 px-4 py-3 border-b border-base-300 hover:bg-base-200 transition-colors cursor-pointer rounded-md'
                onClick={() => setIsExpanded(true)}
            >
                <div className='avatar'>
                    <div className='w-10 sm:w-12 rounded-full'>
                        <img src={authUser?.profileImg || "/avatar-placeholder.png"} />
                    </div>
                </div>
                <div className='flex-1'>
                    <div
                        className='input rounded-full input-bordered border-white border-2 w-full text-base sm:text-md py-2 px-4 text-left cursor-pointer'
                    >
                        Share a new recipe <span className="hidden sm:inline">🍳</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='flex p-4 items-start gap-4 border-b border-gray-700'>
            <div className='avatar'>
                <div className='w-8 rounded-full'>
                    <img src={authUser?.profileImg || "/avatar-placeholder.png"} />
                </div>
            </div>

            <form className='flex flex-col gap-3 w-full' onSubmit={handleSubmit}>
                <input
                    type='text'
                    className='input input-bordered w-full text-md'
                    placeholder='Recipe Title'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                <textarea
                    className='textarea textarea-bordered text-md w-full'
                    placeholder='Short description of the recipe'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />

                {/* Ingredients */}
                <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            className="input input-bordered w-full text-md"
                            placeholder="Add Ingredient"
                            value={ingredientInput}
                            onChange={(e) => setIngredientInput(e.target.value)}
                        />
                        <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => {
                                if (ingredientInput.trim() !== "") {
                                    setIngredientList([...ingredientList, ingredientInput.trim()]);
                                    setIngredientInput("");
                                }
                            }}
                        >
                            Add
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {ingredientList.map((item, index) => (
                            <div key={index} className="badge badge-outline">
                                {item}
                                <IoCloseSharp
                                    className="ml-1 cursor-pointer"
                                    onClick={() => {
                                        setIngredientList(ingredientList.filter((_, i) => i !== index));
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Instructions */}
                <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            className="input input-bordered w-full text-md"
                            placeholder="Add Instruction"
                            value={instructionInput}
                            onChange={(e) => setInstructionInput(e.target.value)}
                        />
                        <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => {
                                if (instructionInput.trim() !== "") {
                                    setInstructionList([...instructionList, instructionInput.trim()]);
                                    setInstructionInput("");
                                }
                            }}
                        >
                            Add
                        </button>
                    </div>
                    <div className="flex flex-col gap-1">
                        {instructionList.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <span className="font-medium">{index + 1}.</span> {item}
                                <IoCloseSharp
                                    className="ml-1 cursor-pointer"
                                    onClick={() => {
                                        setInstructionList(instructionList.filter((_, i) => i !== index));
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Other Inputs */}
                <div className='flex gap-2'>
                    <input
                        type='text'
                        className='input input-bordered w-full text-md'
                        placeholder='Categories (e.g., Indian, Vegan)'
                        value={categories}
                        onChange={(e) => setCategories(e.target.value)}
                        required
                    />
                    <input
                        type='text'
                        className='input input-bordered w-1/3 text-md'
                        placeholder='Servings'
                        value={servings}
                        onChange={(e) => setServings(e.target.value)}
                        required
                    />
                </div>

                <div className='flex gap-2'>
                    <input
                        type='text'
                        className='input input-bordered w-1/2 text-md'
                        placeholder='Prep Time (e.g., 20 mins)'
                        value={preparationTime}
                        onChange={(e) => setPreparationTime(e.target.value)}
                        required
                    />
                    <input
                        type='text'
                        className='input input-bordered w-1/2 text-md'
                        placeholder='Cook Time (e.g., 30 mins)'
                        value={cookingTime}
                        onChange={(e) => setCookingTime(e.target.value)}
                        required
                    />
                </div>

                <input
                    type='url'
                    className='input input-bordered w-full text-md'
                    placeholder='Video Tutorial Link (optional)'
                    value={videoLink}
                    onChange={(e) => setVideoLink(e.target.value)}
                />

                {/* Image Upload */}
                {img && (
                    <div className='relative w-72 mx-auto'>
                        <IoCloseSharp
                            className='absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer'
                            onClick={() => {
                                setImg(null);
                                imgRef.current.value = null;
                            }}
                        />
                        <img src={img} className='w-full h-72 object-contain rounded' />
                    </div>
                )}

                {/* Buttons */}
                <div className='flex justify-between border-t py-2 border-t-gray-700'>
                    <div className='flex gap-2 items-center'>
                        <CiImageOn
                            className='fill-primary w-6 h-6 cursor-pointer'
                            onClick={() => imgRef.current.click()}
                        />
                        <input type='file' hidden ref={imgRef} onChange={handleImgChange} />
                    </div>

                    <div className="flex gap-2">
                        <button
                            type='button'
                            className='btn btn-ghost btn-sm rounded-full'
                            onClick={() => setIsExpanded(false)}
                        >
                            Cancel
                        </button>
                        <button className='btn btn-primary rounded-full btn-sm text-white px-6'>
                            {isPending ? "Posting..." : "Share Recipe"}
                        </button>
                    </div>
                </div>

                {isError && <div className='text-red-500'>Something went wrong</div>}
            </form>
        </div>
    );
};

export default CreateRecipe;
