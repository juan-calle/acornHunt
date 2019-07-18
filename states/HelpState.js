"use strict";

/* This class defines the behaviour and game objects present in the HelpState screen accesible from the title menu screen. It inherits directly from 
GameObjectList. In this HelpState I want to show basic information related on how to play the game. In its constructor I first call the parent's
constructor and I define the elements that need to be present in the screen. */
function HelpState(layer) {
    myLibrary.GameObjectList.call(this, layer);

    /* The background */
    this.background = new myLibrary.SpriteGameObject(sprites.background_help, ID.layer_background);
    this.add(this.background);

    /* The back button */
    this.backButton = new myLibrary.Button(sprites.button_back, ID.layer_overlays);
    this.backButton.position = new myLibrary.Vector2(1160, 700);
    this.add(this.backButton);
}

/* Inheriting the parent's prototype object */
HelpState.prototype = Object.create(myLibrary.GameObjectList.prototype);

/* Overriding the parent's handle input method so when the user presses the back button he will be redirected to the TitleMenu State */
HelpState.prototype.handleInput = function (timeStep) {
    myLibrary.GameObjectList.prototype.handleInput.call(this, timeStep);
    if (this.backButton.pressed)
        myLibrary.GameStateManager.switchTo(ID.game_state_title);
};