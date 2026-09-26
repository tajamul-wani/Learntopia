import math from "../assets/CourseImg/math-2.png";
import paint from "../assets/CourseImg/paint.png";
import finance from "../assets/CourseImg/finance-3.png";
import Dmarket from "../assets/CourseImg/Dmarket.png";
import coding from "../assets/CourseImg/coding.png";
import python from "../assets/CourseImg/python.png";
import computer from "../assets/CourseImg/computer.png";
import nutrition from "../assets/CourseImg/nutrition.png";
import ai from "../assets/CourseImg/ai.png";

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
  },
  {
    id: 7,
    category: "Computer Skills",
    title: "Computer Confident: Own the Machine",
    image: computer,
    desc: "Understand the computer you use every day: its operating system, the shortcuts that save you hours, how the internet reaches you, and how to send email that gets read.",
    duration: "4 hours",
    difficulty: "Beginner",
    prerequisites: ["A computer or tablet you can use"],
    learningObjectives: [
      "Recognise the main operating systems and what they do",
      "Use the shortcuts that save the most time",
      "Explain how a page travels from a server to your screen",
      "Write an email people actually read"
    ],
    xpPerModule: 50,
    totalXP: 300,
    badge: { name: "Computer Confident", icon: "cpu" },
    syllabus: [
      {
        title: "Module 1: The Boss of the Machine",
        desc: "What an operating system is and why yours looks the way it does.",
        xpReward: 50,
        contentSections: [
          {
            type: "story",
            title: "Zara's Borrowed Laptop",
            content: "Zara borrowed her cousin's laptop and nothing was where she expected. The buttons sat on the wrong side. Closing a window did not close the program. Same kind of machine, completely different rules."
          },
          {
            type: "concept",
            title: "The Operating System Runs Everything",
            content: "An operating system is the program in charge of all the others. It starts your apps, remembers your files, and draws everything you see. Every app has to ask it for permission."
          },
          {
            type: "example",
            title: "The Ones You Will Meet",
            content: "Windows — most laptops and PCs\nmacOS — Apple computers\nLinux — most of the servers behind websites\nAndroid and iOS — phones and tablets\n\nAndroid is built on Linux and iOS shares its roots with macOS, which is why a Mac and an iPhone feel like relatives."
          },
          {
            type: "fact",
            title: "You Already Use Several",
            content: "A phone, a laptop, a games console and a smart TV each run their own operating system. Most people use three or four every day without ever naming one of them."
          },
          {
            type: "activity",
            title: "Find Out What You Are Running",
            content: "On Windows press the Windows key and type About. On a Mac click the apple menu then About This Mac. On a phone open Settings and look for About. Write down the name and the version number."
          },
          {
            type: "recap",
            title: "Module 1 Recap",
            content: "• The operating system is in charge of every other program\n• Windows, macOS and Linux run computers; Android and iOS run phones\n• Android is built on Linux; iOS is related to macOS\n• You use several operating systems every day"
          }
        ],
        exercises: [
          {
            type: "mcq",
            question: "What is an operating system responsible for?",
            options: ["Only storing your photos safely", "Running every other program on the device", "Connecting your device to the internet", "Making the screen brighter or dimmer"],
            answer: "Running every other program on the device"
          },
          { type: "true-false", question: "A phone runs an operating system, just like a laptop does.", answer: true },
          { type: "fill-blank", question: "Most of the servers that host websites run the ___ operating system.", answer: "Linux" },
          {
            type: "match",
            question: "Match each operating system to where you find it:",
            pairs: [
              { term: "Windows", definition: "Most laptops and PCs" },
              { term: "macOS", definition: "Apple computers" },
              { term: "Android", definition: "Most phones and tablets" },
              { term: "Linux", definition: "Servers behind websites" }
            ]
          },
          {
            type: "mcq",
            question: "Why do a Mac and an iPhone feel similar to use?",
            options: ["They are made in the same factory", "Their operating systems share the same roots", "They both need a constant internet connection", "They were released in the very same year"],
            answer: "Their operating systems share the same roots"
          }
        ]
      },
      {
        title: "Module 2: Shortcuts That Buy You Time",
        desc: "The handful of key presses that replace a hundred mouse trips.",
        xpReward: 50,
        contentSections: [
          {
            type: "story",
            title: "Forty Minutes of Dragging",
            content: "Zara moved fifty photos into a folder one at a time, dragging each one. Her cousin did the next fifty in under a minute. He had not worked harder. He knew three key presses."
          },
          {
            type: "concept",
            title: "A Shortcut Is the Same Command, Faster",
            content: "Menus and shortcuts do exactly the same thing. The menu is easier to find; the shortcut is faster once you know it. Learning five is worth more than learning fifty."
          },
          {
            type: "example",
            title: "The Five Worth Knowing",
            content: "Ctrl+C copy, Ctrl+V paste\nCtrl+Z undo, Ctrl+Y redo\nCtrl+A select everything\nCtrl+S save\nCtrl+F find on this page\n\nOn a Mac, swap Ctrl for Cmd. Ctrl+Z is the most forgiving key on any keyboard."
          },
          {
            type: "tip",
            title: "Undo Goes Back Further Than You Think",
            content: "Undo is not one step. Press it again and again and most programs will keep walking backwards through what you did. Deleting something by accident is almost never permanent."
          },
          {
            type: "activity",
            title: "Race Yourself",
            content: "Open any document. Select all the text and copy it using only the menus, and count the seconds. Do it again with Ctrl+A and Ctrl+C. Try Ctrl+F to find a word on this page."
          },
          {
            type: "recap",
            title: "Module 2 Recap",
            content: "• A shortcut and a menu run the same command\n• Copy, paste, undo, select all, save and find cover most of it\n• Mac uses Cmd where Windows uses Ctrl\n• Undo keeps going back, so mistakes are rarely permanent"
          }
        ],
        exercises: [
          {
            type: "mcq",
            question: "What does Ctrl+Z do?",
            options: ["Saves the file you are working on", "Undoes the last thing you did", "Closes the window immediately", "Selects everything on the page"],
            answer: "Undoes the last thing you did"
          },
          { type: "true-false", question: "On a Mac you usually press Cmd where Windows uses Ctrl.", answer: true },
          { type: "fill-blank", question: "The shortcut for finding a word on the current page is Ctrl+___.", answer: "F" },
          {
            type: "match",
            question: "Match each shortcut to what it does:",
            pairs: [
              { term: "Ctrl+C", definition: "Copy" },
              { term: "Ctrl+V", definition: "Paste" },
              { term: "Ctrl+A", definition: "Select everything" },
              { term: "Ctrl+S", definition: "Save" }
            ]
          },
          {
            type: "mcq",
            question: "You delete a paragraph by mistake. What is the fastest fix?",
            options: ["Close without saving and start again", "Press Ctrl+Z to undo it", "Retype the paragraph from memory", "Restart the computer completely"],
            answer: "Press Ctrl+Z to undo it"
          }
        ]
      },
      {
        title: "Module 3: How a Page Reaches You",
        desc: "What happens between typing an address and seeing the page.",
        xpReward: 50,
        contentSections: [
          {
            type: "story",
            title: "The Homework That Vanished",
            content: "Zara's page would not load, so she blamed the website. Her cousin asked one question: does anything else load? Nothing did. The website was fine. Her wifi had dropped."
          },
          {
            type: "concept",
            title: "Your Browser Asks, a Server Answers",
            content: "Typing an address sends a request across the internet to a computer that holds the page. That computer sends the files back and your browser draws them. Every page you open is that round trip."
          },
          {
            type: "example",
            title: "Reading a Web Address",
            content: "https://www.example.com/photos\n\nhttps — the connection is encrypted\nwww.example.com — which computer to ask\n/photos — which page on it\n\nThe padlock means nobody in between can read what you send. It does not promise the site itself is honest."
          },
          {
            type: "tip",
            title: "Work Out Where It Broke",
            content: "When one page fails, try a second site. If everything fails it is your connection. If only one fails it is that site. One extra tab tells you which, before you restart anything."
          },
          {
            type: "activity",
            title: "Take an Address Apart",
            content: "Look at the address bar right now. Find the https, the site name and the part after the slash. Open a different site and compare the two. Spot which part changes as you click around."
          },
          {
            type: "recap",
            title: "Module 3 Recap",
            content: "• Your browser requests a page and a server sends it back\n• https means the connection is encrypted\n• The part after the slash picks the page\n• If every site fails, the problem is your connection"
          }
        ],
        exercises: [
          {
            type: "mcq",
            question: "What happens when you type a web address and press enter?",
            options: ["Your browser requests the page from a server", "The page is built fresh on your own computer", "Your internet provider chooses a site for you", "The browser searches files stored on your device"],
            answer: "Your browser requests the page from a server"
          },
          { type: "true-false", question: "The padlock means your connection is encrypted, not that the site is trustworthy.", answer: true },
          { type: "fill-blank", question: "In https://example.com/photos, the part that picks which page to show is ___.", answer: "/photos" },
          {
            type: "match",
            question: "Match each part of a web address to its job:",
            pairs: [
              { term: "https", definition: "The connection is encrypted" },
              { term: "example.com", definition: "Which computer to ask" },
              { term: "/photos", definition: "Which page on that computer" },
              { term: "Browser", definition: "Draws the page for you" }
            ]
          },
          {
            type: "mcq",
            question: "One site will not load but every other site works. What is most likely?",
            options: ["Your wifi has stopped working", "Something is wrong with that one site", "Your computer needs to be restarted", "Your browser needs reinstalling today"],
            answer: "Something is wrong with that one site"
          }
        ]
      },
      {
        title: "Module 4: Email People Actually Read",
        desc: "How email works, and how to write one that gets a reply.",
        xpReward: 50,
        contentSections: [
          {
            type: "story",
            title: "No Subject, No Reply",
            content: "Zara emailed her teacher with an empty subject line and one word in the body: question. Three days passed with no answer. The teacher had over two hundred unread emails and no reason to open that one."
          },
          {
            type: "concept",
            title: "The Subject Line Does the Work",
            content: "Most people decide whether to open an email from the subject alone. A good one says what it is about and what you need. Vague subjects get skipped, not refused."
          },
          {
            type: "example",
            title: "The Same Email, Twice",
            content: "Subject: question\nBody: I have a question\n\nSubject: Science homework — can I hand it in Friday?\nBody: Hi Ms Diaz, I was ill on Tuesday and missed the notes. Could I hand the report in on Friday? Thank you, Zara\n\nThe second one can be answered in four seconds."
          },
          {
            type: "tip",
            title: "Check the Address Before the Words",
            content: "An email that looks official can still come from anyone. Read the address itself, not the display name. Anything asking for a password or a code is worth showing to an adult before you reply."
          },
          {
            type: "activity",
            title: "Rewrite a Weak Subject",
            content: "Write a subject line for: asking to join the football team, asking about a lost jumper, thanking someone for help. Each one should say the topic and what you want in under ten words."
          },
          {
            type: "recap",
            title: "Module 4 Recap",
            content: "• People decide from the subject line whether to open it\n• Say the topic and what you need\n• Cc copies someone in; everyone can see who\n• Read the real address, and never send a password"
          }
        ],
        exercises: [
          {
            type: "mcq",
            question: "Why does a clear subject line matter so much?",
            options: ["It makes the email arrive more quickly", "People decide from it whether to open it", "Email will not send without one", "It stops the message going to spam"],
            answer: "People decide from it whether to open it"
          },
          { type: "true-false", question: "Everyone in the To and Cc fields can see who else received the email.", answer: true },
          { type: "fill-blank", question: "To copy someone into an email without making them the main recipient, put them in ___.", answer: "Cc" },
          {
            type: "match",
            question: "Match each email field to what it is for:",
            pairs: [
              { term: "To", definition: "Who the email is for" },
              { term: "Cc", definition: "Someone kept in the loop" },
              { term: "Subject", definition: "What it is about" },
              { term: "Attachment", definition: "A file sent along with it" }
            ]
          },
          {
            type: "mcq",
            question: "An email says your account will close unless you send your password. What should you do?",
            options: ["Reply quickly so nothing is lost", "Show an adult and send nothing", "Send it only if the logo looks right", "Forward it to everyone as a warning"],
            answer: "Show an adult and send nothing"
          }
        ]
      }
    ]
  },
  {
    id: 8,
    category: "Health",
    title: "Food Scientist: What Your Body Does With Food",
    image: nutrition,
    desc: "Find out what a calorie really is, what carbs, protein and fat each do inside you, and why a footballer and a toddler need completely different amounts.",
    duration: "3 hours",
    difficulty: "Beginner",
    prerequisites: ["Curiosity about what is on your plate"],
    learningObjectives: [
      "Explain what a calorie measures",
      "Describe what carbs, protein and fat each do",
      "Say why vitamins and minerals matter in tiny amounts",
      "Explain why different people need different amounts of food"
    ],
    xpPerModule: 50,
    totalXP: 300,
    badge: { name: "Nutrition Navigator", icon: "zap" },
    syllabus: [
      {
        title: "Module 1: What a Calorie Actually Is",
        desc: "A unit of energy, not a score you are winning or losing.",
        xpReward: 50,
        contentSections: [
          {
            type: "story",
            title: "Theo Reads the Box",
            content: "Theo turned over his cereal box and found a number: 380 calories. He had heard people say calories were bad. But cereal is not bad. He wanted to know what the number actually meant."
          },
          {
            type: "concept",
            title: "A Calorie Measures Energy",
            content: "A calorie is a unit, like a centimetre or a litre. It measures how much energy a food can give your body. More calories means more energy, the way a bigger tank holds more fuel."
          },
          {
            type: "example",
            title: "What Your Body Spends It On",
            content: "Running and football — the part everyone thinks of\nBreathing, pumping blood, staying warm\nGrowing taller and building muscle\nThinking, all day, at school\n\nMost of the energy you use goes on staying alive and growing, not on exercise."
          },
          {
            type: "fact",
            title: "Your Brain Is Hungry",
            content: "Your brain is about two percent of your weight but uses around twenty percent of your energy. Sitting still and concentrating hard genuinely costs fuel."
          },
          {
            type: "activity",
            title: "Hunt for the Number",
            content: "Find three packets in your kitchen. Write down the calories per 100 grams for each. Put them in order, then ask yourself which one surprised you and why."
          },
          {
            type: "recap",
            title: "Module 1 Recap",
            content: "• A calorie is a unit of energy, like a centimetre is a unit of length\n• It is not a good or bad score\n• Most of your energy goes on living and growing\n• Your brain alone uses about a fifth of it"
          }
        ],
        exercises: [
          {
            type: "mcq",
            question: "What does a calorie measure?",
            options: ["How much sugar a food holds", "How much energy a food can give you", "How heavy a portion of food is", "How long a food takes to digest"],
            answer: "How much energy a food can give you"
          },
          { type: "true-false", question: "Most of the energy you use each day goes on exercise.", answer: false },
          { type: "fill-blank", question: "A calorie is a unit of ___.", answer: "energy" },
          {
            type: "match",
            question: "Match each job to what it needs energy for:",
            pairs: [
              { term: "Breathing", definition: "Running your body at rest" },
              { term: "Growing", definition: "Building new bone and muscle" },
              { term: "Thinking", definition: "Powering your brain" },
              { term: "Running", definition: "Moving your muscles hard" }
            ]
          },
          {
            type: "mcq",
            question: "Roughly how much of your energy does your brain use?",
            options: ["About two percent", "About twenty percent", "About half of it", "Almost none of it"],
            answer: "About twenty percent"
          }
        ]
      },
      {
        title: "Module 2: The Big Three",
        desc: "Carbohydrate, protein and fat, and what each one is for.",
        xpReward: 50,
        contentSections: [
          {
            type: "story",
            title: "Theo's Flat Afternoon",
            content: "Theo had toast and jam for breakfast and felt great, then ran out of steam by second lesson. His friend had eggs on toast and was still going. Same amount of food, very different afternoon."
          },
          {
            type: "concept",
            title: "Three Kinds of Fuel",
            content: "Macronutrients are the three things your body needs in large amounts. Carbohydrate is quick energy, protein is building material, fat is long-lasting energy and protection. Macro just means big."
          },
          {
            type: "example",
            title: "What Each One Does",
            content: "Carbohydrate — bread, rice, fruit. Fast energy for right now.\nProtein — eggs, beans, fish, lentils. Builds and repairs muscle.\nFat — nuts, olive oil, cheese. Slow energy, protects your organs, helps your brain.\n\nA meal with all three keeps you going far longer than one with only carbs."
          },
          {
            type: "tip",
            title: "No Macro Is the Villain",
            content: "People take turns blaming fat, then carbs, then something else. Your body needs all three. A body with no fat or no carbohydrate does not run better, it runs worse."
          },
          {
            type: "activity",
            title: "Sort Your Lunch",
            content: "Think of the last meal you ate. Write each part under carbohydrate, protein or fat. Some foods land in two columns. Notice whether any column was empty."
          },
          {
            type: "recap",
            title: "Module 2 Recap",
            content: "• Macro means big: the three you need most of\n• Carbohydrate is quick energy\n• Protein builds and repairs you\n• Fat is slow energy and protection\n• You need all three, not two of them"
          }
        ],
        exercises: [
          {
            type: "mcq",
            question: "Which macronutrient is mainly used to build and repair muscle?",
            options: ["Carbohydrate", "Protein", "Fat", "Water"],
            answer: "Protein"
          },
          { type: "true-false", question: "A healthy body needs carbohydrate, protein and fat, not just two of them.", answer: true },
          { type: "fill-blank", question: "The word macro in macronutrient means ___.", answer: "big" },
          {
            type: "match",
            question: "Match each macronutrient to its main job:",
            pairs: [
              { term: "Carbohydrate", definition: "Quick energy" },
              { term: "Protein", definition: "Building and repairing" },
              { term: "Fat", definition: "Slow energy and protection" },
              { term: "All three", definition: "A meal that lasts" }
            ]
          },
          {
            type: "mcq",
            question: "Why did Theo run out of energy before his friend did?",
            options: ["He ate far too little food", "His meal was almost all carbohydrate", "He ate too much protein at once", "He drank no water with breakfast"],
            answer: "His meal was almost all carbohydrate"
          }
        ]
      },
      {
        title: "Module 3: Tiny Amounts, Big Jobs",
        desc: "Vitamins and minerals, and why the amount is no measure of importance.",
        xpReward: 50,
        contentSections: [
          {
            type: "story",
            title: "The Sailors Who Ate Limes",
            content: "Long sea voyages used to leave sailors exhausted with bleeding gums. Plenty of food, plenty of energy. What they were missing weighed almost nothing: vitamin C. Limes fixed it."
          },
          {
            type: "concept",
            title: "Micronutrients Are Tools, Not Fuel",
            content: "Vitamins and minerals give you no energy at all. Your body uses them to do jobs: build bone, carry oxygen, heal cuts. Micro means small, and you need only tiny amounts."
          },
          {
            type: "example",
            title: "A Few and What They Do",
            content: "Iron — carries oxygen in your blood\nCalcium — builds bones and teeth\nVitamin C — heals wounds, helps you absorb iron\nVitamin D — lets your body use calcium\n\nVitamin C helps you absorb iron, so beans with tomatoes beat beans alone."
          },
          {
            type: "fact",
            title: "Sunlight Makes One of Them",
            content: "Vitamin D is the odd one out: your skin makes it from sunlight. It is the only vitamin your body can produce itself, which is why it runs low in long dark winters."
          },
          {
            type: "activity",
            title: "Colour Count",
            content: "Count how many different colours of fruit and vegetable you ate yesterday. Different colours usually mean different micronutrients. Aim to add one new colour tomorrow."
          },
          {
            type: "recap",
            title: "Module 3 Recap",
            content: "• Micronutrients give no energy; they let your body do jobs\n• Iron carries oxygen, calcium builds bone\n• Vitamin C helps you absorb iron\n• Your skin makes vitamin D from sunlight"
          }
        ],
        exercises: [
          {
            type: "mcq",
            question: "What do vitamins and minerals give your body?",
            options: ["Energy to run and play", "Tools to do jobs like building bone", "Extra weight to grow taller", "Water to keep you hydrated"],
            answer: "Tools to do jobs like building bone"
          },
          { type: "true-false", question: "Vitamin D is the one vitamin your own skin can make, using sunlight.", answer: true },
          { type: "fill-blank", question: "The mineral that carries oxygen around in your blood is ___.", answer: "iron" },
          {
            type: "match",
            question: "Match each micronutrient to its job:",
            pairs: [
              { term: "Iron", definition: "Carries oxygen in your blood" },
              { term: "Calcium", definition: "Builds bones and teeth" },
              { term: "Vitamin C", definition: "Heals cuts and helps absorb iron" },
              { term: "Vitamin D", definition: "Lets your body use calcium" }
            ]
          },
          {
            type: "mcq",
            question: "Why does micro appear in the word micronutrient?",
            options: ["They are found only in small foods", "You need them in tiny amounts", "They were discovered most recently", "They are the least important ones"],
            answer: "You need them in tiny amounts"
          }
        ]
      },
      {
        title: "Module 4: Why Nobody Needs the Same Amount",
        desc: "Age, size and how you spend your day all change the answer.",
        xpReward: 50,
        contentSections: [
          {
            type: "story",
            title: "Three Plates at One Table",
            content: "Theo's family sat down together: his baby sister, his uncle who runs marathons, and his grandmother. Three very different plates, and every one of them was right for the person eating it."
          },
            {
            type: "concept",
            title: "Your Body Sets the Amount",
            content: "How much energy someone needs depends on their size, their age, and how they spend their day. A bigger body costs more to run. A growing body costs more still."
          },
          {
            type: "example",
            title: "Same Family, Different Needs",
            content: "A marathon runner spends hours moving, so needs a lot.\nA toddler is small but growing fast, so needs a surprising amount for their size.\nAn older person who moves less needs less.\n\nNone of these is better than another. They are answers to different questions."
          },
          {
            type: "tip",
            title: "There Is No Right Number for a Child",
            content: "Growing bodies need plenty, and appetite changes week to week, which is normal. Nobody your age should be counting or limiting. If you ever wonder about your own eating, a doctor is who answers that, not the internet."
          },
          {
            type: "activity",
            title: "Guess the Bigger Need",
            content: "For each pair, say who likely needs more energy in a day and why: a swimmer training daily or someone resting with a broken leg; a teenager mid-growth-spurt or a smaller adult. Say your reason out loud."
          },
          {
            type: "recap",
            title: "Module 4 Recap",
            content: "• Size, age and activity all change how much energy someone needs\n• Growing bodies need a lot for their size\n• Different needs are not better or worse\n• There is no correct number for a child, and a doctor answers that question"
          }
        ],
        exercises: [
          {
            type: "mcq",
            question: "Which of these changes how much energy a person needs in a day?",
            options: ["Only how much they weigh", "Their size, age and how active they are", "Only the sports they play", "The time of year it happens to be"],
            answer: "Their size, age and how active they are"
          },
          { type: "true-false", question: "A toddler needs a surprising amount of energy for their size, because they are growing fast.", answer: true },
          { type: "fill-blank", question: "If you have a question about your own eating, the person to ask is a ___.", answer: "doctor" },
          {
            type: "match",
            question: "Match each person to why their needs differ:",
            pairs: [
              { term: "Marathon runner", definition: "Hours of hard movement" },
              { term: "Toddler", definition: "Small, but growing fast" },
              { term: "Older adult", definition: "Usually moves less" },
              { term: "Teenager", definition: "Growing quickly and active" }
            ]
          },
          {
            type: "mcq",
            question: "Two people eat very different amounts. What does that tell you?",
            options: ["One of them is eating wrongly", "Their bodies need different amounts", "The bigger plate is always better", "They should swap their meals over"],
            answer: "Their bodies need different amounts"
          }
        ]
      }
    ]
  },
  {
    id: 9,
    category: "AI Literacy",
    title: "AI Explained: How It Learns and Where It Fails",
    image: ai,
    desc: "Understand how AI learns from examples, why it sounds certain even when it is wrong, how it picks up unfairness, and how to use it without handing over your thinking.",
    duration: "4 hours",
    difficulty: "Beginner",
    prerequisites: ["No experience needed"],
    learningObjectives: [
      "Explain how a machine learns from examples",
      "Say why AI can be confidently wrong",
      "Recognise where unfairness gets into a system",
      "Use AI as a helper without letting it think for you"
    ],
    xpPerModule: 50,
    totalXP: 300,
    badge: { name: "Clear Thinker", icon: "cpu" },
    syllabus: [
      {
        title: "Module 1: Learning From Examples",
        desc: "How machines got from fixed rules to spotting patterns.",
        xpReward: 50,
        contentSections: [
          {
            type: "story",
            title: "Nia Tries to Write the Rules",
            content: "Nia tried to write instructions for telling a cat from a dog. Four legs, fur, whiskers, tail. Every rule she wrote matched both. After an hour she had no rule that worked."
          },
            {
            type: "concept",
            title: "Show It, Do Not Tell It",
            content: "Older programs followed rules a person wrote. Modern AI is shown thousands of examples instead and works out the pattern itself. Nobody tells it what a whisker is."
          },
          {
            type: "example",
            title: "Three Eras, Same Question",
            content: "Rules — a person writes: if it barks, it is a dog. Breaks on a quiet dog.\nLearning — show it many labelled photos. It finds the pattern.\nGenerating — after enough examples, it can produce new text or pictures too.\n\nEach step needed more examples and more computing power, not a cleverer rule."
          },
          {
            type: "fact",
            title: "It Has Never Seen a Cat",
            content: "An image model has no idea what fur feels like or that cats purr. It has only ever seen numbers describing pixels. It recognises the pattern without understanding the animal."
          },
          {
            type: "activity",
            title: "Try Writing the Rules",
            content: "Write instructions for telling a cup from a bowl, precise enough for someone who has never seen either. Test them on five real objects. Count how many your rules get wrong."
          },
          {
            type: "recap",
            title: "Module 1 Recap",
            content: "• Old programs followed rules a person wrote\n• Modern AI learns the pattern from many examples\n• More examples and power, not cleverer rules\n• Recognising a pattern is not understanding it"
          }
        ],
        exercises: [
          {
            type: "mcq",
            question: "How does modern AI mostly learn to tell things apart?",
            options: ["A person writes rules for every case", "It finds patterns in many examples", "It looks the answer up online", "It asks a human each time"],
            answer: "It finds patterns in many examples"
          },
          { type: "true-false", question: "An image model understands what a cat is in the way a person does.", answer: false },
          { type: "fill-blank", question: "Instead of being given rules, modern AI is given many ___ to learn from.", answer: "examples" },
          {
            type: "match",
            question: "Match each approach to what it does:",
            pairs: [
              { term: "Rules", definition: "A person writes every instruction" },
              { term: "Learning", definition: "Finds patterns in examples" },
              { term: "Generating", definition: "Produces new text or pictures" },
              { term: "Examples", definition: "What the learning is built from" }
            ]
          },
          {
            type: "mcq",
            question: "Why did Nia's cat-and-dog rules keep failing?",
            options: ["She did not write enough of them", "Nearly every rule matched both animals", "Her computer was too slow to run them", "Cats and dogs are actually identical"],
            answer: "Nearly every rule matched both animals"
          }
        ]
      },
      {
        title: "Module 2: Confidently Wrong",
        desc: "Why AI invents things, and why it never sounds unsure.",
        xpReward: 50,
        contentSections: [
          {
            type: "story",
            title: "The Book That Did Not Exist",
            content: "Nia asked an AI for books about volcanoes. It gave five titles with authors and years. Her librarian found four. The fifth did not exist and never had, but it had looked exactly as real as the others."
          },
          {
            type: "concept",
            title: "It Predicts, It Does Not Look Up",
            content: "A language model guesses what words usually come next. It is not searching a library. A made-up title fits the pattern of real titles perfectly, so it comes out sounding just as convincing."
          },
          {
            type: "example",
            title: "Where It Is Weakest",
            content: "Exact numbers and dates\nWho said or wrote what\nAnything very recent\nLinks and references\n\nThese are the details a pattern cannot supply. It produces something shaped correctly rather than something checked."
          },
          {
            type: "tip",
            title: "Confidence Is Not Evidence",
            content: "AI writes a wrong answer in the same calm, tidy voice as a right one. There is no wobble to warn you. Anything that matters gets checked somewhere else, every time."
          },
          {
            type: "activity",
            title: "Catch One Out",
            content: "Ask an AI about something you know well: a local place, your favourite sport, a family hobby. Look for the detail it gets slightly wrong. Notice how certain it sounds while doing it."
          },
          {
            type: "recap",
            title: "Module 2 Recap",
            content: "• A language model predicts likely words, it does not look things up\n• Invented facts look exactly like real ones\n• Numbers, dates, sources and recent events are weakest\n• Sounding certain is not the same as being right"
          }
        ],
        exercises: [
          {
            type: "mcq",
            question: "Why can an AI invent a book that does not exist?",
            options: ["Its library is out of date", "It predicts likely words rather than looking up", "Somebody deleted the real record", "It is deliberately trying to mislead"],
            answer: "It predicts likely words rather than looking up"
          },
          { type: "true-false", question: "AI usually sounds less confident when its answer is wrong.", answer: false },
          { type: "fill-blank", question: "A language model works by predicting which ___ come next.", answer: "words" },
          {
            type: "match",
            question: "Match each thing to how much checking it needs:",
            pairs: [
              { term: "An exact date", definition: "Check it elsewhere" },
              { term: "A source or link", definition: "Check it elsewhere" },
              { term: "Explaining an idea", definition: "Usually safer ground" },
              { term: "Very recent news", definition: "Check it elsewhere" }
            ]
          },
          {
            type: "mcq",
            question: "An AI gives you a fact for your homework. What is the sensible next step?",
            options: ["Use it, it sounded sure", "Check it in another source", "Ask the same AI again", "Only use it if it is short"],
            answer: "Check it in another source"
          }
        ]
      },
      {
        title: "Module 3: Where Unfairness Gets In",
        desc: "A system learns whatever the examples contain, including the unfair parts.",
        xpReward: 50,
        contentSections: [
          {
            type: "story",
            title: "The Drawing That Was Always the Same",
            content: "Nia asked an AI to draw a scientist ten times. Every picture was an older man in a white coat. Nia's own science teacher is a young woman. The machine was not being unkind; it was repeating what it had been shown."
          },
          {
            type: "concept",
            title: "The Examples Carry the Bias",
            content: "A model can only learn from what it is given. If the examples over-represent one kind of person, the output does too. The unfairness came in with the data, not from an opinion."
          },
          {
            type: "example",
            title: "Where It Shows Up",
            content: "Pictures that always show one kind of person in a job\nVoice tools that struggle with some accents\nTranslations that guess a gender that was never stated\n\nEach one is a pattern from the examples, repeated back and now much faster and at much larger scale."
          },
          {
            type: "tip",
            title: "Ask Who Is Missing",
            content: "When AI describes a group of people, ask who is not in the picture. The gap is usually a gap in the examples, and it is far easier to spot from outside than from inside."
          },
          {
            type: "activity",
            title: "Run the Test Yourself",
            content: "Ask an image tool for a nurse, a chef and a pilot several times each. Tally what you get. Compare it with people doing those jobs where you actually live."
          },
          {
            type: "recap",
            title: "Module 3 Recap",
            content: "• A model learns only from the examples it is given\n• Unfair examples produce unfair output\n• It repeats patterns rather than holding opinions\n• Asking who is missing is the quickest check"
          }
        ],
        exercises: [
          {
            type: "mcq",
            question: "Why might an AI keep drawing the same kind of person for one job?",
            options: ["It has decided who belongs there", "Its examples mostly showed that person", "It is copying another AI system", "Pictures of other people are harder"],
            answer: "Its examples mostly showed that person"
          },
          { type: "true-false", question: "Bias in AI usually comes from the examples it learned from.", answer: true },
          { type: "fill-blank", question: "When AI shows a group of people, a good question is who is ___.", answer: "missing" },
          {
            type: "match",
            question: "Match each example to the gap behind it:",
            pairs: [
              { term: "Always the same scientist", definition: "Narrow picture examples" },
              { term: "Struggles with an accent", definition: "Narrow voice examples" },
              { term: "Guesses a gender", definition: "Patterns in old text" },
              { term: "Who is missing", definition: "The question that finds it" }
            ]
          },
          {
            type: "mcq",
            question: "What makes this kind of unfairness a bigger problem than one person's opinion?",
            options: ["Machines are impossible to correct", "It repeats at enormous speed and scale", "It only ever affects pictures", "It cannot be noticed by anyone"],
            answer: "It repeats at enormous speed and scale"
          }
        ]
      },
      {
        title: "Module 4: Using It Without Outsourcing Your Brain",
        desc: "Where AI genuinely helps, and where using it costs you the learning.",
        xpReward: 50,
        contentSections: [
          {
            type: "story",
            title: "Two Ways to Hand In an Essay",
            content: "Nia asked an AI to write her essay and handed it in. Her friend asked it to explain the confusing part, then wrote his own. Both handed in work. Only one of them could answer a question about it afterwards."
          },
          {
            type: "concept",
            title: "A Helper, Not a Replacement",
            content: "AI is good at explaining something a second way, suggesting a starting point, or checking your spelling. It is a poor substitute for the thinking, because the thinking is the part that changes you."
          },
          {
            type: "example",
            title: "Good Question, Poor Question",
            content: "Poor: write my essay about volcanoes\nGood: explain why magma rises, as if I am twelve\n\nPoor: solve this maths problem\nGood: I got 42 and the answer is 36, where did I go wrong?\n\nThe good ones leave the work with you and use the AI for the stuck part."
          },
          {
            type: "tip",
            title: "Never Feed It Private Things",
            content: "Your full name, address, school, passwords and photos of other people do not belong in a chat box. Treat anything you type as something you would be comfortable reading aloud."
          },
          {
            type: "activity",
            title: "Turn a Poor Question Good",
            content: "Take something you found hard this week. Write the lazy version of the question, then rewrite it so the AI explains and you still do the work. Notice which one teaches you more."
          },
          {
            type: "recap",
            title: "Module 4 Recap",
            content: "• AI explains and suggests well; it thinks for you badly\n• Ask it to explain, not to replace the work\n• The struggle is the part that teaches you\n• Private details never go into a chat box"
          }
        ],
        exercises: [
          {
            type: "mcq",
            question: "Which is the better way to use AI for homework?",
            options: ["Ask it to write the whole answer", "Ask it to explain the confusing part", "Copy it and change a few words", "Use it only when you are tired"],
            answer: "Ask it to explain the confusing part"
          },
          { type: "true-false", question: "Your address, school and passwords should never be typed into an AI chat.", answer: true },
          { type: "fill-blank", question: "AI is a good ___, but a poor replacement for your own thinking.", answer: "helper" },
          {
            type: "match",
            question: "Match each use to whether it helps you learn:",
            pairs: [
              { term: "Explain this again", definition: "Helps you learn" },
              { term: "Write it for me", definition: "Skips the learning" },
              { term: "Where did I go wrong", definition: "Helps you learn" },
              { term: "Give me the answer", definition: "Skips the learning" }
            ]
          },
          {
            type: "mcq",
            question: "Why could Nia's friend answer questions about his essay when she could not?",
            options: ["He is naturally better at writing", "He did the thinking himself", "His essay happened to be longer", "He picked an easier subject"],
            answer: "He did the thinking himself"
          }
        ]
      }
    ]
  },
];
