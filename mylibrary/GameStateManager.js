"use strict";

/* Including the class in the namespace - explained in the comments in the myLibrary/gameobjects files -  */
var myLibrary = (function (myLibrary) {

    /* The class GameStateManager is a singleton class (instantiated only once as a global variable) that manages the different screens
    and states through the game such as title menu, help screen, level screen or even the playing state (all of them different GameObjectList
    instances. The class stores the different game states into an array called gameStates and allows me to call the right state depending
    on the currently active game state
    In the constructor of the class I declare the array that will contain all the gameStates and also a variable that will hold the value 
    of the currently active game state */
    function GameStateManager_Singleton() {
        this._gameStates = [];
        this._currentGameState = null;
    }

    /* Method that adds a game state to the end of the array by passing the gamestate as a parameter. It pushes the game state passed as a
    parameter into the array and makes it the currently active state. Finally I return the index where that game state sits into the array 
    in order to have a simple way to find it. In the AcornHunt.js file I also store this index as an identifier value in the ID variable. */
    GameStateManager_Singleton.prototype.add = function (gamestate) {
        this._gameStates.push(gamestate);
        this._currentGameState = gamestate;
        return this._gameStates.length - 1;
    };

    /* Method that retrieves a game state stored in the gameStates array by passing its id as a parameter (which is the same as
    the index of that state into the array). If the parameter is a number not contained within the array lower and higher indices, 
    the method returns null */
    GameStateManager_Singleton.prototype.get = function (id) {
        if (id < 0 || id >= this._gameStates.length)
            return null;
        else
            return this._gameStates[id];
    };

    /* Method that allows me to change the value of the member variable _currentGameState by passing the id of the desired game state as a 
    parameter and, therefore, switching the currently active game state to the one used as parameter of this method. */
    GameStateManager_Singleton.prototype.switchTo = function (id) {
        if (id < 0 || id >= this._gameStates.length)
            return;
        this._currentGameState = this._gameStates[id];
    };

    /* This method calls the handleInput method of the currently active game state */
    GameStateManager_Singleton.prototype.handleInput = function (timeStep) {
        if (this._currentGameState != null)
            this._currentGameState.handleInput(timeStep);
    };

    /* This method calls the update method of the currently active game state, inherited from GameObjectList */
    GameStateManager_Singleton.prototype.update = function (timeStep) {
        if (this._currentGameState != null)
            this._currentGameState.update(timeStep);
    };

    /* This method calls the draw method of the currently active game state, inherited from GameObjectList */
    GameStateManager_Singleton.prototype.draw = function () {
        if (this._currentGameState != null)
            this._currentGameState.draw();
    };

    /* This method calls the reset method of the currently active game state, inherited from GameObjectList */
    GameStateManager_Singleton.prototype.reset = function () {
        if (this._currentGameState != null)
            this._currentGameState.reset();
    };

    myLibrary.GameStateManager = new GameStateManager_Singleton();
    return myLibrary;

})(myLibrary || {});

