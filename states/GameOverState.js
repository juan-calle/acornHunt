"use strict";

/* Class that defines the behaviour of the Game Over game state. This class is a child of GameObjectList and is triggered when the player looses
a level. It works in exactly the same way as the LevelFinishedState, but in this case when the player looses and clicks over the Game Over overly
it will start the same level again */
function GameOverState() {
    myLibrary.GameObjectList.call(this);
    this.playingState = myLibrary.GameStateManager.get(ID.game_state_playing);
    this.overlay = new myLibrary.SpriteGameObject(sprites.overlay_gameover, ID.layer_overlays);
    this.overlay.position = this.overlay.screenCenter;
    this.add(this.overlay);
}
GameOverState.prototype = Object.create(myLibrary.GameObjectList.prototype);

GameOverState.prototype.handleInput = function (timeStep) {
    if (myLibrary.Touch.isTouchDevice) {
        if (!myLibrary.Touch.containsTouch(this.overlay.boundingBox))
            return;
    }
    else if (!myLibrary.Mouse.containsMousePress(this.overlay.boundingBox))
        return;

    /* As I explained in the previous comments, after the player has clicked/tap over the overly, the game state will be reset so the same level
    will be re initialized */
    this.playingState.reset();
    myLibrary.GameStateManager.switchTo(ID.game_state_playing);
};

GameOverState.prototype.update = function (timeStep) {
    this.playingState.update(timeStep);
};

GameOverState.prototype.draw = function () {
    this.playingState.draw();
    myLibrary.GameObjectList.prototype.draw.call(this);
};