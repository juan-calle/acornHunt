"use strict";

/* Class that defines the elements present in the title screen. Because this state contains a couple of game objects, I make it inherit from 
the GameObjectList class. In its constructor I add the game objects needed for this state*/
function TitleMenuState(layer) {
    myLibrary.GameObjectList.call(this, layer);

    /* I declare which sprite will be used for the title screen background, in which layer will be drawn and I add it to the GameObjectList */
    this.titleScreenBg = new myLibrary.SpriteGameObject(sprites.background_title, ID.layer_background);
    this.add(this.titleScreenBg);

    /* I also add a play button */
    this.playButton = new myLibrary.Button(sprites.button_play, ID.layer_overlays);
    this.playButton.position = new myLibrary.Vector2(this.playButton.screenCenterX, 600);
    this.add(this.playButton);

    /* And a help button */
    this.helpButton = new myLibrary.Button(sprites.button_help, ID.layer_overlays);
    this.helpButton.position = new myLibrary.Vector2(this.helpButton.screenCenterX, 700);
    this.add(this.helpButton);
}

/* Here I call the prototype object of the GameObjectList class to allow this game-state class to inherit all its methods */
TitleMenuState.prototype = Object.create(myLibrary.GameObjectList.prototype);

/* But here I override the handleInput method of the GameObjectList class by giving it specific instructions to handle the input required to
make the buttons usable - in the GameObjectList class this method just calls the individual handleInput methods of all the objects contained
in the list, so if I don't give any instructions here nothing will happen when the user clicks over the buttons- */
TitleMenuState.prototype.handleInput = function (timeStep) {

    /* I call the handleInput method of the GameObjectList class */
    myLibrary.GameObjectList.prototype.handleInput.call(this, timeStep);

    /* And here I use the member variables of the Button class (pressed & down) to check if the user has clicked either over the play or help
    buttons. If the user has clicked over any of them, then I call the GameStateManager class that thanks to its switchTo method will change
    the currenttly active TitleMenuState to either the LevelMenuState or the HelpState */
    if (this.playButton.pressed)
        myLibrary.GameStateManager.switchTo(ID.game_state_levelselect);
    else if (this.helpButton.pressed)
        myLibrary.GameStateManager.switchTo(ID.game_state_help);
};