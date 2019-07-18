"use strict";

/* Including the class in the namespace - explained in the comments in the myLibrary/gameobjects files -  */
var myLibrary = (function (myLibrary) {

    /* Class Button that inherits from SpriteGameObject class. It adds a simple feature that checks if the player has pressed a button. 
    It takes the sprite of the button, the layer to be drawn and its id as parameters. It calls the parent constructor and sets two 
    possible values for the button: pressed or down, very similar to what I did to manage mouse input or in the ButtonState class */
    function Button(sprite, layer, id) {
        myLibrary.SpriteGameObject.call(this, sprite, layer, id);
        this.pressed = false;
        this.down = false;
    }
    
    /* Invoking the prototype of SpriteGameObject */
    Button.prototype = Object.create(myLibrary.SpriteGameObject.prototype);

    /* Defining a method that handles the received input depending on whether it was a mouse or touch event */
    Button.prototype.handleInput = function (timeStep) {
        var boundingBox = this.boundingBox;
        this.pressed = this.visible && (myLibrary.Touch.containsTouchTap(boundingBox) ||
            myLibrary.Mouse.containsMousePress(boundingBox));
        this.down = this.visible && (myLibrary.Touch.containsTouch(boundingBox) ||
            myLibrary.Mouse.containsMouseDown(boundingBox));
    };

    myLibrary.Button = Button;
    return myLibrary;

})(myLibrary || {});   
