/* As explained in the Tile class I decided to separate the content of the levels' game worlds from the game logic. In order to do so,
I store each levels' info into a global array that needs to be accesible from everywhere, but in a separate file that is placed
in the assets folder rather than in the folders containing the game code. In JS, global variables should be avoided because the global namespace
can get overloaded with lots of global variables, slowing the execution of the script. They can also be a cause of conflicts when two different
JS files use the same global variables and they make harder-to-read code while difficulting the overlook of which data is used where. For
that, I use the following approach: */

/* To clarify that I am using a global variable to store the info of the levels, I write the name of the array in capital letters and I
clearly show that it belongs to the global domain (window) */
window.LEVELS = [];

/* I define the game world of a level by pushing composite variables into the LEVELS array. These composite variables contain a hint that will
be displayed to help the user solve the level, information about wheter the level is locked/unlocked and/or solved/unsolved, and the actual
disposition of tiles that build the level. */
window.LEVELS.push({
    hint  :     "Pick up all the acorns and reach the exit on time!",
    background : 1,
    locked :    false,
    solved :    false,
    tiles :    ["....................",
                ".................X..",
                "..........#########.",
                "....................",
                "AAA....AAAA.........",
                "---....####.........",
                "....................",
                "AAA.................",
                "###.........AAAAA...",
                "............#####...",
                "....AAA.............",
                "....---.............",
                "....................",
                ".1........A.A.A.A.A.",
                "####################",]
});

window.LEVELS.push({
    hint :      "Carefull with the hot tiles. They make time fly!",
    background : 2,
    locked :    true,
    solved :    false,
    tiles :    ["....................",
                "..................X.",
                "..........++++++++++",
                "....................",
                "AAA....AAAA.........",
                "---....++++.........",
                "....................",
                "AAA.................",
                "###.........AAAAA...",
                "............#####...",
                "....AAA.............",
                "....---.............",
                "....................",
                ".1........A.A.A.A.A.",
                "###.......++++++++++"]
});

window.LEVELS.push({
    hint :      "Ice tiles will make you slide!",
    background : 3,
    locked :    true,
    solved :    false,
    tiles :    ["....................",
                "..................X.",
                "..........@@@@@@@@@@",
                "AAA.................",
                "***....AAAA.........",
                ".......@@@@.........",
                "....................",
                "AAA.................",
                "@@@@@@@.....AAAAA...",
                "............*****...",
                "....AAA.............",
                "....---.............",
                "....................",
                ".1..............A.A.",
                "#######....#########"]
});

window.LEVELS.push({
    hint :      "",
    background : 4,
    locked :    true,
    solved :    false,
    tiles :    ["....................",
                "..................X.",
                "..........##########",
                "....................",
                "AAA....AAAA.........",
                "---....####.........",
                "....................",
                "AAA.................",
                "###.........AAAAA...",
                "............#####...",
                "....AAA.............",
                "....---.............",
                "....................",
                ".1........A.A.A.A.A.",
                "####################"]
});

window.LEVELS.push({
    hint :      "",
    background : 5,
    locked :    true,
    solved :    false,
    tiles :    ["....................",
                "..................X.",
                "..........##########",
                "....................",
                "AAA....AAAA.........",
                "---....####.........",
                "....................",
                "AAA.................",
                "###.........AAAAA...",
                "............#####...",
                "....AAA.............",
                "....---.............",
                "....................",
                ".1........A.A.A.A.A.",
                "####################"]
});

window.LEVELS.push({
    hint :      "",
    background : 6,
    locked :    true,
    solved :    false,
    tiles :    ["....................",
                "..................X.",
                "..........##########",
                "....................",
                "AAA....AAAA.........",
                "---....####.........",
                "....................",
                "AAA.................",
                "###.........AAAAA...",
                "............#####...",
                "....AAA.............",
                "....---.............",
                "....................",
                ".1........A.A.A.A.A.",
                "####################"]
});

window.LEVELS.push({
    hint :      "",
    background : 7,
    locked :    true,
    solved :    false,
    tiles :    ["....................",
                "..................X.",
                "..........##########",
                "....................",
                "AAA....AAAA.........",
                "---....####.........",
                "....................",
                "AAA.................",
                "###.........AAAAA...",
                "............#####...",
                "....AAA.............",
                "....---.............",
                "....................",
                ".1........A.A.A.A.A.",
                "####################"]
});

window.LEVELS.push({
    hint :      "",
    background : 8,
    locked :    true,
    solved :    false,
    tiles :    ["....................",
                "..................X.",
                "..........##########",
                "....................",
                "AAA....AAAA.........",
                "---....####.........",
                "....................",
                "AAA.................",
                "###.........AAAAA...",
                "............#####...",
                "....AAA.............",
                "....---.............",
                "....................",
                ".1........A.A.A.A.A.",
                "####################"]
});

window.LEVELS.push({
    hint :      "",
    background : 9,
    locked :    true,
    solved :    false,
    tiles :    ["....................",
                "..................X.",
                "..........##########",
                "....................",
                "AAA....AAAA.........",
                "---....####.........",
                "....................",
                "AAA.................",
                "###.........AAAAA...",
                "............#####...",
                "....AAA.............",
                "....---.............",
                "....................",
                ".1........A.A.A.A.A.",
                "####################"]
});

window.LEVELS.push({
    hint :      "",
    background : 10,
    locked :    true,
    solved :    false,
    tiles :    ["....................",
                "..................X.",
                "..........##########",
                "....................",
                "AAA....AAAA.........",
                "---....####.........",
                "....................",
                "AAA.................",
                "###.........AAAAA...",
                "............#####...",
                "....AAA.............",
                "....---.............",
                "....................",
                ".1........A.A.A.A.A.",
                "####################"]

});

window.LEVELS.push({
    hint :      "",
    background : 11,
    locked :    true,
    solved :    false,
    tiles :    ["....................",
                "..................X.",
                "..........##########",
                "....................",
                "AAA....AAAA.........",
                "---....####.........",
                "....................",
                "AAA.................",
                "###.........AAAAA...",
                "............#####...",
                "....AAA.............",
                "....---.............",
                "....................",
                ".1........A.A.A.A.A.",
                "####################"]
});

window.LEVELS.push({
    hint :      "",
    background : 12,
    locked :    true,
    solved :    false,
    tiles :    ["....................",
                "..................X.",
                "..........##########",
                "....................",
                "AAA....AAAA.........",
                "---....####.........",
                "....................",
                "AAA.................",
                "###.........AAAAA...",
                "............#####...",
                "....AAA.............",
                "....---.............",
                "....................",
                ".1........A.A.A.A.A.",
                "####################"]
});
