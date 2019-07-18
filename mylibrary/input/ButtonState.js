"use strict";

/* Including the class in the namespace - explained in the comments in the myLibrary/gameobjects files -  */
var myLibrary = (function (myLibrary) {

	/* Constructor of a ButtonState class that has the functionality of storing the state of a button in order to
	simplify further input-related instructions */
    function ButtonState() {
        this.down = false;
        this.pressed = false;
    }

    myLibrary.ButtonState = ButtonState;
    return myLibrary;

})(myLibrary || {});