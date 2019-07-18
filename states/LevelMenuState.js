"use strict";

/* This class defines the behaviour and game objects present in the level selection screen - or LevelMenuState- accesible after the user has
pressed the play button in the title menu screen. It inherits directly from GameObjectList. In this level menu state I want to show a grid of 
buttons representing all the available levels, each of them with three possible states: locked, unlocked but not solved & unlocked and solved; 
a different sprite will be used to display each of the possibe states of a level button. In the constructor of this class I define the elements 
needed within this state. */
function LevelMenuState(layer) {

    /* First i call the constructor of the GameObjectList class so this state can inherit all its properties from it */
    myLibrary.GameObjectList.call(this, layer);

    /* I declare which sprite will be used for the title screen background, in which layer will be drawn and I add it to the GameObjectList */
    this.background = new myLibrary.SpriteGameObject(sprites.levelselect, ID.layer_background);
    this.add(this.background);

    /* I also add a back button in a given position that will allow me to go back to the title screen, and I add it to the _gameObjects array
    of the GameObjectList class */
    this.back = new myLibrary.Button(sprites.button_back, ID.layer_overlays);
    this.back.position = new myLibrary.Vector2(this.back.screenCenterX, 650);
    this.add(this.back);

    /* I create an array that will hold all the buttons representing the levels in the level menu screen and I populate it using a grid layout.
    I define that I want to have all the level buttons displayed in 4 columns and 3 rows and I assign a level button instance to each of 
    the levels stored in the array. Then I give each button a position in a way that they create a 3x4 grid, and finally I add the button to the 
    array created before and to the _gameObjects array of the GameObjectList class */
    this.levelButtons = [];

    for (var i = 0, j = window.LEVELS.length; i < j; ++i) {
        var row = Math.floor(i / 4);
        var column = i % 4;
        var level = new LevelButton(i, ID.layer_overlays);
        level.position = new myLibrary.Vector2(column * (level.width + 20) + 390, row * (level.height + 20) + 180);
        this.add(level);
        this.levelButtons.push(level);
    }
}

/* I call the prototype object of the GameObjectList class */
LevelMenuState.prototype = Object.create(myLibrary.GameObjectList.prototype);

/* Method that checks whether the user has clicked any of the level buttons contained in the member array. If any has been pressed the method 
returns its array index, otherwise it returns -1 */
LevelMenuState.prototype.getSelectedLevel = function () {
    for (var i = 0, j = this.levelButtons.length; i < j; i++) {
        if (this.levelButtons[i].pressed)
            return this.levelButtons[i].levelIndex;
    }
    return -1;
};

/* With this method I override the one inherited from the GameObjectList. If a user clicks in a level button I make use of the goToLevel method
of the PlayingState class to go to the clicked level and I also update this in the GameStateManager. To finish, I require that when 
the user presses the back button the title screen is shown again  */
LevelMenuState.prototype.handleInput = function (timeStep) {
    myLibrary.GameObjectList.prototype.handleInput.call(this, timeStep);

    var selectedLevel = this.getSelectedLevel();
    if (selectedLevel != -1) {
        var playingState = myLibrary.GameStateManager.get(ID.game_state_playing);
        playingState.goToLevel(selectedLevel);
        myLibrary.GameStateManager.switchTo(ID.game_state_playing);
    }
    else if (this.back.pressed)
        myLibrary.GameStateManager.switchTo(ID.game_state_title);
};