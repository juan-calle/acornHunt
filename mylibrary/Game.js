"use strict";

/* Including the class in the namespace - explained in the comments in the myLibrary/gameobjects files -  */
var myLibrary = (function (myLibrary) {

    /* Global variable that manages the animation method used to display the game depending on the browser's capabilitites*/
    var requestAnimationFrame = (function () {
        return  window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();
    
    /* Constructor of the Game_Singleton class (there is only one single Game object which is instantiated just once as a global variable 
    at the end of this file). This class manages the initialization of the game, the main-loop, the way assets are loaded */
    function Game_Singleton() {
        this._totalTime = 0;
        this._size = null;
        /* Variable that works hand in hand with the loadSprite method. It increases its value depending on how many sprites are loading */
        this._spritesStillLoading = 0;
        this._totalSprites = 0;
    }

    /* Read-only roperty that access the member variable _totalTime. It retrieves the total time passed since the beginning of the game */
    Object.defineProperty(Game_Singleton.prototype, "totalTime",
        {
            get: function () {
                return this._totalTime;
            }
        });

    /* Read-only roperty of the internal member variable _size. The property retrieves the native size of the game */
    Object.defineProperty(Game_Singleton.prototype, "size",
        {
            get: function () {
                return this._size;
            }
        });

    Object.defineProperty(Game_Singleton.prototype, "screenRect",
        {
            get: function () {
                return new myLibrary.Rectangle(0, 0, this._size.x, this._size.y);
            }
        });

    /* Method that takes as parameters the HTML values for the div containing the canvas, the canvas name, width and height. It stores the native
    size of the canvas into the size variable declared in the constructor, performs the initialization of the Canvas, and triggers some useful methods
    defined below */
    Game_Singleton.prototype.start = function (divName, canvasName, x, y) {
        this._size = new myLibrary.Vector2(x, y);

        myLibrary.Canvas2D.initialize(divName, canvasName);
        this.loadAssets();
        this.assetLoadingLoop();
    };

    /* Method declared here but called from the Painter.js file through the instance of this class */
    Game_Singleton.prototype.initialize = function () {
    };

    /* Method declared here but called from the Painter.js file through the instance of this class */
    Game_Singleton.prototype.loadAssets = function () {
    };

    /* This method triggers a loop that will repeat itself if there are assets still loasding (or the value of the internal variable 
    _spritesStillLoading is greater thatn 0)*/
    Game_Singleton.prototype.assetLoadingLoop = function () {
        myLibrary.Canvas2D.clear();
        myLibrary.Canvas2D.drawText(Math.round((myLibrary.Game._totalSprites - myLibrary.Game._spritesStillLoading) /
            myLibrary.Game._totalSprites * 100) + "%");

        if (myLibrary.Game._spritesStillLoading > 0)
            requestAnimationFrame(myLibrary.Game.assetLoadingLoop);
        else {
            myLibrary.Game.initialize();
            requestAnimationFrame(myLibrary.Game.mainLoop);
        }
    };

    /* Method that triggers the Game mainLoop and sets the value of frameRate variable used to update all the game objects. */
    Game_Singleton.prototype.mainLoop = function () {
        
        /* Basically what the frameRate variable does is marking the time passed since the last iteration of the game loop, as I am working in a 
        60fps environment, this value will be a constant with the value 1/60. in _totalTime I store the whole ammount of time since the game-loop
        ran for the first time */
        var timeStep = 1 / 60;
        myLibrary.Game._totalTime += timeStep;

        myLibrary.GameStateManager.handleInput(timeStep);
        myLibrary.GameStateManager.update(timeStep);
        myLibrary.Canvas2D.clear();
        myLibrary.GameStateManager.draw();

        myLibrary.Keyboard.reset();
        myLibrary.Mouse.reset();
        myLibrary.Touch.reset();

        requestAnimationFrame(myLibrary.Game.mainLoop);
    };
    /* Intantiation of the Game_Singleton class through a global variable called Game */
    myLibrary.Game = new Game_Singleton();
    return myLibrary;

}(myLibrary || {}));
