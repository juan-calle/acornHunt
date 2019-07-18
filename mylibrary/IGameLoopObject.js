"use strict";

/* Including the class in the namespace - explained in the comments in the myLibrary/gameobjects files -  */
var myLibrary = (function (myLibrary) {

    /* This class acts as an interface whose function is to define the methods that any objects that make use of the game-loop should have. 
    The methods' bodies will be defined in each of the subclasses of this interface, this class is just a guideline of the methods that must be 
    available in all the classes/objects that have game-loop methods.*/
    function IGameLoopObject() {
    }

    IGameLoopObject.prototype.initialize = function () {
    };

    IGameLoopObject.prototype.handleInput = function (timeStep) {
    };

    IGameLoopObject.prototype.update = function (timeStep) {
    };

    IGameLoopObject.prototype.draw = function () {
    };

    IGameLoopObject.prototype.reset = function () {
    };

    myLibrary.IGameLoopObject = IGameLoopObject;
    return myLibrary;

})(myLibrary || {});