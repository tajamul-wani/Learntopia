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
            content: "Alex is 11 and loves games. One day Alex thought: what if I could BUILD one instead of just playing it? Alex's teacher said you can — you just need Python. This is your story too."
          },
          {
            type: "concept",
            title: "What is Python?",
            content: "Python is a language for telling computers what to do. Imagine a robot friend that only understands Python. Want it to draw, dance or do maths? Write the instructions in Python. It reads almost like English."
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
            content: "• Python is a language for giving computers instructions\n• Named after a comedy show, not the snake\n• print() shows text on the screen\n• Text needs quotes around it\n• You just wrote real code"
          }
        ],
        exercises: [
          {
            type: "mcq",
            question: "What is Python?",
            options: [
              "A drawing app for making game artwork",
              "A programming language for talking to computers",
              "A type of computer that runs games",
              "A website where you download games"
            ],
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
            content: "A variable is a labelled box. Put 10 in a box called score and score now holds 10.\n\nscore = 10\nplayer_name = 'Alex'\n\nThe = does not mean equals. It means put this value in this box."
          },
          {
            type: "concept",
            title: "Different Types of Data",
            content: "Computers need to know what KIND of thing is in each box:\n\nint — whole numbers: 5, 42\nstr — text in quotes: 'Alex'\nfloat — decimals: 3.14\nbool — True or False\n\nPython works out the type for you."
          },
          {
            type: "example",
            title: "Variables in Action",
            content: "Watch how Alex uses variables in the game:\n\nplayer_name = 'Alex'\nscore = 0\nlives = 3\n\nscore = score + 10\nprint('Score:', score)\n\nThe computer will show: Score: 10\n\nNotice how score = score + 10 works: Python looks at the OLD value of score (0), adds 10, and puts the NEW value (10) back in the box!"
          },
          {
            type: "fact",
            title: "Your Brain is Full of Variables!",
            content: "Your brain does this too. It holds a box called my_name with your name in it, one called my_age, one for your favourite colour. You just never called them variables."
          },
          {
            type: "activity",
            title: "Name These Boxes",
            content: "Write a good variable name for each: the player's best score, how many lives are left, whether the game is over. Then check them — no spaces, never start with a number, and score is not the same as Score."
          },
          {
            type: "recap",
            title: "Module 2 Recap",
            content: "• Variables are labelled boxes that hold data\n• = puts a value into the box\n• int, str, float and bool are the main types\n• score = score + 10 updates a box\n• Score and score are two different boxes"
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
            content: "Alex's game can store a score but it cannot react. Guess right and nothing happens. The game needs to make a decision, and that is exactly what an if-statement is for."
          },
          {
            type: "concept",
            title: "Making Choices with 'if'",
            content: "An if-statement runs code only when something is true:\n\nif score > 100:\n    print('You win!')\n\nThe indented line runs only when the score really is over 100. Otherwise Python skips straight past it."
          },
          {
            type: "concept",
            title: "Adding 'else' and 'elif'",
            content: "else catches everything the if missed. elif checks another condition first:\n\nif score > 100:\n    print('Amazing!')\nelif score > 50:\n    print('Close!')\nelse:\n    print('Keep going!')"
          },
          {
            type: "fact",
            title: "If-Statements Are EVERYWHERE!",
            content: "Every app you use runs on these. Wrong password? An if-statement. Low battery warning? An if-statement. Game over screen? An if-statement checking whether your lives have hit zero."
          },
          {
            type: "example",
            title: "Comparison Operators",
            content: "To write conditions, you need comparison operators:\n\n>  means 'greater than'       (10 > 5 is True)\n<  means 'less than'          (3 < 7 is True)\n== means 'equal to'           (5 == 5 is True)\n!= means 'not equal to'       (5 != 3 is True)\n>= means 'greater or equal'   (10 >= 10 is True)\n<= means 'less or equal'      (4 <= 9 is True)\n\nNotice: Checking equality uses == (double equals), NOT = (single equals). Single = is for assigning variables!"
          },
          {
            type: "activity",
            title: "Spot the Bug",
            content: "One of these lines will not run:\n\nif score > 10\n    print('Win')\n\nFind what is missing from the end of the first line. Python needs it to know a block is about to start."
          },
          {
            type: "recap",
            title: "Module 3 Recap",
            content: "• if runs code only when something is true\n• else catches everything if missed\n• elif checks another condition\n• The colon and the indent are both required\n• Every app you use is full of these"
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
            content: "Alex has variables, if-statements and a plan: a guessing game. The computer picks a number, you guess, it says higher or lower. Everything from the last three modules, in one game."
          },
          {
            type: "concept",
            title: "What Are Loops?",
            content: "A loop repeats code so you do not write it twenty times:\n\nwhile guess != answer:\n    guess = int(input('Guess: '))\n\nThis keeps asking until the guess is right. != means not equal to."
          },
          {
            type: "concept",
            title: "Getting User Input",
            content: "input() waits for the player to type something and hands it back as text:\n\nname = input('Your name: ')\n\nAlways text. To do maths with it, wrap it in int(): int(input('Guess: '))"
          },
          {
            type: "example",
            title: "The Complete Game Code",
            content: "Here's the full guessing game:\n\nimport random\n\nsecret = random.randint(1, 20)\nprint('I picked a number between 1 and 20!')\n\nguess = 0\nattempts = 0\n\nwhile guess != secret:\n    guess = int(input('Your guess: '))\n    attempts = attempts + 1\n    \n    if guess > secret:\n        print('Too High! Try lower.')\n    elif guess < secret:\n        print('Too Low! Try higher.')\n    else:\n        print('YOU GOT IT!')\n        print('It took you', attempts, 'guesses!')\n\nEvery concept you learned — print, variables, if/elif/else, loops, input — is used here!"
          },
          {
            type: "fact",
            title: "Random Numbers in Games",
            content: "import random gives you random.randint(1, 100) — a different number every run. Without it the answer would be the same every game, and nobody would play twice."
          },
          {
            type: "activity",
            title: "Upgrade Your Game!",
            content: "Once your basic game works, try these upgrades:\n\nEasy: Change the range from 1-20 to 1-100 for a harder game\nMedium: Limit the player to only 5 guesses. If they run out, print 'Game Over!'\nHard: Add a scoring system — fewer guesses = higher score!\nExpert: Ask the player if they want to play again after winning!\n\nEvery upgrade uses the same skills you've already learned — just combined in creative ways!"
          },
          {
            type: "recap",
            title: "Course Complete Recap!",
            content: "• Variables hold your data\n• if, elif and else make decisions\n• Loops repeat work for you\n• input() reads what the player types\n• random picks a new number each game\n• You built a real, playable game"
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
            options: [
              "To make the computer pick a new number each turn",
              "To let the player guess multiple times until they're right",
              "To show the player every possible answer at the start",
              "To end the game as soon as the first guess is wrong"
            ],
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
            content: "The chest was locked with a code: 2, 4, 6, 8, __. The guards were stuck. Maya grinned — add 2 each time. She typed 10 and it clicked open. Patterns are rules in disguise."
          },
          {
            type: "concept",
            title: "The Magic of Sequences",
            content: "A sequence follows one rule. Find the rule and you can predict the next number:\n\n+5: 5, 10, 15, 20...\n×2: 2, 4, 8, 16...\n-3: 20, 17, 14, 11..."
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
            type: "activity",
            title: "Hunt for Shapes",
            content: "Find five 3D shapes in your home: a can, a box, a ball, a cone, a pyramid. For each, name the 2D shape you would see if you sliced straight through it."
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
            type: "activity",
            title: "Trap a Friend",
            content: "Write a riddle where the obvious answer is wrong. Try it on someone. If they answer too fast and get it wrong, your misdirection worked."
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
            content: "Tell a robot to put peanut butter on bread and it may smash the closed jar onto the loaf. You have to say: open jar, pick up knife, scoop, spread. That exact order is an algorithm."
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
            type: "activity",
            title: "Instruct a Human Robot",
            content: "Write steps for someone to draw a square without saying the word square. Read them out exactly. Every place they go wrong is a step you left out."
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
            options: [
              "Break it down into tiny, easy steps",
              "Start at the hardest part and work backwards",
              "Do the whole thing in your head at once",
              "Skip ahead and check the answer later"
            ],
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
            content: "Sam had a chicken and wanted a sword, so Sam had to find a blacksmith who wanted a chicken. If the blacksmith wanted apples, no deal. Money exists because that almost never matched up."
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
            type: "activity",
            title: "Price Three Things",
            content: "Pick three things in your room. Write what you would swap each one for if money did not exist. Notice how hard it is to find a fair trade — that is the problem money solved."
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
            type: "activity",
            title: "Build a Tiny Budget",
            content: "Imagine you get 10 a week. Write down how much goes to spending, saving and giving. The three must add up to 10 exactly. That is a budget."
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
            type: "activity",
            title: "Double It Yourself",
            content: "Start with 100. Add 10% and write the total. Add 10% to the new total, and again, five times over. Compare your answer to 150 and see how far past it you got."
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
            type: "activity",
            title: "Pick a Pretend Share",
            content: "Choose a company you actually use. Write one reason it might be worth more in five years, and one reason it might be worth less. That is what investors do all day."
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
            options: [
              "A promise the company pays you back later",
              "A tiny slice of ownership in a real company",
              "A discount on everything that company sells",
              "A ticket that lets you vote for the CEO"
            ],
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
            title: "Sam's Two Posters",
            content: "Sam made two posters for the same school bake sale. One in bubbly pink, one in sharp black. Same words, same cakes. Everyone said the pink one looked friendlier. Nothing about the cakes had changed."
          },
          {
            type: "concept",
            title: "A Brand Is a Feeling",
            content: "A brand is not the logo. It is what people expect before they have tried anything. Colours, fonts and tone set that expectation, and they set it in about a second."
          },
          {
            type: "example",
            title: "Why Banks Are Blue",
            content: "Look at logos you know:\n\nRed — appetite and urgency (McDonald's, Netflix)\nBlue — trust and calm (Samsung, PayPal)\nGreen — nature and growth (Spotify, Starbucks)\n\nAlmost no bank uses bright red. Almost no energy drink uses soft blue. They are not guessing — they are picking the feeling first."
          },
          {
            type: "tip",
            title: "Pick a Feeling First",
            content: "Before choosing any colour, write down one word for how you want people to feel: safe, excited, sporty, expensive. Choose the colour to fit that word. Doing it the other way round is why designs feel random."
          },
          {
            type: "activity",
            title: "Name the Feeling",
            content: "Find three logos on things around you. For each, write the first word that comes to mind, then the main colour. Look for a pattern between the two. You will see the same pairings again and again."
          },
          {
            type: "recap",
            title: "Module 1 Recap",
            content: "• A brand is a feeling, not a logo\n• Colour and font set it in about a second\n• Red urges, blue reassures, green grows\n• Choose the feeling before the colour"
          }
        ],
        exercises: [
          {
            type: "mcq",
            question: "What is a brand?",
            options: [
              "The list of products a company sells today",
              "The feeling, personality, and reputation of a company",
              "The legal name a company registers under",
              "The colour scheme printed on its packaging"
            ],
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
            title: "Nobody Read Sam's Post",
            content: "Sam wrote a post about the bake sale: how long it took to organise, who was on the committee, how many meetings there were. Three people read it. None of them came."
          },
          {
            type: "concept",
            title: "The Customer Is the Hero",
            content: "The person reading is the hero of the story. Your thing is the guide that helps them win. Luke gets the medal, not Yoda. Write about what they get, not about you."
          },
          {
            type: "example",
            title: "Same Sale, Rewritten",
            content: "Before: \"Our committee spent six weeks planning this event.\"\n\nAfter: \"Get a warm brownie for 50p at break, and your money buys books for the library.\"\n\nThe second one says nothing about Sam. It tells the reader what they get and what it does. That version filled the table."
          },
          {
            type: "tip",
            title: "Count Your Yous",
            content: "Read what you wrote and count how many times you say we, our or I, then how many times you say you. If the first number is bigger, rewrite it. This one check fixes most weak posts."
          },
          {
            type: "activity",
            title: "Flip a Sentence",
            content: "Find an advert or a poster near you. Write down one sentence from it. Now rewrite it so it starts with the word You and says what the reader gets. Read both out loud."
          },
          {
            type: "recap",
            title: "Module 2 Recap",
            content: "• The reader is the hero, your thing is the guide\n• Say what they get, not what you did\n• Count your we against your you\n• The first line decides if they read the rest"
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
            title: "The Photo Sam Deleted",
            content: "Sam posted a photo of the bake sale poster taped to the school gate. The school name was readable. Sam deleted it an hour later. Two friends had already screenshotted it."
          },
          {
            type: "concept",
            title: "Deleting Is Not Undoing",
            content: "Your digital footprint is everything you leave online. Delete removes your copy, not anyone else's. Screenshots, reposts and backups all survive. Assume anything you post is permanent."
          },
          {
            type: "example",
            title: "What Not To Show",
            content: "Things that identify you in real life:\n\nHome address or street signs\nSchool name, crest or uniform\nPhone number, even in a photo\nYour timetable or daily route\n\nMost of these get shared by accident, in the background of a picture, rather than typed out on purpose."
          },
          {
            type: "tip",
            title: "Check the Background",
            content: "Before posting a photo, look past yourself at everything else in frame: door numbers, bus stops, school logos on a jumper. The subject is usually safe. The background is what gives you away."
          },
          {
            type: "activity",
            title: "Audit One Photo",
            content: "Open a photo on your phone you might have posted. List everything in it that could tell a stranger where you live or go to school. Decide whether you would still post it."
          },
          {
            type: "recap",
            title: "Module 3 Recap",
            content: "• Your footprint is everything you leave online\n• Deleting your copy does not delete theirs\n• Address, school and timetable identify you\n• Most leaks come from the background"
          }
        ],
        exercises: [
          {
            type: "mcq",
            question: "What is your Digital Footprint?",
            options: [
              "The amount of storage your photos take up",
              "The permanent trail of data you leave online",
              "The speed your internet connection runs at",
              "The number of apps installed on your phone"
            ],
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
            title: "Everyone Liked It, Nobody Came",
            content: "Sam's new poster looked great and people said so. Still a quiet table. The poster never said where the sale was, when it started, or what to do next. Liking is not turning up."
          },
          {
            type: "concept",
            title: "Tell Them the Next Step",
            content: "A call to action is one clear instruction: what to do, where, and when. Without it people agree with you and then carry on walking. Good is not the same as clear."
          },
          {
            type: "example",
            title: "Vague Against Specific",
            content: "Vague: \"Support the bake sale!\"\n\nSpecific: \"Come to the hall at 12:45 on Friday. Bring 50p.\"\n\nThe second gives a place, a time and an amount. Every one of those removes a reason to do nothing. The best call to action is the easiest one to obey."
          },
          {
            type: "tip",
            title: "One Action, Not Four",
            content: "Follow us, subscribe, tell a friend and come along is four jobs, so most people do none. Pick the single thing that matters most and ask for only that."
          },
          {
            type: "activity",
            title: "Fix a Weak One",
            content: "Find an advert with a vague ending like Learn more. Rewrite it with a place, a time and one action. Read it to someone and ask them what they are meant to do."
          },
          {
            type: "recap",
            title: "Module 4 Recap",
            content: "• A call to action is one clear instruction\n• Give a place, a time and an amount\n• Specific beats enthusiastic\n• Ask for one thing, not four"
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
            type: "story",
            title: "Maya's Grey Blob",
            content: "Maya typed her skate tricks into a file and opened it in a browser. She got one grey blob. No headings, no links — the browser had no idea what any of it was meant to be."
          },
          {
            type: "concept",
            title: "Tags Tell the Browser What Things Are",
            content: "An HTML tag is a label. You wrap your text in one and the browser finally knows: this is a heading, that is a paragraph. Tags come in pairs — <p> opens, </p> closes."
          },
          {
            type: "example",
            title: "Maya's Page, Fixed",
            content: "Maya wraps her words in tags:\n\n<h1>Maya's Skate Tricks</h1>\n<p>My best one is a kickflip.</p>\n<a href=\"tricks.html\">See them all</a>\n\nNow the browser knows what to do: a big bold title, a normal paragraph, and a blue link you can click. Same words, completely different page."
          },
          {
            type: "fact",
            title: "The First Website Still Works",
            content: "The world's first website went live in 1991. Plain text and links, no colours, no pictures. It is still online today, and it still loads perfectly in every modern browser."
          },
          {
            type: "activity",
            title: "Build It: Your Turn",
            content: "Make a file called me.html. Put your name in an <h1>, one thing you love in a <p>, and a link to any site in an <a>. Open the file in your browser and see it work."
          },
          {
            type: "recap",
            title: "Module 1 Recap",
            content: "• A tag labels what your content IS\n• Tags come in pairs: <p> opens, </p> closes\n• <h1> is the main heading, <p> a paragraph, <a> a link\n• The browser only knows what your tags tell it"
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
            type: "story",
            title: "Maya's Page Looks Boring",
            content: "Maya's page works now, but it is black text on white with a Times New Roman font. Her friend asks if it is a school worksheet. Maya wants it to look like HERS."
          },
          {
            type: "concept",
            title: "CSS Dresses the Skeleton",
            content: "HTML says what things are. CSS says how they look. You pick an element, then set properties on it: a colour, a size, a background. Each one is property: value;"
          },
          {
            type: "example",
            title: "Three Lines That Change Everything",
            content: "Maya adds a style block:\n\nh1 {\n  color: hotpink;\n  font-size: 40px;\n}\n\nEvery <h1> on the page turns hot pink and grows. She wrote three lines and changed every heading at once — that is the whole point of CSS."
          },
          {
            type: "tip",
            title: "The Semicolon Catches Everyone",
            content: "Every CSS line ends in a semicolon. Miss one and the browser quietly ignores that line and the next one. Nothing breaks, nothing warns you — your style just does not show up."
          },
          {
            type: "activity",
            title: "Make It Yours",
            content: "Open your me.html and add a style block. Give your <h1> a colour you like and your <p> a font-size of 18px. Reload the page. Change the colour three times and watch it update."
          },
          {
            type: "recap",
            title: "Module 2 Recap",
            content: "• HTML is what things ARE, CSS is how they LOOK\n• Style rules are property: value;\n• One rule styles every matching element at once\n• A missing semicolon silently kills the line"
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
            type: "story",
            title: "Everything Is Squashed Together",
            content: "Maya's text now touches the edge of its box and her paragraphs are stuck to each other. It looks cramped. She needs space — but space on the inside and the outside are two different things."
          },
          {
            type: "concept",
            title: "Every Element Is a Box",
            content: "In CSS everything is a rectangle with four layers: the content, padding around it inside the border, the border itself, and margin outside pushing other things away."
          },
          {
            type: "example",
            title: "Padding Versus Margin",
            content: "Think of a framed photo:\n\n.card {\n  padding: 20px;\n  border: 2px solid black;\n  margin: 30px;\n}\n\nPadding is the white mount between the photo and the frame. Margin is the wall space between this frame and the next one. Padding grows the box; margin pushes boxes apart."
          },
          {
            type: "tip",
            title: "Use the Inspector",
            content: "Right-click anything on a webpage and choose Inspect. The browser draws the box model in colour: green for padding, orange for margin. Every site you like was built with the same four layers."
          },
          {
            type: "activity",
            title: "Find the Layers",
            content: "Open any website, right-click a button and choose Inspect. Find its padding and margin in the panel. Change the padding number and watch the real button on the page grow."
          },
          {
            type: "recap",
            title: "Module 3 Recap",
            content: "• Every element is a box with four layers\n• Padding is space INSIDE the border\n• Margin is space OUTSIDE, pushing others away\n• Inspect shows you the layers on any site"
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
            type: "story",
            title: "It Only Works on Maya's Laptop",
            content: "Maya shows her page to a friend by turning her laptop around. To send it, she emails the file — and it opens with all the styling gone. A website nobody can visit is not really a website."
          },
          {
            type: "concept",
            title: "A Server Is a Computer That Never Sleeps",
            content: "Your file lives on your laptop, which sleeps and changes address. A host is a computer that stays on, holds your files and answers anyone who asks for them, day or night."
          },
          {
            type: "example",
            title: "From Folder to Address",
            content: "Maya drags her folder onto a free host. It contains:\n\nindex.html\nstyle.css\n\nMinutes later she has a real address she can text to anyone. The host looks for index.html first — that is why the home page is almost always called that."
          },
          {
            type: "fact",
            title: "Every Site Is Just Files",
            content: "The biggest sites you use are still folders of files on a server somewhere. They have more of them, and faster machines, but a browser asks for a file exactly the way it asks for yours."
          },
          {
            type: "activity",
            title: "Publish Yours",
            content: "Rename your me.html to index.html. Put it in a folder with your CSS file. Upload the folder to any free host and send the address to someone. Your site is now live on the internet."
          },
          {
            type: "recap",
            title: "Module 4 Recap",
            content: "• Your laptop cannot host a site — it sleeps\n• A host stays on and answers requests\n• The home page is called index.html\n• Every website is just files on a server"
          }
        ],
        exercises: [
          {
            type: "mcq",
            question: "What is a web server?",
            options: [
              "A program that turns HTML into a design",
              "A computer that stays online 24/7 hosting files",
              "The folder on your laptop where files live",
              "A browser tab that keeps a website open"
            ],
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
            type: "story",
            title: "Rhea Erases Two Hours",
            content: "Rhea spent two hours on a dragon sketch, then started colouring. One wrong swipe of the eraser and the wing was gone — sketch and colour together. She had drawn everything on one layer."
          },
          {
            type: "concept",
            title: "Layers Are Sheets of Glass",
            content: "A layer is a clear sheet stacked over your canvas. Sketch on the bottom one, ink on the next, colour on top. Erase the top sheet and everything underneath is untouched."
          },
          {
            type: "example",
            title: "Rhea's Three Sheets",
            content: "Rhea rebuilds the dragon:\n\nLayer 3 — colour\nLayer 2 — clean outlines\nLayer 1 — rough sketch\n\nShe hides Layer 1 and the sketch lines vanish from view without being deleted. She can turn them back on any time. This is what non-destructive means."
          },
          {
            type: "tip",
            title: "Name Them As You Go",
            content: "Every app calls new layers Layer 1, Layer 2, Layer 3. By drawing ten you will not remember which is which. Rename them the moment you make them: sketch, lines, skin, shadows."
          },
          {
            type: "activity",
            title: "Prove It To Yourself",
            content: "Make two layers. Scribble on the bottom one, then scribble over it on the top one. Erase the top scribble completely. Watch the bottom one survive untouched."
          },
          {
            type: "recap",
            title: "Module 1 Recap",
            content: "• A layer is a clear sheet over the canvas\n• Erasing one layer never touches the ones below\n• Hiding a layer is not deleting it\n• Name layers as you make them"
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
            type: "story",
            title: "Everything Looks Muddy",
            content: "Rhea picked twelve colours she liked for her dragon. Together they turned into brown sludge. Her friend used three colours and it looked better. Liking a colour is not the same as it belonging."
          },
          {
            type: "concept",
            title: "Opposites Make Things Pop",
            content: "On the colour wheel, opposite pairs are complementary: blue and orange, red and green, yellow and purple. Side by side each makes the other look brighter."
          },
          {
            type: "example",
            title: "Why Sunsets Work",
            content: "Look at almost any film poster with a sunset. Orange sky, blue shadow. Blockbuster posters use that pair so often it has a nickname: orange and teal. Rhea paints her dragon blue and puts it against an orange sky. Suddenly it stands out."
          },
          {
            type: "tip",
            title: "Three Colours, Not Twelve",
            content: "Pick one main colour, one opposite for contrast, and one neutral. Three is enough for a whole picture. More colours do not mean more interesting — usually they mean muddier."
          },
          {
            type: "activity",
            title: "Swap the Background",
            content: "Take any drawing you have. Fill the background with the colour opposite your subject on the wheel. Then try the same colour as your subject. Look at both and see which one your eye goes to."
          },
          {
            type: "recap",
            title: "Module 2 Recap",
            content: "• Opposite colours on the wheel are complementary\n• Side by side they make each other brighter\n• Blue and orange is the most used pair in film\n• Three colours beat twelve"
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
            type: "story",
            title: "Dead Centre and Dead Boring",
            content: "Rhea put the dragon exactly in the middle of the canvas, like she always does. It looks like a passport photo of a dragon. Correct, symmetrical, and completely still."
          },
          {
            type: "concept",
            title: "Split the Canvas Into Nine",
            content: "Draw two lines across and two down, like a noughts and crosses board. Put your subject where the lines cross instead of in the middle. The picture stops feeling frozen."
          },
          {
            type: "example",
            title: "Your Phone Already Does This",
            content: "Open your phone camera and turn on the grid in settings. You get the same nine boxes. Photographers line up horizons along the lower line and faces on a crossing point. Rhea moves her dragon onto the top-left crossing and leaves space for it to fly into."
          },
          {
            type: "fact",
            title: "Older Than Cameras",
            content: "The idea was written down for landscape painters in 1797, long before photography existed. Painters, photographers, film directors and game artists have all kept using it since."
          },
          {
            type: "activity",
            title: "Move One Thing",
            content: "Take a drawing where your subject sits in the middle. Turn on your app's grid and move the subject onto a crossing point. Leave empty space in the direction it faces. Compare the two."
          },
          {
            type: "recap",
            title: "Module 3 Recap",
            content: "• Split the canvas into nine boxes\n• Put the subject on a crossing, not the centre\n• Leave space in the direction it faces\n• Your phone camera has the same grid"
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
            type: "story",
            title: "The Flat Dragon",
            content: "Rhea's dragon is coloured, composed and still looks like a sticker. It has no weight. Nothing tells your eye whether the body is round or flat, because every part is exactly the same brightness."
          },
          {
            type: "concept",
            title: "Pick Where the Light Is",
            content: "Decide one spot the light comes from and stay with it. Surfaces turned toward it get a highlight. Surfaces turned away get shadow. That difference is what makes a shape look solid."
          },
          {
            type: "example",
            title: "Light From the Top Left",
            content: "Rhea puts her light at the top left:\n\nTop-left of each scale — lightest\nMiddle — the base colour\nBottom-right — shadow\n\nShe adds one shadow on the ground under the dragon and it stops floating. Three values and a ground shadow is enough to read as solid."
          },
          {
            type: "tip",
            title: "Squint At It",
            content: "Squint until the picture blurs. Colours disappear and only light and dark remain. If everything blurs into one grey mush, your shadows are too weak to read from across the room."
          },
          {
            type: "activity",
            title: "One Ball, Three Values",
            content: "Draw a circle. Pick a light direction. Fill it with a base colour, add a lighter patch facing the light and a darker one opposite. Add a shadow on the ground. You just drew a sphere."
          },
          {
            type: "recap",
            title: "Module 4 Recap",
            content: "• Choose one light direction and keep it\n• Facing the light is a highlight, away is shadow\n• A ground shadow stops things floating\n• Squint to check your darks are strong enough"
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
            options: [
              "The side turned away from the light source",
              "The side facing directly toward the light",
              "The part closest to the ground shadow",
              "The outline drawn around the whole shape"
            ],
            answer: "The side facing directly toward the light"
          }
        ]
      }
    ]
  }
];
