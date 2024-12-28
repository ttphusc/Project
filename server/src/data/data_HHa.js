const data = [
    {
      firstname: "John",
      lastname: "Doe",
      gender: "male",
      email: "john.doe@example.com",
      password: "password123",
      phone: "0909090901",
      attributes: {
        height: 175,
        weight: 75,
        sleepHours: 7,
        activityLevel: "Moderately Active",
        dietaryPreferences: "Vegetarian",
        healthCondition: "None",
        stressLevel: "Moderate",
        fitnessExperience: "Intermediate",
        fitnessGoal: "Muscle Gain",
        exercisePreferences: "Weightlifting",
      },
      posts: [
        {
          title: "Build Strength with Weightlifting",
          content: "A guide to building muscle with effective techniques...",
          tags: ["strength", "weightlifting", "muscle"],
          recipes: {
            name: "Protein Power Bowl",
            ingredients: ["quinoa", "chicken", "spinach", "almonds", "yogurt"],
            instructions:
              "Mix cooked quinoa with toppings for a high-protein meal.",
            cooktime: 20,
            calories: 500,
          },
          excercises: {
            name: "Barbell Squats",
            level: "Intermediate",
            equipment: "Barbell",
            primaryMuscles: ["legs", "glutes"],
            secondaryMuscles: ["core"],
            instructions:
              "Perform squats with proper form and controlled movements.",
          },
        },
      ],
    },
    {
      firstname: "Emily",
      lastname: "Smith",
      gender: "female",
      email: "emily.smith@example.com",
      password: "password456",
      phone: "0909090902",
      attributes: {
        height: 165,
        weight: 60,
        sleepHours: 8,
        activityLevel: "Lightly Active",
        dietaryPreferences: "Vegan",
        healthCondition: "None",
        stressLevel: "Low",
        fitnessExperience: "Beginner",
        fitnessGoal: "Weight Loss",
        exercisePreferences: "Yoga",
      },
      posts: [
        {
          title: "Relax and Tone with Yoga",
          content: "How yoga helps with stress reduction and fitness...",
          tags: ["yoga", "relaxation", "toning"],
          recipes: {
            name: "Vegan Smoothie Bowl",
            ingredients: [
              "frozen berries",
              "almond milk",
              "granola",
              "chia seeds",
            ],
            instructions:
              "Blend ingredients and top with granola for a refreshing meal.",
            cooktime: 10,
            calories: 250,
          },
          excercises: {
            name: "Sun Salutation",
            level: "Beginner",
            equipment: "Yoga Mat",
            primaryMuscles: ["full body"],
            secondaryMuscles: ["core"],
            instructions: "Flow through a series of poses with steady breathing.",
          },
        },
      ],
    },
    {
      firstname: "Michael",
      lastname: "Johnson",
      gender: "male",
      email: "michael.johnson@example.com",
      password: "password789",
      phone: "0909090903",
      attributes: {
        height: 185,
        weight: 85,
        sleepHours: 6,
        activityLevel: "Very Active",
        dietaryPreferences: "Omnivore",
        healthCondition: "High Blood Pressure",
        stressLevel: "High",
        fitnessExperience: "Advanced",
        fitnessGoal: "Endurance",
        exercisePreferences: "Running",
      },
      posts: [
        {
          title: "Boost Your Endurance with Long Runs",
          content: "Tips for improving stamina through running...",
          tags: ["running", "endurance", "advanced"],
          recipes: {
            name: "High-Energy Trail Mix",
            ingredients: ["nuts", "dried fruits", "dark chocolate", "seeds"],
            instructions: "Combine all ingredients for a portable energy snack.",
            cooktime: 5,
            calories: 400,
          },
          excercises: {
            name: "Interval Training",
            level: "Advanced",
            equipment: "None",
            primaryMuscles: ["legs", "lungs"],
            secondaryMuscles: ["core"],
            instructions: "Alternate between sprinting and jogging intervals.",
          },
        },
      ],
    },
    {
      firstname: "Sophia",
      lastname: "Williams",
      gender: "female",
      email: "sophia.williams@example.com",
      password: "password1234",
      phone: "0909090904",
      attributes: {
        height: 160,
        weight: 55,
        sleepHours: 7,
        activityLevel: "Moderately Active",
        dietaryPreferences: "Keto",
        healthCondition: "None",
        stressLevel: "Moderate",
        fitnessExperience: "Beginner",
        fitnessGoal: "Weight Loss",
        exercisePreferences: "Pilates",
      },
      posts: [
        {
          title: "Keto Snacks and Pilates Routine",
          content: "How to combine low-carb eating with Pilates...",
          tags: ["keto", "pilates", "weightloss"],
          recipes: {
            name: "Avocado Egg Cups",
            ingredients: ["avocado", "eggs", "bacon bits", "cheese"],
            instructions: "Bake eggs in avocado halves and top with cheese.",
            cooktime: 15,
            calories: 300,
          },
          excercises: {
            name: "Mat Pilates Core Workout",
            level: "Beginner",
            equipment: "Mat",
            primaryMuscles: ["core", "abs"],
            secondaryMuscles: ["back"],
            instructions: "Focus on controlled movements to build core strength.",
          },
        },
      ],
    },
    {
      firstname: "Chris",
      lastname: "Brown",
      gender: "male",
      email: "chris.brown@example.com",
      password: "password5678",
      phone: "0909090905",
      attributes: {
        height: 170,
        weight: 68,
        sleepHours: 8,
        activityLevel: "Lightly Active",
        dietaryPreferences: "Pescatarian",
        healthCondition: "None",
        stressLevel: "Low",
        fitnessExperience: "Intermediate",
        fitnessGoal: "Flexibility",
        exercisePreferences: "Stretching",
      },
      posts: [
        {
          title: "Improve Flexibility with Daily Stretching",
          content: "A guide to gentle stretching routines for all levels...",
          tags: ["flexibility", "stretching", "health"],
          recipes: {
            name: "Grilled Salmon Salad",
            ingredients: ["salmon", "mixed greens", "lemon dressing", "avocado"],
            instructions: "Grill salmon and serve over fresh greens.",
            cooktime: 25,
            calories: 450,
          },
          excercises: {
            name: "Full-Body Stretch Routine",
            level: "Intermediate",
            equipment: "Yoga Mat",
            primaryMuscles: ["full body"],
            secondaryMuscles: ["core"],
            instructions:
              "Hold each stretch for 20-30 seconds, focusing on breath.",
          },
        },
      ],
    },
    {
      firstname: "Oliver",
      lastname: "Taylor",
      gender: "male",
      email: "oliver.taylor@example.com",
      password: "password123",
      phone: "0909090906",
      attributes: {
        height: 180,
        weight: 80,
        sleepHours: 7,
        activityLevel: "Moderately Active",
        dietaryPreferences: "Vegetarian",
        healthCondition: "Asthma",
        stressLevel: "Moderate",
        fitnessExperience: "Advanced",
        fitnessGoal: "Endurance",
        exercisePreferences: "Cycling",
      },
      posts: [
        {
          title: "Cycling for Better Endurance",
          content: "How cycling can boost your stamina and improve health...",
          tags: ["cycling", "endurance", "advanced"],
          recipes: {
            name: "Vegetarian Power Smoothie",
            ingredients: ["banana", "spinach", "almond milk", "protein powder"],
            instructions: "Blend all ingredients until smooth.",
            cooktime: 5,
            calories: 300,
          },
          excercises: {
            name: "Long-Distance Cycling",
            level: "Advanced",
            equipment: "Road Bike",
            primaryMuscles: ["legs", "cardio"],
            secondaryMuscles: ["core"],
            instructions: "Focus on maintaining a steady pace for long rides.",
          },
        },
      ],
    },
    {
      firstname: "Amelia",
      lastname: "Davis",
      gender: "female",
      email: "amelia.davis@example.com",
      password: "password456",
      phone: "0909090907",
      attributes: {
        height: 165,
        weight: 58,
        sleepHours: 8,
        activityLevel: "Lightly Active",
        dietaryPreferences: "Vegan",
        healthCondition: "None",
        stressLevel: "Low",
        fitnessExperience: "Beginner",
        fitnessGoal: "Flexibility",
        exercisePreferences: "Yoga",
      },
      posts: [
        {
          title: "Beginner Yoga for Flexibility",
          content:
            "Simple yoga poses to improve flexibility and reduce stress...",
          tags: ["yoga", "flexibility", "beginner"],
          recipes: {
            name: "Vegan Buddha Bowl",
            ingredients: ["quinoa", "tofu", "avocado", "vegetables", "sauce"],
            instructions:
              "Assemble ingredients in a bowl and drizzle with sauce.",
            cooktime: 15,
            calories: 350,
          },
          excercises: {
            name: "Gentle Yoga Flow",
            level: "Beginner",
            equipment: "Yoga Mat",
            primaryMuscles: ["full body"],
            secondaryMuscles: ["core"],
            instructions: "Hold each pose for 20-30 seconds, focusing on breath.",
          },
        },
      ],
    },
    {
      firstname: "Liam",
      lastname: "Wilson",
      gender: "male",
      email: "liam.wilson@example.com",
      password: "password789",
      phone: "0909090908",
      attributes: {
        height: 175,
        weight: 70,
        sleepHours: 6,
        activityLevel: "Very Active",
        dietaryPreferences: "Omnivore",
        healthCondition: "None",
        stressLevel: "High",
        fitnessExperience: "Intermediate",
        fitnessGoal: "Strength",
        exercisePreferences: "Weightlifting",
      },
      posts: [
        {
          title: "Weightlifting Tips for Strength",
          content: "Maximize your strength training with these tips...",
          tags: ["weightlifting", "strength", "fitness"],
          recipes: {
            name: "High-Protein Chicken Wrap",
            ingredients: ["chicken breast", "whole-grain wrap", "veggies"],
            instructions: "Grill chicken, assemble wrap with veggies, and serve.",
            cooktime: 20,
            calories: 450,
          },
          excercises: {
            name: "Deadlifts",
            level: "Intermediate",
            equipment: "Barbell",
            primaryMuscles: ["back", "legs"],
            secondaryMuscles: ["core"],
            instructions:
              "Perform deadlifts with proper form and controlled motion.",
          },
        },
      ],
    },
    {
      firstname: "Sophia",
      lastname: "Martinez",
      gender: "female",
      email: "sophia.martinez@example.com",
      password: "password987",
      phone: "0909090909",
      attributes: {
        height: 160,
        weight: 54,
        sleepHours: 8,
        activityLevel: "Moderately Active",
        dietaryPreferences: "Keto",
        healthCondition: "None",
        stressLevel: "Moderate",
        fitnessExperience: "Beginner",
        fitnessGoal: "Weight Loss",
        exercisePreferences: "Pilates",
      },
      posts: [
        {
          title: "Pilates for Beginners",
          content: "Discover how Pilates can aid in weight loss...",
          tags: ["pilates", "weightloss", "beginner"],
          recipes: {
            name: "Keto Egg Muffins",
            ingredients: ["eggs", "spinach", "cheese", "bacon bits"],
            instructions: "Mix ingredients and bake in muffin tins.",
            cooktime: 20,
            calories: 250,
          },
          excercises: {
            name: "Core Pilates",
            level: "Beginner",
            equipment: "Mat",
            primaryMuscles: ["core", "abs"],
            secondaryMuscles: ["back"],
            instructions: "Perform controlled core movements for strength.",
          },
        },
      ],
    },
    {
      firstname: "Ethan",
      lastname: "Moore",
      gender: "male",
      email: "ethan.moore@example.com",
      password: "password654",
      phone: "0909090910",
      attributes: {
        height: 185,
        weight: 90,
        sleepHours: 7,
        activityLevel: "Very Active",
        dietaryPreferences: "Omnivore",
        healthCondition: "None",
        stressLevel: "High",
        fitnessExperience: "Advanced",
        fitnessGoal: "Muscle Gain",
        exercisePreferences: "Bodybuilding",
      },
      posts: [
        {
          title: "Bodybuilding Techniques for Advanced Lifters",
          content: "Focus on hypertrophy and strength gains...",
          tags: ["bodybuilding", "muscle", "advanced"],
          recipes: {
            name: "Grilled Steak with Veggies",
            ingredients: ["steak", "asparagus", "sweet potato"],
            instructions: "Grill steak and serve with roasted vegetables.",
            cooktime: 30,
            calories: 700,
          },
          excercises: {
            name: "Bench Press",
            level: "Advanced",
            equipment: "Barbell",
            primaryMuscles: ["chest", "triceps"],
            secondaryMuscles: ["shoulders"],
            instructions:
              "Press the barbell with a controlled motion and proper form.",
          },
        },
      ],
    },
    {
      firstname: "Isabella",
      lastname: "Garcia",
      gender: "female",
      email: "isabella.garcia@example.com",
      password: "secure123",
      phone: "0909090911",
      attributes: {
        height: 162,
        weight: 57,
        sleepHours: 8,
        activityLevel: "Lightly Active",
        dietaryPreferences: "Gluten-Free",
        healthCondition: "None",
        stressLevel: "Low",
        fitnessExperience: "Beginner",
        fitnessGoal: "Flexibility",
        exercisePreferences: "Yoga",
      },
      posts: [
        {
          title: "Yoga for a Calm Mind",
          content: "Discover how gentle yoga improves mental and physical well-being...",
          tags: ["yoga", "flexibility", "mentalhealth"],
          recipes: {
            name: "Gluten-Free Pancakes",
            ingredients: ["almond flour", "eggs", "milk", "honey"],
            instructions: "Mix ingredients and cook on a non-stick pan.",
            cooktime: 15,
            calories: 300,
          },
          excercises: {
            name: "Morning Yoga Flow",
            level: "Beginner",
            equipment: "Yoga Mat",
            primaryMuscles: ["core", "legs"],
            secondaryMuscles: ["arms"],
            instructions: "Follow a slow flow to wake up your body and mind.",
          },
        },
      ],
    },
    {
      firstname: "James",
      lastname: "Clark",
      gender: "male",
      email: "james.clark@example.com",
      password: "password321",
      phone: "0909090912",
      attributes: {
        height: 178,
        weight: 80,
        sleepHours: 7,
        activityLevel: "Very Active",
        dietaryPreferences: "High Protein",
        healthCondition: "Diabetes",
        stressLevel: "Moderate",
        fitnessExperience: "Intermediate",
        fitnessGoal: "Weight Loss",
        exercisePreferences: "HIIT",
      },
      posts: [
        {
          title: "HIIT for Effective Weight Loss",
          content: "Tips and tricks for making the most of high-intensity workouts...",
          tags: ["hiit", "weightloss", "highprotein"],
          recipes: {
            name: "Grilled Chicken Salad",
            ingredients: ["chicken breast", "mixed greens", "olive oil", "lemon"],
            instructions: "Grill chicken and toss with fresh salad greens.",
            cooktime: 20,
            calories: 400,
          },
          excercises: {
            name: "HIIT Cardio Circuit",
            level: "Intermediate",
            equipment: "None",
            primaryMuscles: ["full body"],
            secondaryMuscles: ["cardio"],
            instructions: "Alternate 30 seconds of intense exercise with 15 seconds of rest.",
          },
        },
      ],
    },
    {
      firstname: "Mia",
      lastname: "Lee",
      gender: "female",
      email: "mia.lee@example.com",
      password: "securepass456",
      phone: "0909090913",
      attributes: {
        height: 170,
        weight: 65,
        sleepHours: 7,
        activityLevel: "Moderately Active",
        dietaryPreferences: "Paleo",
        healthCondition: "None",
        stressLevel: "Moderate",
        fitnessExperience: "Advanced",
        fitnessGoal: "Strength",
        exercisePreferences: "Weightlifting",
      },
      posts: [
        {
          title: "Paleo Diet and Strength Training",
          content: "Pair your weightlifting routine with a Paleo diet...",
          tags: ["paleo", "strength", "fitness"],
          recipes: {
            name: "Paleo Energy Bars",
            ingredients: ["nuts", "dates", "coconut", "cacao nibs"],
            instructions: "Blend and shape ingredients into bars, then chill.",
            cooktime: 10,
            calories: 250,
          },
          excercises: {
            name: "Powerlifting Basics",
            level: "Advanced",
            equipment: "Barbell",
            primaryMuscles: ["legs", "back"],
            secondaryMuscles: ["core"],
            instructions: "Focus on proper form for deadlifts and squats.",
          },
        },
      ],
    },
    {
      firstname: "Lucas",
      lastname: "Harris",
      gender: "male",
      email: "lucas.harris@example.com",
      password: "password7890",
      phone: "0909090914",
      attributes: {
        height: 182,
        weight: 88,
        sleepHours: 6,
        activityLevel: "Very Active",
        dietaryPreferences: "Omnivore",
        healthCondition: "High Blood Pressure",
        stressLevel: "High",
        fitnessExperience: "Intermediate",
        fitnessGoal: "Endurance",
        exercisePreferences: "Running",
      },
      posts: [
        {
          title: "Marathon Training for Beginners",
          content: "Steps to prepare for your first marathon...",
          tags: ["running", "endurance", "marathon"],
          recipes: {
            name: "High-Carb Pasta",
            ingredients: ["whole wheat pasta", "tomato sauce", "parmesan"],
            instructions: "Cook pasta, add sauce, and garnish with cheese.",
            cooktime: 25,
            calories: 500,
          },
          excercises: {
            name: "Long-Distance Runs",
            level: "Intermediate",
            equipment: "Running Shoes",
            primaryMuscles: ["legs", "cardio"],
            secondaryMuscles: ["core"],
            instructions: "Start with shorter distances and gradually increase mileage.",
          },
        },
      ],
    },
    {
      firstname: "Emma",
      lastname: "Robinson",
      gender: "female",
      email: "emma.robinson@example.com",
      password: "emmapass123",
      phone: "0909090915",
      attributes: {
        height: 158,
        weight: 50,
        sleepHours: 8,
        activityLevel: "Lightly Active",
        dietaryPreferences: "Vegetarian",
        healthCondition: "None",
        stressLevel: "Low",
        fitnessExperience: "Beginner",
        fitnessGoal: "Flexibility",
        exercisePreferences: "Stretching",
      },
      posts: [
        {
          title: "Daily Stretching for Beginners",
          content: "Learn how to improve flexibility with these simple stretches...",
          tags: ["stretching", "flexibility", "health"],
          recipes: {
            name: "Vegetarian Quinoa Bowl",
            ingredients: ["quinoa", "chickpeas", "avocado", "vegetables"],
            instructions: "Cook quinoa and mix with toppings for a quick meal.",
            cooktime: 15,
            calories: 320,
          },
          excercises: {
            name: "Full-Body Stretch Routine",
            level: "Beginner",
            equipment: "Yoga Mat",
            primaryMuscles: ["full body"],
            secondaryMuscles: ["core"],
            instructions: "Hold each stretch for 30 seconds to improve flexibility.",
          },
        },
      ],
    },
    {
      firstname: "Charlotte",
      lastname: "White",
      gender: "female",
      email: "charlotte.white@example.com",
      password: "charlotte123",
      phone: "0909090916",
      attributes: {
        height: 168,
        weight: 62,
        sleepHours: 7,
        activityLevel: "Moderately Active",
        dietaryPreferences: "Mediterranean",
        healthCondition: "None",
        stressLevel: "Low",
        fitnessExperience: "Intermediate",
        fitnessGoal: "Weight Maintenance",
        exercisePreferences: "Swimming",
      },
      posts: [
        {
          title: "Mediterranean Diet for a Balanced Lifestyle",
          content: "Explore the benefits of the Mediterranean diet for weight management...",
          tags: ["mediterranean", "healthy", "weightmaintenance"],
          recipes: {
            name: "Greek Salad with Feta",
            ingredients: ["tomatoes", "cucumbers", "feta cheese", "olive oil"],
            instructions: "Mix ingredients and drizzle with olive oil.",
            cooktime: 10,
            calories: 250,
          },
          excercises: {
            name: "Beginner's Swim Drills",
            level: "Intermediate",
            equipment: "Swim Goggles",
            primaryMuscles: ["full body"],
            secondaryMuscles: ["core"],
            instructions: "Practice freestyle and backstroke techniques.",
          },
        },
      ],
    },
    {
      firstname: "Daniel",
      lastname: "King",
      gender: "male",
      email: "daniel.king@example.com",
      password: "danielpass456",
      phone: "0909090917",
      attributes: {
        height: 185,
        weight: 92,
        sleepHours: 6,
        activityLevel: "Very Active",
        dietaryPreferences: "High Carb",
        healthCondition: "None",
        stressLevel: "Moderate",
        fitnessExperience: "Advanced",
        fitnessGoal: "Muscle Gain",
        exercisePreferences: "Bodybuilding",
      },
      posts: [
        {
          title: "Carb-Loading for Muscle Growth",
          content: "How to use a high-carb diet to maximize muscle gains...",
          tags: ["carbloading", "muscle", "fitness"],
          recipes: {
            name: "High-Carb Protein Bowl",
            ingredients: ["brown rice", "grilled chicken", "vegetables"],
            instructions: "Cook rice, grill chicken, and combine with veggies.",
            cooktime: 20,
            calories: 600,
          },
          excercises: {
            name: "Advanced Weightlifting Routine",
            level: "Advanced",
            equipment: "Dumbbells",
            primaryMuscles: ["arms", "legs"],
            secondaryMuscles: ["core"],
            instructions: "Perform heavy sets with proper rest intervals.",
          },
        },
      ],
    },
    {
      firstname: "Emily",
      lastname: "Brown",
      gender: "female",
      email: "emily.brown@example.com",
      password: "emilysecure123",
      phone: "0909090918",
      attributes: {
        height: 158,
        weight: 53,
        sleepHours: 8,
        activityLevel: "Lightly Active",
        dietaryPreferences: "Vegan",
        healthCondition: "None",
        stressLevel: "Low",
        fitnessExperience: "Beginner",
        fitnessGoal: "Flexibility",
        exercisePreferences: "Pilates",
      },
      posts: [
        {
          title: "Vegan Lifestyle and Pilates",
          content: "Pairing a vegan diet with Pilates for optimal flexibility...",
          tags: ["vegan", "pilates", "flexibility"],
          recipes: {
            name: "Vegan Protein Smoothie",
            ingredients: ["soy milk", "banana", "spinach", "protein powder"],
            instructions: "Blend all ingredients until smooth.",
            cooktime: 5,
            calories: 300,
          },
          excercises: {
            name: "Basic Pilates Routine",
            level: "Beginner",
            equipment: "Yoga Mat",
            primaryMuscles: ["core", "legs"],
            secondaryMuscles: ["arms"],
            instructions: "Focus on core strength and slow movements.",
          },
        },
      ],
    },
    {
      firstname: "Benjamin",
      lastname: "Scott",
      gender: "male",
      email: "benjamin.scott@example.com",
      password: "benjaminpass789",
      phone: "0909090919",
      attributes: {
        height: 177,
        weight: 75,
        sleepHours: 7,
        activityLevel: "Moderately Active",
        dietaryPreferences: "Balanced",
        healthCondition: "None",
        stressLevel: "Moderate",
        fitnessExperience: "Intermediate",
        fitnessGoal: "Weight Loss",
        exercisePreferences: "Cycling",
      },
      posts: [
        {
          title: "Cycling for Fat Burning",
          content: "Effective cycling techniques for sustainable weight loss...",
          tags: ["cycling", "fatburn", "fitness"],
          recipes: {
            name: "Balanced Breakfast Bowl",
            ingredients: ["oats", "milk", "fruits", "honey"],
            instructions: "Combine all ingredients for a healthy breakfast.",
            cooktime: 10,
            calories: 350,
          },
          excercises: {
            name: "Interval Cycling",
            level: "Intermediate",
            equipment: "Bike",
            primaryMuscles: ["legs", "cardio"],
            secondaryMuscles: ["core"],
            instructions: "Alternate between high-intensity sprints and low-intensity cycling.",
          },
        },
      ],
    },
    {
      firstname: "Ava",
      lastname: "Green",
      gender: "female",
      email: "ava.green@example.com",
      password: "avapass123",
      phone: "0909090920",
      attributes: {
        height: 160,
        weight: 52,
        sleepHours: 8,
        activityLevel: "Lightly Active",
        dietaryPreferences: "Low Carb",
        healthCondition: "None",
        stressLevel: "Low",
        fitnessExperience: "Beginner",
        fitnessGoal: "Weight Loss",
        exercisePreferences: "Walking",
      },
      posts: [
        {
          title: "Low-Carb Diet and Walking for Weight Loss",
          content: "How combining a low-carb diet with daily walking helps shed pounds...",
          tags: ["lowcarb", "walking", "weightloss"],
          recipes: {
            name: "Low-Carb Egg Muffins",
            ingredients: ["eggs", "cheese", "spinach", "bell peppers"],
            instructions: "Bake the mixture in a muffin tin.",
            cooktime: 20,
            calories: 200,
          },
          excercises: {
            name: "Daily Walking Routine",
            level: "Beginner",
            equipment: "None",
            primaryMuscles: ["legs"],
            secondaryMuscles: ["cardio"],
            instructions: "Walk at a steady pace for 30-60 minutes daily.",
          },
        },
      ],
    },
  ];
    
    console.log(data);
    