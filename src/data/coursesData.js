import math from "../assets/CourseImg/math-2.png";
import paint from "../assets/CourseImg/paint.png";
import finance from "../assets/CourseImg/finance-3.png";
import Dmarket from "../assets/CourseImg/Dmarket.png";
import coding from "../assets/CourseImg/coding.png";
import python from "../assets/CourseImg/python.png";

export const COURSES = [
  {
    id: 1,
    category: "Programming",
    title: "Python for Kids: Build Your First Game!",
    image: python,
    desc: "Learn to code by building real games. Perfect for beginners aged 7-16. Dive into Python fundamentals and game mechanics!",
    duration: "4 hours",
    difficulty: "Beginner",
    prerequisites: ["A computer with internet access", "Basic typing skills"],
    learningObjectives: [
      "Understand core programming concepts",
      "Write scripts using Python syntax",
      "Use loops, variables, and logic",
      "Build a fully playable text-based game"
    ],
    aiTutor: {
      name: "Robo-Py",
      role: "AI Coding Buddy",
      avatar: one
    },
    xpPerModule: 50,
    totalXP: 300,
    badge: { name: "Python Pioneer", icon: "code" },
    syllabus: [
      {
        title: "Module 1: Hello Python!",
        desc: "Learn what Python is and write your first lines of code.",
        xpReward: 50,
        contentSections: [
          {
            type: "story",
            title: "Meet Alex the Inventor",
            content: "Alex is 11 years old and loves video games. One day Alex thought: 'What if I could BUILD my own game instead of just playing them?' Alex's teacher said: 'You can! All you need is a language called Python.' This is YOUR story too — by the end of this course, you'll build your very own game from scratch!"
          },
          {
            type: "concept",
            title: "What is Python?",
            content: "Python is a programming language — a special set of words and rules you use to talk to computers. Imagine you have a robot friend, but it only understands one language: Python! If you want the robot to dance, draw, or solve math problems, you have to write instructions in Python. The best part? Python was designed to look almost like regular English, so it's one of the easiest languages to learn."
          },
          {
            type: "fact",
            title: "Fun Fact!",
            content: "Python wasn't named after the snake! It was named after a funny British comedy show called 'Monty Python's Flying Circus'. The creator, Guido van Rossum, was watching it while writing Python and thought the name was fun!"
          },
          {
            type: "example",
            title: "Your First Command: print()",
            content: "The print() command tells the computer to display text on the screen. Try this:\n\nprint('Hello World!')\n\nWhen you run this, the computer will show: Hello World!\n\nYou can print anything you want:\nprint('My name is Alex!')\nprint('I am learning Python!')\n\nNotice how the text is always wrapped in quotes? That tells Python: 'Hey, this is text, not a command!'"
          },
          {
            type: "tip",
            title: "Pro Tip: Don't Forget the Quotes!",
            content: "A super common mistake for beginners is forgetting the quotes around text. If you write print(Hello) without quotes, Python will get confused and show an error. Always wrap your text in single quotes ('Hello') or double quotes (\"Hello\") — both work!"
          },
          {
            type: "activity",
            title: "Try It Yourself!",
            content: "If you have Python on your computer, open it and try typing these commands one at a time:\n\n1. print('Hello World!')\n2. print('My name is [YOUR NAME]!')\n3. print('I am learning to code!')\n4. print('Python is awesome!')\n\nWatch what happens after each one. You just made a computer talk!"
          },
          {
            type: "recap",
            title: "Module 1 Recap",
            content: "Let's review what you learned:\n\n• Python is a programming language used to give instructions to computers\n• It was named after a comedy show, not the snake!\n• The print() command displays text on screen\n• Text must be wrapped in quotes (single or double)\n• You just wrote your first real code — you're officially a coder!"
          }
        ],
        exercises: [
          {
            type: "mcq",
            question: "What is Python?",
            options: ["A type of snake", "A programming language for talking to computers", "A video game engine", "A web browser"],
            answer: "A programming language for talking to computers"
          },
          {
            type: "true-false",
            question: "Python was named after the snake.",
            answer: false
          },
          {
            type: "fill-blank",
            question: "The ___ command displays text on the screen in Python.",
            answer: "print"
          },
          {
            type: "mcq",
            question: "Why do we need quotes around text in print()?",
            options: ["To make it look pretty", "So Python knows it's text, not a command", "Quotes are optional", "To make the text bigger"],
            answer: "So Python knows it's text, not a command"
          },
          {
            type: "match",
            question: "Match the Python terms to their meanings:",
            pairs: [
              { term: "Python", definition: "A programming language" },
              { term: "print()", definition: "Displays text on screen" },
              { term: "Quotes", definition: "Wrap around text in code" }
            ]
          }
        ]
      },
      {
        title: "Module 2: Variables & Data Types",
        desc: "Store numbers and text in memory like a pro.",
        xpReward: 50,
        contentSections: [
          {
            type: "story",
            title: "Alex Needs a Scoreboard",
            content: "Alex's game is coming along, but there's a problem — how does the computer remember the player's score? When a player gets 10 points, where does that number go? Alex needs a way to STORE information. That's exactly what variables do!"
          },
          {
            type: "concept",
            title: "What is a Variable?",
            content: "Think of a variable as a labeled box where you can keep things. If you have a box labeled 'score' and you put the number 10 inside it, your variable score is now equal to 10!\n\nIn Python, you create a variable like this:\nscore = 10\nplayer_name = 'Alex'\n\nThe = sign doesn't mean 'equals' in math — it means 'put this value into this box'. So score = 10 means 'create a box called score and put 10 inside it'."
          },
          {
            type: "concept",
            title: "Different Types of Data",
            content: "Computers are picky — they need to know what KIND of stuff is in each box:\n\n• Integers (int): Whole numbers like 5, 42, or 1000. Great for scores!\n• Strings (str): Text wrapped in quotes like 'Hello' or 'Alex'. Used for names and messages!\n• Floats (float): Decimal numbers like 3.14 or 99.9. Used for prices and precise measurements!\n• Booleans (bool): Just True or False. Like a light switch — on or off!\n\nPython is smart enough to figure out the type automatically when you create a variable."
          },
          {
            type: "example",
            title: "Variables in Action",
            content: "Watch how Alex uses variables in the game:\n\nplayer_name = 'Alex'\nscore = 0\nlives = 3\n\nscore = score + 10\nprint('Score:', score)\n\nThe computer will show: Score: 10\n\nNotice how score = score + 10 works: Python looks at the OLD value of score (0), adds 10, and puts the NEW value (10) back in the box!"
          },
          {
            type: "fact",
            title: "Your Brain is Full of Variables!",
            content: "Your brain works just like a computer with variables! Right now, your brain has a variable called 'my_name' storing your name, a variable called 'my_age' storing your age, and a variable called 'favorite_color' storing your favorite color. You just don't think about them as 'variables' — but that's exactly what they are!"
          },
          {
            type: "tip",
            title: "Naming Your Variables",
            content: "Good variable names describe what's inside the box:\n\nGood: player_score, user_name, lives_remaining\nBad: x, thing, abc123\n\nRules for Python variable names:\n• No spaces! Use underscores: player_name (not player name)\n• Can't start with a number: 1score is wrong, score1 is fine\n• Python is case-sensitive: Score and score are DIFFERENT variables!"
          },
          {
            type: "recap",
            title: "Module 2 Recap",
            content: "Let's review what you learned:\n\n• Variables are labeled boxes that store data\n• The = sign means 'put this value in the box'\n• Integers are whole numbers, Strings are text, Floats are decimals, Booleans are True/False\n• You can update a variable: score = score + 10\n• Use descriptive names: player_score is better than x\n• Python is case-sensitive: score and Score are different!"
          }
        ],
        exercises: [
          {
            type: "mcq",
            question: "What is a variable in programming?",
            options: ["A type of error message", "A labeled box for storing data", "A math formula", "A Python command"],
            answer: "A labeled box for storing data"
          },
          {
            type: "match",
            question: "Match each data type to its example:",
            pairs: [
              { term: "Integer", definition: "The number 42" },
              { term: "String", definition: "The text 'Hello'" },
              { term: "Float", definition: "The number 3.14" },
              { term: "Boolean", definition: "True or False" }
            ]
          },
          {
            type: "fill-blank",
            question: "If score = 4 + 6, the value stored in score is ___.",
            answer: "10"
          },
          {
            type: "true-false",
            question: "In Python, the variable names 'Score' and 'score' are exactly the same thing.",
            answer: false
          },
          {
            type: "mcq",
            question: "Which of these is a GOOD variable name?",
            options: ["1player", "my score", "player_score", "p"],
            answer: "player_score"
          }
        ]
      },
      {
        title: "Module 3: If-Statements & Logic",
        desc: "Make your code smart with decisions and conditions.",
        xpReward: 50,
        contentSections: [
          {
            type: "story",
            title: "Alex's Game Needs a Brain",
            content: "Alex's game can store scores now — awesome! But there's a new problem. When a player reaches 100 points, the game should say 'YOU WIN!' And when the player loses all their lives, it should say 'GAME OVER'. But how does the computer know WHEN to do these things? It needs the ability to make decisions. That's what if-statements are for!"
          },
          {
            type: "concept",
            title: "Making Choices with 'if'",
            content: "An if-statement lets your code make decisions, just like your brain does every day!\n\nIn real life: 'IF it's raining, THEN take an umbrella.'\nIn Python: if score > 100:\n              print('You win!')\n\nThe computer checks the condition (is score greater than 100?). If it's TRUE, it runs the code below. If it's FALSE, it skips it entirely."
          },
          {
            type: "concept",
            title: "Adding 'else' and 'elif'",
            content: "What if you want to do something DIFFERENT when the condition is false?\n\nif score > 100:\n    print('You win!')\nelse:\n    print('Keep trying!')\n\nAnd what if you have MULTIPLE conditions?\n\nif score > 100:\n    print('Amazing!')\nelif score > 50:\n    print('Getting close!')\nelse:\n    print('Keep going!')\n\n'elif' is short for 'else if' — it checks another condition if the first one was false."
          },
          {
            type: "fact",
            title: "If-Statements Are EVERYWHERE!",
            content: "Video games use MILLIONS of if-statements!\n\n• IF Mario hits a Goomba → he loses a life\n• IF Mario grabs a mushroom → he grows big\n• IF the timer reaches zero → Game Over!\n• IF the player presses the jump button → Mario jumps\n\nEvery single thing that happens in a game is controlled by if-statements working together!"
          },
          {
            type: "example",
            title: "Comparison Operators",
            content: "To write conditions, you need comparison operators:\n\n>  means 'greater than'       (10 > 5 is True)\n<  means 'less than'          (3 < 7 is True)\n== means 'equal to'           (5 == 5 is True)\n!= means 'not equal to'       (5 != 3 is True)\n>= means 'greater or equal'   (10 >= 10 is True)\n<= means 'less or equal'      (4 <= 9 is True)\n\nNotice: Checking equality uses == (double equals), NOT = (single equals). Single = is for assigning variables!"
          },
          {
            type: "tip",
            title: "The Colon is Crucial!",
            content: "Every if, elif, and else line MUST end with a colon (:)\n\nCorrect: if score > 10:\nWrong:   if score > 10\n\nAlso, the code that runs inside the if-statement must be indented (pushed to the right with spaces). Python uses indentation to know which code belongs inside the if-statement!"
          },
          {
            type: "recap",
            title: "Module 3 Recap",
            content: "Let's review what you learned:\n\n• If-statements let code make decisions based on conditions\n• Use 'else' when you want something to happen when the condition is false\n• Use 'elif' to check multiple conditions\n• Comparison operators: > < == != >= <=\n• Double equals (==) checks equality, single equals (=) assigns variables\n• Always end if/elif/else with a colon (:)\n• Indent the code inside your if-statement!"
          }
        ],
        exercises: [
          {
            type: "mcq",
            question: "What do if-statements allow a program to do?",
            options: ["Crash the computer", "Make decisions based on conditions", "Only print text", "Store variables"],
            answer: "Make decisions based on conditions"
          },
          {
            type: "true-false",
            question: "Every if-statement line in Python must end with a colon (:).",
            answer: true
          },
          {
            type: "match",
            question: "Match each comparison operator to its meaning:",
            pairs: [
              { term: ">", definition: "Greater than" },
              { term: "==", definition: "Equal to" },
              { term: "!=", definition: "Not equal to" },
              { term: "<", definition: "Less than" }
            ]
          },
          {
            type: "fill-blank",
            question: "The keyword ___ is short for 'else if' in Python.",
            answer: "elif"
          },
          {
            type: "mcq",
            question: "If score is 75, what will this code print?\nif score > 100:\n    print('Winner!')\nelif score > 50:\n    print('Almost there!')\nelse:\n    print('Keep going!')",
            options: ["Winner!", "Almost there!", "Keep going!", "Nothing"],
            answer: "Almost there!"
          }
        ]
      },
      {
        title: "Module 4: Build a Guessing Game!",
        desc: "Combine everything to build your first real game from scratch!",
        xpReward: 50,
        contentSections: [
          {
            type: "story",
            title: "Alex's Big Moment",
            content: "The day has finally come. Alex knows about print(), variables, and if-statements. Now it's time to combine ALL of these skills to build a real, playable game! The game is called 'Guess the Number' — the computer picks a secret number, and the player has to guess it. After each guess, the computer gives hints: 'Too High!' or 'Too Low!' Let's build it!"
          },
          {
            type: "concept",
            title: "What Are Loops?",
            content: "A loop lets you run the same code over and over again. Without a loop, the player would only get ONE guess — that's no fun!\n\nThe 'while' loop keeps running as long as a condition is True:\n\nwhile guess != secret:\n    guess = input('Try again: ')\n\nThis keeps asking for guesses until the player gets it right. When they finally guess correctly, the loop stops!"
          },
          {
            type: "concept",
            title: "Getting User Input",
            content: "The input() command lets the player type something into the game:\n\nguess = input('Enter your guess: ')\n\nWhatever the player types gets stored in the variable 'guess'. There's one tricky thing though — input() always gives you a String (text), even if the player types a number! To turn it into a number for comparison, we use int():\n\nguess = int(input('Enter your guess: '))"
          },
          {
            type: "example",
            title: "The Complete Game Code",
            content: "Here's the full guessing game:\n\nimport random\n\nsecret = random.randint(1, 20)\nprint('I picked a number between 1 and 20!')\n\nguess = 0\nattempts = 0\n\nwhile guess != secret:\n    guess = int(input('Your guess: '))\n    attempts = attempts + 1\n    \n    if guess > secret:\n        print('Too High! Try lower.')\n    elif guess < secret:\n        print('Too Low! Try higher.')\n    else:\n        print('YOU GOT IT!')\n        print('It took you', attempts, 'guesses!')\n\nEvery concept you learned — print, variables, if/elif/else, loops, input — is used here!"
          },
          {
            type: "fact",
            title: "Random Numbers in Games",
            content: "The random.randint(1, 20) function picks a random number between 1 and 20. Every game you've ever played uses random numbers! Minecraft uses them to generate worlds, Pokémon uses them to decide if you catch a Pokémon, and card games use them to shuffle the deck. Randomness makes games exciting because you never know what will happen!"
          },
          {
            type: "activity",
            title: "Upgrade Your Game!",
            content: "Once your basic game works, try these upgrades:\n\nEasy: Change the range from 1-20 to 1-100 for a harder game\nMedium: Limit the player to only 5 guesses. If they run out, print 'Game Over!'\nHard: Add a scoring system — fewer guesses = higher score!\nExpert: Ask the player if they want to play again after winning!\n\nEvery upgrade uses the same skills you've already learned — just combined in creative ways!"
          },
          {
            type: "recap",
            title: "Course Complete Recap!",
            content: "Congratulations — you've learned all the fundamentals of Python!\n\n• print() displays text on screen\n• Variables store data in labeled boxes\n• Data types: Integers, Strings, Floats, Booleans\n• If/elif/else make decisions based on conditions\n• Comparison operators: > < == != >= <=\n• While loops repeat code until a condition is false\n• input() gets information from the user\n• int() converts text to a number\n• random.randint() generates random numbers\n\nYou're ready to build your own games — the sky is the limit!"
          }
        ],
        exercises: [
          {
            type: "fill-blank",
            question: "The ___ command lets the player type in an answer during a game.",
            answer: "input"
          },
          {
            type: "mcq",
            question: "Why do we use a 'while' loop in the guessing game?",
            options: ["To make the screen colorful", "To let the player guess multiple times until they're right", "To stop the game immediately", "To make the game harder to read"],
            answer: "To let the player guess multiple times until they're right"
          },
          {
            type: "mcq",
            question: "If the secret number is 5 and the player guesses 8, what should the game say?",
            options: ["Too Low!", "Too High!", "You Win!", "Error!"],
            answer: "Too High!"
          },
          {
            type: "true-false",
            question: "The input() function always returns a number, so you never need int().",
            answer: false
          },
          {
            type: "match",
            question: "Match each Python concept to what it does in the game:",
            pairs: [
              { term: "while loop", definition: "Repeats until player guesses right" },
              { term: "input()", definition: "Gets the player's guess" },
              { term: "random.randint()", definition: "Picks the secret number" },
              { term: "if/elif/else", definition: "Checks if guess is too high or low" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 2,
    category: "Mathematics",
    title: "Math Magic: Puzzles & Logic",
    image: math,
    desc: "Develop critical thinking by solving puzzles, identifying patterns, and mastering logic.",
    duration: "3.5 hours",
    difficulty: "All Levels",
    prerequisites: ["Basic arithmetic"],
    learningObjectives: [
      "Identify numerical patterns",
      "Understand basic geometry",
      "Solve deductive logic puzzles",
      "Apply algorithmic thinking"
    ],
    aiTutor: {
      name: "Count AI-Cula",
      role: "AI Math Genius",
      avatar: two
    },
    xpPerModule: 50,
    totalXP: 300,
    badge: { name: "Math Wizard", icon: "sparkles" },
    syllabus: [
      {
        title: "Module 1: Number Patterns",
        desc: "Discover secret patterns to predict the future!",
        xpReward: 50,
        contentSections: [
          {
            type: "story",
            title: "The Codebreaker's Secret",
            content: "Agent Maya found an ancient chest locked with a secret combination: 2, 4, 6, 8, __. The guards were baffled, but Maya smiled: 'It's just a pattern! Add 2 each time.' She typed 10, and the chest popped open! Math isn't just about big numbers — it's about seeing secret rules that unlock mysteries!"
          },
          {
            type: "concept",
            title: "The Magic of Sequences",
            content: "A sequence is a list of numbers that follows a clear rule. When you know the rule, you can predict what comes next! For example:\n\n• Rule (+5): 5, 10, 15, 20, 25...\n• Rule (×2): 2, 4, 8, 16, 32...\n• Rule (-3): 20, 17, 14, 11, 8..."
          },
          {
            type: "fact",
            title: "Nature Loves Fibonacci!",
            content: "The Fibonacci sequence starts like this: 1, 1, 2, 3, 5, 8, 13... where each number is the sum of the two before it! Sunflowers, pinecones, seashells, and even storm whirlwinds follow this exact sequence!"
          },
          {
            type: "example",
            title: "Finding the Secret Rule",
            content: "Look at this sequence: 3, 6, 12, 24, __\n\nHow do we get from 3 to 6? We multiply by 2 (or add 3).\nHow do we get from 6 to 12? We multiply by 2! (Adding 3 would give 9, so the rule MUST be ×2).\nTherefore, 24 × 2 = 48! The secret number is 48!"
          },
          {
            type: "tip",
            title: "Pro Tip: Look at the Differences",
            content: "If you're stuck on a pattern, subtract adjacent numbers (6 - 3 = 3, 12 - 6 = 6). If the differences grow, check for multiplication!"
          },
          {
            type: "activity",
            title: "Pattern Detective Challenge",
            content: "Can you solve these two secret sequences in your head?\n\n1) 1, 4, 9, 16, 25, __ (Hint: 1×1, 2×2, 3×3...)\n2) 100, 90, 80, 70, __ (Hint: Going down by...)\n\nAnswers: 36 and 60!"
          },
          {
            type: "recap",
            title: "Module 1 Recap",
            content: "Key takeaways:\n• A sequence follows a set rule (+, -, ×, ÷)\n• Test your rule on ALL numbers to make sure it works\n• Fibonacci (1,1,2,3,5,8...) is everywhere in nature!\n• Patterns let us predict future numbers with 100% accuracy!"
          }
        ],
        exercises: [
          {
            type: "mcq",
            question: "What is the next number in: 5, 10, 15, 20...?",
            options: ["22", "25", "30", "100"],
            answer: "25"
          },
          {
            type: "fill-blank",
            question: "In the sequence 2, 4, 8, 16, the next number is ___.",
            answer: "32"
          },
          {
            type: "true-false",
            question: "The Fibonacci sequence (1, 1, 2, 3, 5, 8...) appears in sunflower seeds and pinecones.",
            answer: true
          },
          {
            type: "match",
            question: "Match each sequence to its rule:",
            pairs: [
              { term: "3, 6, 9, 12", definition: "Add 3" },
              { term: "2, 4, 8, 16", definition: "Multiply by 2" },
              { term: "50, 40, 30", definition: "Subtract 10" }
            ]
          },
          {
            type: "mcq",
            question: "What do we call a list of numbers that follows a mathematical rule?",
            options: ["A mess", "A sequence", "A variable", "A loop"],
            answer: "A sequence"
          }
        ]
      },
      {
        title: "Module 2: 2D and 3D Geometry",
        desc: "Explore shapes in flat space and 3D worlds.",
        xpReward: 50,
        contentSections: [
          {
            type: "story",
            title: "Designing Minecraft Worlds",
            content: "Ever wondered how 3D games like Minecraft or Roblox are built? Game developers start with 2D flat shapes — squares and triangles — and extrude them into 3D blocks (cubes and pyramids). Geometry is the secret engine behind every 3D graphic you see!"
          },
          {
            type: "concept",
            title: "Flat (2D) vs Solid (3D)",
            content: "• 2D Shapes have Height and Width (Flat on paper): Square, Circle, Triangle, Hexagon (6 sides).\n• 3D Shapes add Depth (Solid in hand): Cube, Sphere, Pyramid, Cylinder."
          },
          {
            type: "fact",
            title: "Angles & Right Angles",
            content: "An angle is formed where two lines meet. A corner of a square is a 90° angle, called a Right Angle. Look around your room — doors, books, and screens are full of right angles!"
          },
          {
            type: "example",
            title: "Counting Sides & Vertices",
            content: "• Triangle: 3 sides, 3 corners (vertices)\n• Square / Rectangle: 4 sides, 4 vertices\n• Hexagon: 6 sides, 6 vertices\n• Octagon (Stop sign): 8 sides, 8 vertices"
          },
          {
            type: "tip",
            title: "Cube Secret",
            content: "A 3D cube has 6 flat square faces, 8 corners (vertices), and 12 straight edges!"
          },
          {
            type: "recap",
            title: "Module 2 Recap",
            content: "• 2D = flat (length & width), 3D = solid (length, width & depth)\n• Hexagons have 6 sides, Octagons have 8\n• 90° angles are Right Angles\n• Cubes have 6 faces, 8 vertices, 12 edges!"
          }
        ],
        exercises: [
          {
            type: "mcq",
            question: "How many sides does a hexagon have?",
            options: ["4", "5", "6", "8"],
            answer: "6"
          },
          {
            type: "fill-blank",
            question: "A 3D square is called a ___.",
            answer: "cube"
          },
          {
            type: "true-false",
            question: "A right angle is exactly 90 degrees.",
            answer: true
          },
          {
            type: "match",
            question: "Match the shape to its side count:",
            pairs: [
              { term: "Triangle", definition: "3 sides" },
              { term: "Pentagon", definition: "5 sides" },
              { term: "Hexagon", definition: "6 sides" },
              { term: "Octagon", definition: "8 sides" }
            ]
          },
          {
            type: "mcq",
            question: "How many faces does a standard cube have?",
            options: ["4", "6", "8", "12"],
            answer: "6"
          }
        ]
      },
      {
        title: "Module 3: Logic Puzzles",
        desc: "Solve mysteries using deduction.",
        xpReward: 50,
        contentSections: [
          {
            type: "story",
            title: "Detective Maya and the Lost Key",
            content: "The golden key was missing. Maya knew three facts: 1) It's not in the red chest. 2) It's not in a wooden box. 3) The blue chest is metal. By combining clues, she proved the key MUST be in the blue metal chest! That's deduction!"
          },
          {
            type: "concept",
            title: "What is Deductive Logic?",
            content: "Deduction means eliminating wrong possibilities until only the truth remains. If statement A is True, then statement B MUST be True!"
          },
          {
            type: "example",
            title: "Solving Order Puzzles",
            content: "Clue 1: Liam is taller than Sam.\nClue 2: Sam is taller than Zoe.\nConclusion: Liam > Sam > Zoe. Therefore, Liam is the tallest and Zoe is the shortest!"
          },
          {
            type: "tip",
            title: "Draw a Grid!",
            content: "When solving logic puzzles with people and items, make a grid with checkmarks and X's to cross out impossible options."
          },
          {
            type: "recap",
            title: "Module 3 Recap",
            content: "• Logic uses facts to reach 100% certain conclusions\n• Deduction eliminates wrong options step-by-step\n• Order clues help arrange items from largest to smallest!"
          }
        ],
        exercises: [
          {
            type: "mcq",
            question: "If A is taller than B, and B is taller than C, who is the tallest?",
            options: ["A", "B", "C", "They are equal"],
            answer: "A"
          },
          {
            type: "true-false",
            question: "Deductive logic means guessing wildly without evidence.",
            answer: false
          },
          {
            type: "fill-blank",
            question: "Using clues to eliminate wrong answers is called ___ reasoning.",
            answer: "deductive"
          },
          {
            type: "mcq",
            question: "I have 4 legs but cannot walk. What am I?",
            options: ["A dog", "A chair", "A bird", "A snake"],
            answer: "A chair"
          },
          {
            type: "match",
            question: "Match the logic clue to its result:",
            pairs: [
              { term: "Cat is not in Box A or B", definition: "Must be in Box C" },
              { term: "Tom > Mark > Leo", definition: "Tom is tallest" },
              { term: "All squares are shapes", definition: "A square is a shape" }
            ]
          }
        ]
      },
      {
        title: "Module 4: Algorithms & Problem Solving",
        desc: "Learn to solve giant problems step-by-step.",
        xpReward: 50,
        contentSections: [
          {
            type: "story",
            title: "Robot Peanut Butter Sandwich",
            content: "Imagine commanding a robot to make a sandwich. If you say 'Put peanut butter on bread', the robot might smash the unopened jar onto the loaf! You have to say: 1) Open jar. 2) Pick up knife. 3) Scoop peanut butter. 4) Spread on bread. That step-by-step recipe is an algorithm!"
          },
          {
            type: "concept",
            title: "What is an Algorithm?",
            content: "An algorithm is a precise, ordered list of instructions to solve a problem or complete a task."
          },
          {
            type: "fact",
            title: "Decomposition: Breaking Big Tasks Down",
            content: "When faced with a giant problem (like building a rocket or building a game), experts use Decomposition — breaking 1 huge problem into 10 tiny, easy steps!"
          },
          {
            type: "recap",
            title: "Module 4 Recap",
            content: "• Algorithms are step-by-step recipes\n• Order matters: out of order = breakdown\n• Decomposition breaks big tasks into simple steps!"
          }
        ],
        exercises: [
          {
            type: "mcq",
            question: "What is an algorithm?",
            options: ["A math error", "A type of dinosaur", "A step-by-step list of instructions", "A 3D shape"],
            answer: "A step-by-step list of instructions"
          },
          {
            type: "true-false",
            question: "In an algorithm, changing the order of steps does not matter.",
            answer: false
          },
          {
            type: "fill-blank",
            question: "Breaking a big problem into tiny steps is called ___.",
            answer: "decomposition"
          },
          {
            type: "match",
            question: "Match algorithm terms to their meaning:",
            pairs: [
              { term: "Algorithm", definition: "Step-by-step instructions" },
              { term: "Decomposition", definition: "Breaking tasks into small parts" },
              { term: "Debugging", definition: "Fixing a mistake in steps" }
            ]
          },
          {
            type: "mcq",
            question: "What is the best way to solve a massive, hard math puzzle?",
            options: ["Cry", "Break it down into tiny, easy steps", "Guess", "Give up"],
            answer: "Break it down into tiny, easy steps"
          }
        ]
      }
    ]
  },
  {
    id: 3,
    category: "Finance",
    title: "Money Smart: Kids & Cash",
    image: finance,
    desc: "Develop financial literacy early. Learn about budgeting, compound interest, banking, and smart investing.",
    duration: "5 hours",
    difficulty: "Beginner",
    prerequisites: ["Basic math skills (percentages, addition)"],
    learningObjectives: [
      "Understand the history of money",
      "Create a personal budget",
      "Grasp compound interest",
      "Learn the basics of investing"
    ],
    aiTutor: {
      name: "Penny Bot",
      role: "AI Financial Advisor",
      avatar: three
    },
    xpPerModule: 50,
    totalXP: 300,
    badge: { name: "Cash Master", icon: "award" },
    syllabus: [
      {
        title: "Module 1: What is Money?",
        desc: "Learn why money was invented and how bartering worked.",
        xpReward: 50,
        contentSections: [
          {
            type: "story",
            title: "Trading Chickens for Swords",
            content: "Thousands of years ago, if Sam had a chicken and wanted a sword, Sam had to find a blacksmith who wanted a chicken! This was called 'bartering'. But what if the blacksmith only wanted apples? Trading became impossible! That's why humans invented money — something everyone agrees is valuable."
          },
          {
            type: "concept",
            title: "Before Money: Bartering",
            content: "Bartering is trading goods or services directly without money. Money solved bartering because it serves as a universal medium of exchange."
          },
          {
            type: "fact",
            title: "Fun Fact: Shells & Salt as Money!",
            content: "Before paper money, people used cowrie shells, giant stones, and even salt as money! In fact, the word 'salary' comes from the Latin word for salt ('sal')!"
          },
          {
            type: "recap",
            title: "Module 1 Recap",
            content: "• Bartering = trading items directly\n• Money = universal medium of exchange\n• Money only works because everyone agrees it has value!"
          }
        ],
        exercises: [
          {
            type: "mcq",
            question: "What is bartering?",
            options: ["Using credit cards", "Trading goods directly without money", "Investing in stocks", "Saving in a bank"],
            answer: "Trading goods directly without money"
          },
          {
            type: "true-false",
            question: "Money only works if everyone agrees it has value.",
            answer: true
          },
          {
            type: "fill-blank",
            question: "The word salary comes from the Latin word for ___.",
            answer: "salt"
          },
          {
            type: "match",
            question: "Match money terms to their definitions:",
            pairs: [
              { term: "Barter", definition: "Directly trading goods" },
              { term: "Currency", definition: "Money used in a country" },
              { term: "Medium of Exchange", definition: "Something used to buy goods" }
            ]
          },
          {
            type: "mcq",
            question: "Why was money invented?",
            options: ["Because coins are shiny", "To make trading easier than bartering", "To make wallets heavy", "Because chickens ran away"],
            answer: "To make trading easier than bartering"
          }
        ]
      },
      {
        title: "Module 2: Budgets & Saving",
        desc: "Tell your money where to go instead of asking where it went.",
        xpReward: 50,
        contentSections: [
          {
            type: "concept",
            title: "Income vs Expenses",
            content: "• Income = Money coming IN (allowance, birthday gifts, chores).\n• Expenses = Money going OUT (buying toys, snacks, games).\n• Budget = A plan to ensure Expenses are LESS than Income!"
          },
          {
            type: "tip",
            title: "The 50/30/20 Rule",
            content: "A famous way to budget:\n• 50% for Needs (food, school supplies)\n• 30% for Wants (games, toys)\n• 20% for Savings (future goals!)"
          },
          {
            type: "recap",
            title: "Module 2 Recap",
            content: "• Income is money in; Expenses are money out\n• Always spend less than you earn to build wealth!"
          }
        ],
        exercises: [
          {
            type: "mcq",
            question: "Money that comes IN to your pocket is called:",
            options: ["Expense", "Income", "Tax", "Debt"],
            answer: "Income"
          },
          {
            type: "true-false",
            question: "A good budget means your expenses are higher than your income.",
            answer: false
          },
          {
            type: "fill-blank",
            question: "Money that goes OUT when you buy something is called an ___.",
            answer: "expense"
          },
          {
            type: "match",
            question: "Match budget categories:",
            pairs: [
              { term: "Income", definition: "Allowance earned" },
              { term: "Need", definition: "School supplies" },
              { term: "Want", definition: "Video game skin" },
              { term: "Saving", definition: "Money in bank for future" }
            ]
          },
          {
            type: "mcq",
            question: "What is the Golden Rule of money?",
            options: ["Spend all your money", "Spend less than you earn", "Never save", "Buy everything on sale"],
            answer: "Spend less than you earn"
          }
        ]
      },
      {
        title: "Module 3: Compound Interest Magic",
        desc: "The magic multiplier that turns small savings into fortunes.",
        xpReward: 50,
        contentSections: [
          {
            type: "concept",
            title: "Interest on Interest",
            content: "When you deposit money in a bank, the bank pays you 'Interest'. Compound interest means you earn interest on your money AND on the interest you've already earned! It multiplies over time like a snowball rolling down a mountain!"
          },
          {
            type: "fact",
            title: "Albert Einstein's Quote",
            content: "Albert Einstein famously called compound interest 'the 8th wonder of the world. He who understands it, earns it... he who doesn't, pays it!'"
          },
          {
            type: "recap",
            title: "Module 3 Recap",
            content: "• Interest = bonus paid by bank for saving\n• Compound Interest = interest on interest\n• Time is the secret multiplier!"
          }
        ],
        exercises: [
          {
            type: "mcq",
            question: "When a bank pays you bonus money for keeping your savings with them, it's called:",
            options: ["Taxes", "Interest", "Fines", "Loans"],
            answer: "Interest"
          },
          {
            type: "true-false",
            question: "Compound interest means you earn interest on top of previous interest.",
            answer: true
          },
          {
            type: "fill-blank",
            question: "Compound interest works best when you leave your money saved for a ___ time.",
            answer: "long"
          },
          {
            type: "match",
            question: "Match interest concepts:",
            pairs: [
              { term: "Simple Interest", definition: "Interest on initial money only" },
              { term: "Compound Interest", definition: "Interest on interest over time" },
              { term: "Bank Deposit", definition: "Putting money into account" }
            ]
          },
          {
            type: "mcq",
            question: "Who called compound interest the 8th wonder of the world?",
            options: ["Isaac Newton", "Albert Einstein", "Steve Jobs", "Elon Musk"],
            answer: "Albert Einstein"
          }
        ]
      },
      {
        title: "Module 4: Investing & Stocks",
        desc: "Make your money work so you don't have to.",
        xpReward: 50,
        contentSections: [
          {
            type: "concept",
            title: "What is a Stock?",
            content: "When a company (like Apple or Disney) wants to expand, they divide ownership into millions of tiny pieces called 'Stocks' or 'Shares'. When you buy a stock, you become a micro-owner of that company!"
          },
          {
            type: "tip",
            title: "Diversification: Don't put all eggs in 1 basket!",
            content: "If you buy stock in only 1 company and it fails, you lose money. If you invest in 10 different companies, you stay safe if one has a bad day!"
          },
          {
            type: "recap",
            title: "Module 4 Recap",
            content: "• Stock = tiny ownership slice of a company\n• Investing grows money over time\n• Diversify to lower risk!"
          }
        ],
        exercises: [
          {
            type: "mcq",
            question: "When you buy a stock, what are you actually buying?",
            options: ["A piece of paper", "A tiny slice of ownership in a real company", "A loan to government", "A product"],
            answer: "A tiny slice of ownership in a real company"
          },
          {
            type: "true-false",
            question: "Investing has zero risk and always guarantees profits.",
            answer: false
          },
          {
            type: "fill-blank",
            question: "Spreading your investments across multiple companies is called ___.",
            answer: "diversification"
          },
          {
            type: "match",
            question: "Match investment terms:",
            pairs: [
              { term: "Stock", definition: "Share of company ownership" },
              { term: "Dividend", definition: "Company profit shared with investors" },
              { term: "Portfolio", definition: "Collection of all your investments" }
            ]
          },
          {
            type: "mcq",
            question: "What is the primary goal of investing?",
            options: ["To lose money", "To make your money grow over time", "To keep money under mattress", "To pay fees"],
            answer: "To make your money grow over time"
          }
        ]
      }
    ]
  },
  {
    id: 4,
    category: "Marketing",
    title: "Future Creators: Digital Marketing",
    image: Dmarket,
    desc: "Master branding, storytelling, content creation, and online safety.",
    duration: "4.5 hours",
    difficulty: "Intermediate",
    prerequisites: ["Familiarity with social media"],
    learningObjectives: [
      "Build a strong brand identity",
      "Structure compelling narratives",
      "Understand digital citizenship",
      "Design a mock campaign"
    ],
    aiTutor: {
      name: "Viral AI",
      role: "AI Marketing Strategist",
      avatar: four
    },
    xpPerModule: 50,
    totalXP: 300,
    badge: { name: "Brand Genius", icon: "zap" },
    syllabus: [
      {
        title: "Module 1: Branding & Identity",
        desc: "Learn how companies build recognizable personalities.",
        xpReward: 50,
        contentSections: [
          {
            type: "concept",
            title: "More than a logo",
            content: "A brand is the feeling and reputation people connect to a company. Colors trigger emotions: Red = excitement/hunger (McDonald's, Netflix), Blue = trust (Samsung, NASA), Green = nature/growth (Spotify, Starbucks)."
          },
          {
            type: "recap",
            title: "Module 1 Recap",
            content: "• Brand = feeling & reputation\n• Colors & fonts build emotional connection!"
          }
        ],
        exercises: [
          {
            type: "mcq",
            question: "What is a brand?",
            options: ["Just a logo", "The feeling, personality, and reputation of a company", "An office building", "A CEO's signature"],
            answer: "The feeling, personality, and reputation of a company"
          },
          {
            type: "true-false",
            question: "Companies pick colors randomly without thinking about emotions.",
            answer: false
          },
          {
            type: "fill-blank",
            question: "The color blue is often used in logos to build ___.",
            answer: "trust"
          },
          {
            type: "match",
            question: "Match brand elements:",
            pairs: [
              { term: "Logo", definition: "Visual symbol of brand" },
              { term: "Slogan", definition: "Catchy phrase (e.g. Just Do It)" },
              { term: "Palette", definition: "Specific set of brand colors" }
            ]
          },
          {
            type: "mcq",
            question: "Which of these is part of a brand identity?",
            options: ["Logos, colors, and typography", "Office furniture", "Employee shoe size", "Tax forms"],
            answer: "Logos, colors, and typography"
          }
        ]
      },
      {
        title: "Module 2: Storytelling in Marketing",
        desc: "Hook your audience with great stories.",
        xpReward: 50,
        contentSections: [
          {
            type: "concept",
            title: "The Customer is the Hero",
            content: "In marketing, your customer is the Hero (Luke Skywalker), and your product is the Guide (Yoda). Don't talk about yourself — show how your product empowers the customer to win!"
          },
          {
            type: "recap",
            title: "Module 2 Recap",
            content: "• Customer = Hero, Product = Guide\n• Hook viewers in the first 3 seconds!"
          }
        ],
        exercises: [
          {
            type: "mcq",
            question: "In brand storytelling, who is the Hero?",
            options: ["The CEO", "The Product", "The Customer", "The Competitor"],
            answer: "The Customer"
          },
          {
            type: "true-false",
            question: "Online videos need a strong hook in the first 3 seconds.",
            answer: true
          },
          {
            type: "fill-blank",
            question: "In marketing storytelling, your product acts as the ___ to help the hero win.",
            answer: "guide"
          },
          {
            type: "match",
            question: "Match story components:",
            pairs: [
              { term: "Hero", definition: "The Customer" },
              { term: "Guide", definition: "Your Product/Service" },
              { term: "Hook", definition: "First 3 seconds that grab attention" }
            ]
          },
          {
            type: "mcq",
            question: "Why do marketers use storytelling?",
            options: ["To bore people", "To build an emotional connection", "To fill blank space", "To confuse readers"],
            answer: "To build an emotional connection"
          }
        ]
      },
      {
        title: "Module 3: Digital Citizenship & Safety",
        desc: "Protect your digital footprint.",
        xpReward: 50,
        contentSections: [
          {
            type: "concept",
            title: "The Permanent Ink of the Web",
            content: "Your Digital Footprint is the trail of data you leave behind online. Never post PII (Personally Identifiable Information) like home address, phone number, or school name!"
          },
          {
            type: "recap",
            title: "Module 3 Recap",
            content: "• Digital Footprint is permanent\n• Never share PII online!"
          }
        ],
        exercises: [
          {
            type: "mcq",
            question: "What is your Digital Footprint?",
            options: ["Your shoe size", "The permanent trail of data you leave online", "Printer ink", "Screen brightness"],
            answer: "The permanent trail of data you leave online"
          },
          {
            type: "true-false",
            question: "Anything you post online can easily be deleted forever.",
            answer: false
          },
          {
            type: "fill-blank",
            question: "PII stands for Personally Identifiable ___.",
            answer: "information"
          },
          {
            type: "match",
            question: "Match safety terms:",
            pairs: [
              { term: "PII", definition: "Address, phone, full name" },
              { term: "Safe to Share", definition: "Drawings, reviews, hobbies" },
              { term: "Digital Footprint", definition: "Online history trail" }
            ]
          },
          {
            type: "mcq",
            question: "Which of the following should NEVER be posted publicly online?",
            options: ["Favorite movie", "Home address", "Drawing of a cat", "Book review"],
            answer: "Home address"
          }
        ]
      },
      {
        title: "Module 4: Marketing Campaigns & CTA",
        desc: "Launch your big idea with a clear call to action.",
        xpReward: 50,
        contentSections: [
          {
            type: "concept",
            title: "Call to Action (CTA)",
            content: "A CTA tells the audience exactly what step to take next: 'Subscribe Now!', 'Click Here to Join!', 'Download the App!'."
          },
          {
            type: "recap",
            title: "Module 4 Recap",
            content: "• CTA = clear instruction for next step\n• Target Audience = specific group you design for!"
          }
        ],
        exercises: [
          {
            type: "mcq",
            question: "What does CTA stand for?",
            options: ["Call To Action", "Center Text Alignment", "Cost To Advertise", "Click To Add"],
            answer: "Call To Action"
          },
          {
            type: "true-false",
            question: "'Subscribe for more videos!' is an example of a CTA.",
            answer: true
          },
          {
            type: "fill-blank",
            question: "The specific group of people you design a campaign for is called the target ___.",
            answer: "audience"
          },
          {
            type: "match",
            question: "Match campaign terms:",
            pairs: [
              { term: "CTA", definition: "Call To Action" },
              { term: "Target Audience", definition: "Intended viewers/buyers" },
              { term: "Campaign", definition: "Organized marketing strategy" }
            ]
          },
          {
            type: "mcq",
            question: "What is an effective Call To Action?",
            options: ["'We exist.'", "'Subscribe today for free tips!'", "'Colors are nice.'", "'Bye.'"],
            answer: "'Subscribe today for free tips!'"
          }
        ]
      }
    ]
  },
  {
    id: 5,
    category: "Science",
    title: "Web Wonders: HTML & CSS",
    image: coding,
    desc: "Master the core markup and styling languages that power the internet.",
    duration: "6 hours",
    difficulty: "Beginner",
    prerequisites: ["A computer with a web browser"],
    learningObjectives: [
      "Write semantic HTML5 markup",
      "Style pages with modern CSS",
      "Understand the CSS Box Model",
      "Deploy your website"
    ],
    aiTutor: {
      name: "WebWeaver",
      role: "AI Frontend Master",
      avatar: one
    },
    xpPerModule: 50,
    totalXP: 300,
    badge: { name: "Web Architect", icon: "code" },
    syllabus: [
      {
        title: "Module 1: HTML Structure",
        desc: "The skeleton of every website.",
        xpReward: 50,
        contentSections: [
          {
            type: "concept",
            title: "Tags & Building Blocks",
            content: "HTML (HyperText Markup Language) uses tags wrapped in angle brackets like `<h1>` for Headings, `<p>` for Paragraphs, and `<a>` for Links!"
          },
          {
            type: "recap",
            title: "Module 1 Recap",
            content: "• HTML = structure/skeleton\n• `<h1>` = biggest heading, `<p>` = paragraph!"
          }
        ],
        exercises: [
          {
            type: "mcq",
            question: "What does HTML provide for a webpage?",
            options: ["Colors and styles", "Raw structure (skeleton)", "Database storage", "Server backend"],
            answer: "Raw structure (skeleton)"
          },
          {
            type: "true-false",
            question: "HTML tag names are enclosed in angle brackets like <p>.",
            answer: true
          },
          {
            type: "fill-blank",
            question: "The tag used for paragraph text in HTML is ___.",
            answer: "<p>"
          },
          {
            type: "match",
            question: "Match HTML tags to their purpose:",
            pairs: [
              { term: "<h1>", definition: "Main heading" },
              { term: "<p>", definition: "Paragraph text" },
              { term: "<a>", definition: "Hyperlink" },
              { term: "<img>", definition: "Image tag" }
            ]
          },
          {
            type: "mcq",
            question: "Which tag produces the largest heading?",
            options: ["<p>", "<h1>", "<h6>", "<div>"],
            answer: "<h1>"
          }
        ]
      },
      {
        title: "Module 2: CSS Styling",
        desc: "Add colors, fonts, and beauty.",
        xpReward: 50,
        contentSections: [
          {
            type: "concept",
            title: "The Clothes on the Skeleton",
            content: "CSS (Cascading Style Sheets) controls how HTML looks. You select elements and add styles: `color: purple; font-size: 20px; background-color: black;`."
          },
          {
            type: "recap",
            title: "Module 2 Recap",
            content: "• CSS = styling & design\n• Use `color` for text color!"
          }
        ],
        exercises: [
          {
            type: "mcq",
            question: "What does CSS do?",
            options: ["Builds raw HTML tags", "Styles pages with colors and fonts", "Stores user accounts", "Powers databases"],
            answer: "Styles pages with colors and fonts"
          },
          {
            type: "true-false",
            question: "CSS property names end with a colon (:).",
            answer: true
          },
          {
            type: "fill-blank",
            question: "In CSS, to make text red you write color: ___;",
            answer: "red"
          },
          {
            type: "match",
            question: "Match CSS properties:",
            pairs: [
              { term: "color", definition: "Text color" },
              { term: "font-size", definition: "Text size" },
              { term: "background-color", definition: "Background color" }
            ]
          },
          {
            type: "mcq",
            question: "How do you change text color in CSS?",
            options: ["text: red;", "color: red;", "font-color: red;", "paint: red;"],
            answer: "color: red;"
          }
        ]
      },
      {
        title: "Module 3: The CSS Box Model",
        desc: "Master spacing: Content, Padding, Border, Margin.",
        xpReward: 50,
        contentSections: [
          {
            type: "concept",
            title: "Everything is a Rectangular Box!",
            content: "In CSS, every single element is a box. The Box Model has 4 layers:\n1. Content (the text/image)\n2. Padding (space INSIDE border)\n3. Border (the outline)\n4. Margin (space OUTSIDE border)"
          },
          {
            type: "recap",
            title: "Module 3 Recap",
            content: "• Padding = inside spacing\n• Margin = outside spacing!"
          }
        ],
        exercises: [
          {
            type: "mcq",
            question: "In CSS Box Model, what is the space INSIDE the border?",
            options: ["Margin", "Padding", "Content", "Outline"],
            answer: "Padding"
          },
          {
            type: "true-false",
            question: "Margin creates space OUTSIDE the element's border.",
            answer: true
          },
          {
            type: "fill-blank",
            question: "The space inside an element between content and border is called ___.",
            answer: "padding"
          },
          {
            type: "match",
            question: "Match Box Model layers:",
            pairs: [
              { term: "Content", definition: "Text or image inside" },
              { term: "Padding", definition: "Space inside border" },
              { term: "Border", definition: "Line surrounding padding" },
              { term: "Margin", definition: "Space outside border" }
            ]
          },
          {
            type: "mcq",
            question: "What is the space OUTSIDE the border called?",
            options: ["Margin", "Padding", "Content", "Outline"],
            answer: "Margin"
          }
        ]
      },
      {
        title: "Module 4: Deployment & Web Hosting",
        desc: "Share your site with the world.",
        xpReward: 50,
        contentSections: [
          {
            type: "concept",
            title: "Putting Your Site Online",
            content: "To let anyone visit your site, you upload your HTML & CSS files to a Server (web host). The server gives you a URL link (like mysite.com)!"
          },
          {
            type: "recap",
            title: "Module 4 Recap",
            content: "• Deployment = publishing site live\n• Server = 24/7 web host computer!"
          }
        ],
        exercises: [
          {
            type: "mcq",
            question: "What is a web server?",
            options: ["A waiter", "A computer that stays online 24/7 hosting files", "A CSS file", "A browser"],
            answer: "A computer that stays online 24/7 hosting files"
          },
          {
            type: "true-false",
            question: "Deploying a website means putting it on a server so the world can visit.",
            answer: true
          },
          {
            type: "fill-blank",
            question: "The web address people type to visit your website is called a ___.",
            answer: "url"
          },
          {
            type: "match",
            question: "Match hosting terms:",
            pairs: [
              { term: "Server", definition: "24/7 online computer" },
              { term: "URL", definition: "Web address" },
              { term: "Deploy", definition: "Publishing code live" }
            ]
          },
          {
            type: "mcq",
            question: "What do visitors type to access your website?",
            options: ["A URL", "A USB key", "A password", "A text file"],
            answer: "A URL"
          }
        ]
      }
    ]
  },
  {
    id: 6,
    category: "Arts",
    title: "Digital Art: Draw on Your Screen",
    image: paint,
    desc: "Unleash your creativity with digital art techniques.",
    duration: "4 hours",
    difficulty: "All Levels",
    prerequisites: ["A digital drawing tablet"],
    learningObjectives: [
      "Navigate digital canvas software",
      "Apply advanced color theory",
      "Structure dynamic character poses",
      "Render and polish illustrations"
    ],
    aiTutor: {
      name: "Pixel Bot",
      role: "AI Concept Artist",
      avatar: two
    },
    xpPerModule: 50,
    totalXP: 300,
    badge: { name: "Digital Picasso", icon: "star" },
    syllabus: [
      {
        title: "Module 1: Layers & Non-Destructive Art",
        desc: "Draw without fear of ruining your work.",
        xpReward: 50,
        contentSections: [
          {
            type: "concept",
            title: "Clear Sheets of Glass",
            content: "Digital layers are like stacked transparent sheets. Draw sketches on Layer 1, line art on Layer 2, colors on Layer 3. If you erase colors on Layer 3, your sketch underneath stays 100% safe!"
          },
          {
            type: "recap",
            title: "Module 1 Recap",
            content: "• Layers = stacked transparent sheets\n• Non-destructive = sketch is safe while coloring!"
          }
        ],
        exercises: [
          {
            type: "mcq",
            question: "What are digital art layers similar to?",
            options: ["Heavy rocks", "Stacked clear sheets of glass", "A single sheet of paper", "A paintbrush"],
            answer: "Stacked clear sheets of glass"
          },
          {
            type: "true-false",
            question: "Erasing on Layer 2 deletes your drawing on Layer 1.",
            answer: false
          },
          {
            type: "fill-blank",
            question: "Drawing on separate layers prevents ruining your sketch, called non-___ art.",
            answer: "destructive"
          },
          {
            type: "match",
            question: "Match layer types:",
            pairs: [
              { term: "Sketch Layer", definition: "Rough initial guide" },
              { term: "Line Art Layer", definition: "Clean outline" },
              { term: "Color Layer", definition: "Fills under line art" }
            ]
          },
          {
            type: "mcq",
            question: "Why do digital artists use layers?",
            options: ["To slow down", "To color without destroying the sketch", "To crash software", "To waste space"],
            answer: "To color without destroying the sketch"
          }
        ]
      },
      {
        title: "Module 2: Color Theory & Palettes",
        desc: "Pick colors that pop!",
        xpReward: 50,
        contentSections: [
          {
            type: "concept",
            title: "Complementary Colors",
            content: "Colors opposite each other on the Color Wheel (Blue & Orange, Red & Green, Yellow & Purple) are Complementary. Placed side-by-side, they create vibrant contrast!"
          },
          {
            type: "recap",
            title: "Module 2 Recap",
            content: "• Opposite colors on wheel = Complementary\n• High contrast makes art pop!"
          }
        ],
        exercises: [
          {
            type: "mcq",
            question: "Colors opposite each other on the color wheel are called:",
            options: ["Analogous", "Complementary", "Primary", "Monochrome"],
            answer: "Complementary"
          },
          {
            type: "true-false",
            question: "Blue and Orange are complementary colors.",
            answer: true
          },
          {
            type: "fill-blank",
            question: "Complementary colors create maximum visual ___.",
            answer: "contrast"
          },
          {
            type: "match",
            question: "Match complementary color pairs:",
            pairs: [
              { term: "Blue", definition: "Orange" },
              { term: "Red", definition: "Green" },
              { term: "Yellow", definition: "Purple" }
            ]
          },
          {
            type: "mcq",
            question: "What effect do complementary colors create when placed side-by-side?",
            options: ["Boredom", "Maximum contrast and excitement", "Gray blur", "Invisibility"],
            answer: "Maximum contrast and excitement"
          }
        ]
      },
      {
        title: "Module 3: Composition & Rule of Thirds",
        desc: "Arrange elements like a pro director.",
        xpReward: 50,
        contentSections: [
          {
            type: "concept",
            title: "The 3x3 Grid Secret",
            content: "Don't put your character dead in the middle! Divide your canvas into a 3x3 grid. Placing your main subject on the grid intersection lines creates dynamic, cinematic composition."
          },
          {
            type: "recap",
            title: "Module 3 Recap",
            content: "• Rule of Thirds uses a 3x3 grid\n• Intersections create appealing focal points!"
          }
        ],
        exercises: [
          {
            type: "mcq",
            question: "What grid does the Rule of Thirds use?",
            options: ["2x2 grid", "3x3 grid", "10x10 grid", "No grid"],
            answer: "3x3 grid"
          },
          {
            type: "true-false",
            question: "Placing a character dead-center is always the most cinematic choice.",
            answer: false
          },
          {
            type: "fill-blank",
            question: "In Rule of Thirds, place your subject at the grid ___.",
            answer: "intersections"
          },
          {
            type: "match",
            question: "Match composition terms:",
            pairs: [
              { term: "Rule of Thirds", definition: "3x3 alignment grid" },
              { term: "Focal Point", definition: "Main spot where eyes look" },
              { term: "Canvas", definition: "Digital drawing area" }
            ]
          },
          {
            type: "mcq",
            question: "Where should you place your subject using the Rule of Thirds?",
            options: ["Dead center always", "Outside canvas", "At grid line intersections", "In bottom left corner only"],
            answer: "At grid line intersections"
          }
        ]
      },
      {
        title: "Module 4: Rendering & Lighting",
        desc: "Make flat drawings look 3D with light and shadow.",
        xpReward: 50,
        contentSections: [
          {
            type: "concept",
            title: "Highlights and Shadows",
            content: "Rendering is adding light and shade. The side facing the light source gets a bright 'Highlight'. The side facing away gets a deep 'Shadow'!"
          },
          {
            type: "recap",
            title: "Module 4 Recap",
            content: "• Rendering adds 3D depth\n• Light side = Highlight, Dark side = Shadow!"
          }
        ],
        exercises: [
          {
            type: "mcq",
            question: "What is rendering in digital art?",
            options: ["Adding light and shadow for 3D depth", "Erasing the sketch", "Adding a signature", "Saving as JPEG"],
            answer: "Adding light and shadow for 3D depth"
          },
          {
            type: "true-false",
            question: "The side of an object facing the sun gets a shadow.",
            answer: false
          },
          {
            type: "fill-blank",
            question: "The bright spot where light hits an object directly is called a ___.",
            answer: "highlight"
          },
          {
            type: "match",
            question: "Match lighting terms:",
            pairs: [
              { term: "Light Source", definition: "Where light comes from (sun/lamp)" },
              { term: "Highlight", definition: "Brightest spot on object" },
              { term: "Shadow", definition: "Dark area away from light" }
            ]
          },
          {
            type: "mcq",
            question: "What area receives a Highlight?",
            options: ["The side facing away from light", "The side facing directly toward the light", "The bottom always", "Nowhere"],
            answer: "The side facing directly toward the light"
          }
        ]
      }
    ]
  }
];
