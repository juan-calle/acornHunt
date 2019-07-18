"use strict";

/* Constructor of the LevelButton class that inherits from GameObjectList and its task is to define the behaviour of the buttons representing
each of the levels in the levelMenuState. Each of the buttons will have different states represented by different sprites (locked, unlocked,
solved or unsolved) The constructor tales as parameters the level index the button will refer to, a layer and an id */
function LevelButton(levelIndex, layer, id) {
    myLibrary.GameObjectList.call(this, layer, id);

    this.pressed = false;
    this.levelIndex = levelIndex;

    /* Assigning the sprites a button will acquire when a level is locked, unlocked & solved, and unlock & unsolved */
    this._levelLocked = new myLibrary.SpriteGameObject(sprites.level_locked, ID.layer_overlays_2);
    this._levelSolved = new myLibrary.SpriteGameObject(sprites.level_solved, ID.layer_overlays_1);
    this._levelUnsolved = new myLibrary.SpriteGameObject(sprites.level_unsolved, ID.layer_overlays);

    /* Adding the sprites to the GameObjectList */
    this.add(this._levelLocked);
    this.add(this._levelSolved);
    this.add(this._levelUnsolved);

    /* Here I create a text label that will display the number of the level each button refers to */
    var textLabel = new myLibrary.Label("Arial", "20px", ID.layer_overlays_2);
    textLabel.text = levelIndex + 1;
    textLabel.position = new myLibrary.Vector2(this._levelSolved.width - textLabel.width - 10, 10);
    textLabel.color = myLibrary.Color.white;
    this.add(textLabel);
}

/* I call the prototype object of the parent class */
LevelButton.prototype = Object.create(myLibrary.GameObjectList.prototype);

/* Read-only property that retrieves the width of the button (the width of any of the three sprites used to represent a button in this case I 
use the one representing a locked level) */
Object.defineProperty(LevelButton.prototype, "width",
    {
        get: function () {
            return this._levelLocked.width;
        }
    });

/* Same as above to check the height of a level button */
Object.defineProperty(LevelButton.prototype, "height",
    {
        get: function () {
            return this._levelLocked.height;
        }
    });

/* Handle-input method for the level buttons. Through an if instruction I check if the level represented by a certain button is locked in the 
global LEVELS array. If it is, I block any kind of response to user input in that button. I also check if the device is touch based or not. If
it is a touch device, in orther to set the pressed variable to true the user needs to touch the screen within the boudaries of the bounding box
containing the sprite. In case the device is mouse-input based the user has had to press the left button of the mouse within the bounding box */
LevelButton.prototype.handleInput = function (timeStep) {
    if (window.LEVELS[this.levelIndex].locked)
        return;
    if (myLibrary.Touch.isTouchDevice)
        this.pressed = this.visible && myLibrary.Touch.containsTouch(this._levelLocked.boundingBox);
    else
        this.pressed = this.visible && myLibrary.Mouse.left.pressed &&
            this._levelLocked.boundingBox.contains(myLibrary.Mouse.position);
};

/* Update method of the LevelButtons class in which I call the update method of the parent class that will call this method*/
LevelButton.prototype.update = function (timeStep) {
    myLibrary.GameObjectList.prototype.update.call(this, timeStep);

    /* When the user clicks or taps a level button I check in the global LEVELS array if that level is locked, unlocked and/or solved.
    The visibility of each of the sprites representing the different button states will be set to true only if the statements are true */
    var currLevel = window.LEVELS[this.levelIndex];
    this._levelLocked.visible = currLevel.locked;
    this._levelSolved.visible = currLevel.solved;
    this._levelUnsolved.visible = !currLevel.solved;
};