"use strict";

/* Including the class in the namespace - explained in the comments in the myLibrary/gameobjects files -  */
var myLibrary = (function (myLibrary) {

    /* Constructor of the Keyboard_Singleton class (there is only one single Keyboard object which is instantiated just once as a global variable 
    at the end of this file) and that handles keyboard input from the user
    I declare an array _keyStates whit an initial value of -1, as its value will be updated according to the key-code of the key pressed by
    the user and there is no key with the value -1, so initially no key has been pressed
    I also assign the document key-event handlers to two functions that are described bellow */
    function Keyboard_Singleton() {
        this._keyStates = [];
        for (var i = 0; i < 256; ++i)
            this._keyStates.push(new myLibrary.ButtonState());
        document.onkeydown = handleKeyDown;
        document.onkeyup = handleKeyUp;
    }
    /* Function that stores the value of the keys pressed by the user and stores them into the _keyStates internal array of the 
    Key_Singleton object */
    function handleKeyDown(evt) {
        var code = evt.keyCode;
        if (code < 0 || code > 255)
            return;
        if (!myLibrary.Keyboard._keyStates[code].down)
            myLibrary.Keyboard._keyStates[code].pressed = true;
        myLibrary.Keyboard._keyStates[code].down = true;
    }

    /* Function that is triggered when the user releases a key and reset the value of _keyStates to -1*/
    function handleKeyUp(evt) {
        var code = evt.keyCode;
        if (code < 0 || code > 255)
            return;
        myLibrary.Keyboard._keyStates[code].down = false;
    }

    /* Method that iterates through the array holding all the key codes and setting their pressed state to false */
    Keyboard_Singleton.prototype.reset = function () {
        for (var i = 0; i < 256; ++i)
            this._keyStates[i].pressed = false;
    };

    /* Method that retrieves the keys that are currently pressed */
    Keyboard_Singleton.prototype.pressed = function (key) {
        return this._keyStates[key].pressed;
    };

    /* Method that retrieves the keys that are currently down */
    Keyboard_Singleton.prototype.down = function (key) {
        return this._keyStates[key].down;
    };

    /* As this class is intended to be a singleton class I store a a single instance of it in the namespace variable instead of the class
    definition itself. This provides extra security by encapsulating the class in the namespace. Therefore, the class is no longer accesible
    by any other JavaScript files. It can only be accessed by the this single instance */
    myLibrary.Keyboard = new Keyboard_Singleton();
    return myLibrary;

})(myLibrary || {});
