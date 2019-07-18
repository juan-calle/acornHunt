"use strict";
/* Unlike the rest of game states where static screens with some buttons are displayed, the PlayingState consists of a list of levels, each 
represented by its own game world. Therefore, it makes no sense for this class to inherit from GameObjectList (like the rest of game states)
because this class has to be able to switch between game worlds (levels), which means it needs to have game-loop methods (handleInput, update,
draw & reset); that is why it inherits from the IGameLoopObject interface. In the constructor, I first call the the constructor of the interface, 
I declare some member variables and I call a couple of functions */
function PlayingState() {
    myLibrary.IGameLoopObject.call(this);

    /* Variable that will hold the index of the currently active level stored in the levels array. by default is -1 */
    this.currentLevelIndex = -1;

    /* Array that will hold instances of the Level class representing each of the levels declared in the global LEVELS variable */
    this.levels = [];

    /* When creating an instance of this class I automatically call this two methods defined underneath */
    this.loadLevelsStatus();
    this.loadLevels();
}

/* Then I call the prototype object of the interface to implement its game-loop methods into this class */
PlayingState.prototype = Object.create(myLibrary.IGameLoopObject.prototype);

/* I define a property that allows me to retrieve the current level (accessed using the currentLevelIndex variable's value as the
index of the 'levels' array that contains all the levels of the game) */
Object.defineProperty(PlayingState.prototype, "currentLevel", {
    get: function () {
        return this.levels[this.currentLevelIndex];
    }
});

/* I override the handleInput method inherited from the interface. In the overriden method I tell the script to run the handleInput method
of the currently active level */
PlayingState.prototype.handleInput = function (timeStep) {
    this.currentLevel.handleInput(timeStep);
};

/* I override the update method inherited from the interface. In the overriden method I tell the script to run the update method
of the currently active level */
PlayingState.prototype.update = function (timeStep) {
    this.currentLevel.update(timeStep);

    /* I also switch between game states according to the properties of the currentLevel. So if the property gameOver of the current level 
    returns true, I tell the GameStateManager to switch to the game over state */
    if (this.currentLevel.gameOver)
        myLibrary.GameStateManager.switchTo(ID.game_state_gameover);
    
    /* Also, if the current level is completed I use the GameStateManager to switch to the LevelFinished state */
    else if (this.currentLevel.completed)
        myLibrary.GameStateManager.switchTo(ID.game_state_levelfinished);
};

/* I override the draw method inherited from the interface. In the overriden method I tell the script to run the draw method
of the currently active level */
PlayingState.prototype.draw = function () {
    this.currentLevel.draw();
};

/* I override the reset method inherited from the interface. In the overriden method I tell the script to run the reset method
of the currently active level */
PlayingState.prototype.reset = function () {
    this.currentLevel.reset();
};

/* I define a class-specific method that checks if a given level (passed as the levelIndex parameter) is actually a valid index of the levels
array. If it is, then the method sets the given level as the current level and resets it.  */
PlayingState.prototype.goToLevel = function (levelIndex) {
    if (levelIndex < 0 || levelIndex >= this.levels.length)
        return;
    this.currentLevelIndex = levelIndex;
    this.currentLevel.reset();
};

/* This method checks if the currentLevelIndex variable reaches a value greater than the number of levels stored into the array levels. If 
this happens, the GameStateManager will switch to the level menu screen thanks to its switchTo method. In any other case, the goToLevel method 
will be triggered, turning the next level stored into the array into the currently active level, and setting the 'locked' variable of the level
game world definition to false - the game worlds definitions of each level are stored into the global 'window.LEVELS' array, declared in the 
'../assets/levels/levelsGameWorlds' file. - */
PlayingState.prototype.nextLevel = function () {
    if (this.currentLevelIndex >= window.LEVELS.length - 1)
        myLibrary.GameStateManager.switchTo(ID.game_state_levelselect);
    else {
        this.goToLevel(this.currentLevelIndex + 1);
        window.LEVELS[this.currentLevelIndex].locked = false;
    }
    this.writeLevelsStatus();
};

/* Method responsible for creating the Level class instances from the global LEVELS data */
PlayingState.prototype.loadLevels = function () {
    for (var currLevel = 0; currLevel < window.LEVELS.length; currLevel += 1) {
        this.levels.push(new Level(currLevel));
    }
};

/* Method that makes use of HTML5 web storage. I use the window.localStorage variable to keep the info about the levels and their states
-locked, unlocked, cleared...- To do so, I use the JavaScript Object Notation (JSON) and its stringify method that turns a complex object into
a string - HTML5 web storage only allows to store strings - */
PlayingState.prototype.writeLevelsStatus = function () {

    /* If localStorage is not available in the current browser I do nothing */
    if (!localStorage)
        return;

    /* Otherwise, I create a variable inside the localStorage variable that will hold my LEVELS global object parsing it into a string */
    localStorage.AcornHuntLevels = JSON.stringify(window.LEVELS);
};

/* In the same way I declare a method to read the level info stored into the localStorage variable and I use JSON to parse the string back into 
its original object data type  */
PlayingState.prototype.loadLevelsStatus = function () {

    /* I check that localStorage is available in the browser and that it contains information about my game in it */
    if (localStorage && localStorage.AcornHuntLevels) {
        window.LEVELS = JSON.parse(localStorage.AcornHuntLevels);
    }
};