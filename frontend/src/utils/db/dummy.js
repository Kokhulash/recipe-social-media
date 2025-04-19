export const POSTS = [
    {
        _id: "1",
        title: "Classic Margherita Pizza",
        img: "/posts/post1.png",
        description: "A simple and delicious Margherita pizza recipe with fresh basil, mozzarella, and homemade sauce.",
        ingredients: [
            "Pizza dough",
            "Tomato sauce",
            "Fresh mozzarella",
            "Fresh basil leaves",
            "Olive oil",
            "Salt"
        ],
        categories: ["Italian", "Vegetarian", "Main Course"],
        servings: "2",
        instructions: [
            "Preheat oven to 475°F (245°C).",
            "Spread tomato sauce over pizza base.",
            "Add mozzarella and basil.",
            "Bake for 10-12 minutes.",
            "Drizzle olive oil before serving."
        ],
        preparationTime: "15 mins",
        cookingTime: "12 mins",
        videoLink: "https://www.youtube.com/watch?v=4GUVz2psWUg",
        user: {
            username: "chefjohn",
            profileImg: "/avatars/boy1.png",
            fullName: "Chef John"
        },
        comments: [
            {
                _id: "c1",
                text: "Tried it! Super delicious 🍕",
                user: {
                    username: "foodieanna",
                    profileImg: "/avatars/girl1.png",
                    fullName: "Anna Foodie"
                }
            }
        ],
        likes: ["uid001", "uid002", "uid003"]
    },
    {
        _id: "2",
        title: "Vegan Chickpea Curry",
        img: "/posts/post2.png",
        description: "This hearty and spicy chickpea curry is perfect for a quick dinner.",
        ingredients: [
            "Chickpeas",
            "Coconut milk",
            "Onion",
            "Garlic",
            "Ginger",
            "Curry powder"
        ],
        categories: ["Vegan", "Indian", "Dinner"],
        servings: "4",
        instructions: [
            "Sauté onions, garlic, and ginger.",
            "Add curry powder and cook for a minute.",
            "Stir in chickpeas and coconut milk.",
            "Simmer for 20 minutes.",
            "Serve with rice or naan."
        ],
        preparationTime: "10 mins",
        cookingTime: "20 mins",
        videoLink: null,
        user: {
            username: "veggiequeen",
            profileImg: "/avatars/girl2.png",
            fullName: "Veggie Queen"
        },
        comments: [],
        likes: ["uid004", "uid005"]
    },
    {
        _id: "3",
        title: "Creamy Mushroom Pasta",
        img: "/posts/post3.png",
        description: "Rich and creamy mushroom pasta that’s quick and satisfying.",
        ingredients: [
            "Fettuccine pasta",
            "Mushrooms",
            "Garlic",
            "Heavy cream",
            "Parmesan cheese",
            "Parsley"
        ],
        categories: ["Italian", "Comfort Food", "Dinner"],
        servings: "2",
        instructions: [
            "Cook pasta until al dente.",
            "Sauté mushrooms and garlic in butter.",
            "Add cream and simmer.",
            "Stir in cheese and cooked pasta.",
            "Garnish with parsley."
        ],
        preparationTime: "10 mins",
        cookingTime: "15 mins",
        videoLink: "https://youtube.com/example2",
        user: {
            username: "pastaking",
            profileImg: "/avatars/boy2.png",
            fullName: "Pasta King"
        },
        comments: [
            {
                _id: "c2",
                text: "Made this for date night ❤️",
                user: {
                    username: "romanticchef",
                    profileImg: "/avatars/girl3.png",
                    fullName: "Romantic Chef"
                }
            }
        ],
        likes: ["uid006", "uid007", "uid008"]
    },
    {
        _id: "4",
        title: "Strawberry Banana Smoothie",
        img: "/posts/post2.png",
        description: "Refreshing and healthy smoothie perfect for breakfast or post-workout!",
        ingredients: [
            "Banana",
            "Strawberries",
            "Greek yogurt",
            "Honey",
            "Almond milk"
        ],
        categories: ["Breakfast", "Healthy", "Smoothie"],
        servings: "1",
        instructions: [
            "Add all ingredients to a blender.",
            "Blend until smooth.",
            "Pour into a glass and enjoy!"
        ],
        preparationTime: "5 mins",
        cookingTime: "0 mins",
        videoLink: null,
        user: {
            username: "smoothielover",
            profileImg: "/avatars/girl4.png",
            fullName: "Smoothie Lover"
        },
        comments: [
            {
                _id: "c3",
                text: "So refreshing! I added chia seeds too!",
                user: {
                    username: "healthguru",
                    profileImg: "/avatars/boy3.png",
                    fullName: "Health Guru"
                }
            }
        ],
        likes: ["uid009", "uid010"]
    }
];


export const USERS_FOR_RIGHT_PANEL = [
    {
        _id: "1",
        fullName: "John Doe",
        username: "johndoe",
        profileImg: "/avatars/boy2.png",
    },
    {
        _id: "2",
        fullName: "Jane Doe",
        username: "janedoe",
        profileImg: "/avatars/girl1.png",
    },
    {
        _id: "3",
        fullName: "Bob Doe",
        username: "bobdoe",
        profileImg: "/avatars/boy3.png",
    },
    {
        _id: "4",
        fullName: "Daisy Doe",
        username: "daisydoe",
        profileImg: "/avatars/girl1.png",
    },
];