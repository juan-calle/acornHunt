"use strict";
/* AcornHunt.js is the last script loaded by the browser and it triggers the Start method of the Game_Singleton class, which initializes the
canvas and triggers the loading process of all the assets needed in the game. In this file, I declare three global objects that are accesible 
everywhere in the game: ID, sprites and sounds. ID will contain identifiers of game objects that interact with other game objects, in order to 
stablish a way for them to communicate and find each other. Sprites and sounds will hold all the sprites and sounds used in the game. Finally,
I call and fill the loadAssets and Initialize methods of the Game_Singleton class (where these methods are declared but empty).  
The reason for doing all this is to maximize the separation of generic from game-specific code. */

var ID = {};
var sprites = {};
var sounds = {};

/* Here I define the body of the method loadAssets from the Game_Singleton class */
myLibrary.Game.loadAssets = function () {

    /* I declare a variable that is a function. This function takes as parameters a sprite and a collisionMask. It uses the sprite as a 
    parameter for the SpriteSheet class in order to create and return a new instance of it. */
    var loadSprite = function (sprite, collisionMask) {
        return new myLibrary.SpriteSheet("assets/sprites/" + sprite /*, collisionMask*/);
    };

    /* I also declare another variable that works in a similar fashion as the one for loading sprites. This variable is a function that 
    passes a sound file and a boolean as parameters to the Sound class, in order to return a new instance of that class */
    var loadSound = function (sound, looping) {
        return new myLibrary.Sound("assets/sounds/" + sound, looping);
    };

    /* Then, I fill the global objects sprites & sounds with the assets that will be used in the game */

    /* Sprites for the game states */
    sprites.background_title = loadSprite("backgrounds/spr_title.png");
    sprites.background_help = loadSprite("backgrounds/spr_help.png");
    sprites.levelselect = loadSprite("backgrounds/spr_levelselect.png");
    sprites.level_solved = loadSprite("gui/spr_level_solved.png");
    sprites.level_unsolved = loadSprite("gui/spr_level_unsolved.png");
    sprites.level_locked = loadSprite("gui/spr_level_locked.png");    

    /* Sprites for the game overlays */
    sprites.frame_hint = loadSprite("overlays/spr_frame_hint.png");
    sprites.timer = loadSprite("overlays/spr_timer.png");
    if (myLibrary.Touch.isTouchDevice) {
        sprites.overlay_gameover = loadSprite("overlays/spr_gameover_tap.png");
        sprites.overlay_welldone = loadSprite("overlays/spr_welldone_tap.png");
    } else {
        sprites.overlay_gameover = loadSprite("overlays/spr_gameover_click.png");
        sprites.overlay_welldone = loadSprite("overlays/spr_welldone_click.png");
    }

    /* Sprites for the backgrounds of the levels */
    sprites.background_level = [];
    sprites.background_level[1] = loadSprite("backgrounds/spr_bgLevel1.png");
    sprites.background_level[2] = loadSprite("backgrounds/spr_bgLevel2.png");
    sprites.background_level[3] = loadSprite("backgrounds/spr_bgLevel3.png");
    sprites.background_level[4]= loadSprite("backgrounds/spr_bgLevel4.png");
    sprites.background_level[5]= loadSprite("backgrounds/spr_bgLevel5.png");
    sprites.background_level[6]= loadSprite("backgrounds/spr_bgLevel6.png");
    sprites.background_level[7]= loadSprite("backgrounds/spr_bgLevel7.png");
    sprites.background_level[8]= loadSprite("backgrounds/spr_bgLevel8.png");
    sprites.background_level[9]= loadSprite("backgrounds/spr_bgLevel9.png");
    sprites.background_level[10] = loadSprite("backgrounds/spr_bgLevel10.png");
    sprites.background_level[11] = loadSprite("backgrounds/spr_bgLevel11.png");
    sprites.background_level[12] = loadSprite("backgrounds/spr_bgLevel12.png");
    
    /* Sprites for the buttons */
    sprites.button_play = loadSprite("gui/spr_button_play.png");
    sprites.button_help = loadSprite("gui/spr_button_help.png");
    sprites.button_back = loadSprite("gui/spr_button_back.png");
    sprites.button_quit = loadSprite("gui/spr_button_quit.png");
    sprites.buttons_player = loadSprite("gui/spr_buttons_player@3.png");

    /* Sprites for the different tiles used to construct the platforms of the game */
    sprites.wall = loadSprite("tiles/spr_wall.png");
    sprites.wall_hot = loadSprite("tiles/spr_wall_hot.png");
    sprites.wall_ice = loadSprite("tiles/spr_wall_ice.png");
    sprites.platform = loadSprite("tiles/spr_platform.png");
    sprites.platform_hot = loadSprite("tiles/spr_platform_hot.png");
    sprites.platform_ice = loadSprite("tiles/spr_platform_ice.png");

    /* Sprites for the acorn and goal game objects */
    sprites.goal = loadSprite("spr_goal.png", true);
    sprites.acorn = loadSprite("spr_acorn.png");

    /* Sprites containing the player animations */
    sprites.player_idle = loadSprite("player/spr_idle.png", true);
    sprites.player_run = loadSprite("player/spr_run@5.png", true);
    sprites.player_jump = loadSprite("player/spr_jump@6.png", true);
    sprites.player_explode = loadSprite("player/spr_explode@5x5.png");

    /* Sounds */
    sounds.music = loadSound("snd_music", true);
    sounds.player_die = loadSound("snd_player_die");
    sounds.player_explode = loadSound("snd_player_explode");
    sounds.player_fall = loadSound("snd_player_fall");
    sounds.player_jump = loadSound("snd_player_jump");
    sounds.player_won = loadSound("snd_player_won");
    sounds.acorn_collected = loadSound("snd_acorn_collected");
};

/* Method of the Game_Singleton class that triggers the reproduction of sound, assign ids to layers, game objects and game states */
myLibrary.Game.initialize = function () {

    /* Adjust the volume and play music */
    sounds.music.volume = 0.3;
    sounds.music.play();

    /* The following code fills the global object ID with some identifiers */

    /* I declare some layers to manage the order in which some game objects are drawn */
    ID.layer_background = 0;
    // ID.layer_background_1 = 1;
    // ID.layer_background_2 = 2;
    // ID.layer_background_3 = 3;
    ID.layer_tiles = 4;
    ID.layer_objects = 5;
    ID.layer_overlays = 6;
    ID.layer_overlays_1 = 7;
    ID.layer_overlays_2 = 8;

    /* Assign IDs to different game objects to make it easier to find each other and interact */
    ID.player = 1;
    ID.timer = 10;
    ID.tiles = 11;
    ID.exit = 12;
    ID.hint_timer = 13;
    ID.button_walkleft = 14;
    ID.button_walkright = 15;
    ID.button_jump = 16;

    /* Adding the different game states and storing their ID's after adding them (by using their indices into the _gameStates array thanks
    to the returned value of the add method of the GameStateManager class) */
    ID.game_state_title = myLibrary.GameStateManager.add(new TitleMenuState());
    ID.game_state_help = myLibrary.GameStateManager.add(new HelpState());
    ID.game_state_playing = myLibrary.GameStateManager.add(new PlayingState());
    ID.game_state_levelselect = myLibrary.GameStateManager.add(new LevelMenuState());
    ID.game_state_gameover = myLibrary.GameStateManager.add(new GameOverState());
    ID.game_state_levelfinished = myLibrary.GameStateManager.add(new LevelFinishedState());

    /* Here I tell the GameStateManager that I want to start the game with the title screen */
    myLibrary.GameStateManager.switchTo(ID.game_state_title);
};