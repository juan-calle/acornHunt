"use strict";

/* Constructor of the LevelFinishedState which inherits from GameObjectList and dictates the behaviour to follow once a level has been cleared.
When a level is cleared, I want to show an overly message congratulating the player. The player then can tap or click the overly to go to the
next level or, in case the current level is the last one, to the level selection menu */
function LevelFinishedState() {

    /* Calling the constructor of the parent class */
    myLibrary.GameObjectList.call(this);

    /* Variable holding the current playing game state object */
    this.playingState = myLibrary.GameStateManager.get(ID.game_state_playing);

    /* I create an instance of a sprite game object that will be an overly congratulations message for the player. I give it a position and I
    add it to the GameObjectList */
    this.overlay = new myLibrary.SpriteGameObject(sprites.overlay_welldone, ID.layer_overlays);
    this.overlay.position = this.overlay.screenCenter;
    this.add(this.overlay);
}

/* Invoking the parent's prototype object */
LevelFinishedState.prototype = Object.create(myLibrary.GameObjectList.prototype);

/* I override the parent's handleInput method and depending on the input type (touch or mouse) I check whether the user taps/clicks over 
the overly. If he doesn't, the method won't do anything, but if he does the GameStateManager will be called. I will tell it that it needs
to keep the playing state and, finally, I will call the nextLevel method of the playigState */
LevelFinishedState.prototype.handleInput = function (timeStep) {

    if (myLibrary.Touch.isTouchDevice) {
        if (!myLibrary.Touch.containsTouch(this.overlay.boundingBox))
            return;
    }
    else if (!myLibrary.Mouse.containsMousePress(this.overlay.boundingBox))
        return;

    /* Instructing the manager to keep the playing game state as active */
    myLibrary.GameStateManager.switchTo(ID.game_state_playing);

    /* Calling the method nextLevel of the playing state that will check the number of the current level and if it is not the last one, will 
    redirect to the next level. Otherwise, it will redirect to the level selection game state */
    this.playingState.nextLevel();
};

/* The update method of this class simply calls the update method of the GameStateManager whcih at the same time calls the update method of 
the current game state */
LevelFinishedState.prototype.update = function (timeStep) {
    this.playingState.update(timeStep);
};

/* This draw method works in a similar way as the update method above. It uses the inheritance chain to reach up to the draw method of the 
current game state and, in addition, invokes the draw method of the parent GameObjectList that, at the same time, calls the draw methods of all
its children */
LevelFinishedState.prototype.draw = function () {
    this.playingState.draw();
    myLibrary.GameObjectList.prototype.draw.call(this);
};