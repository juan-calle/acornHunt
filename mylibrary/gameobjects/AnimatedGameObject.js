"use strict";
/* I recreate a namespace that will hold all the generic code that can be reused in future games and I will call this namespace myLibrary. To do
so, I use a design pattern that allows me to define and call a function at the same time. That function expects an object literal as a parameter.
In the function, I create and define the class and its properties/methods, and after that I assign the class to a variable in the myLibrary
variable, which I then return. So the result of the function is stored into myLibrary global variable, which now contains a variable called 
AnimatedGameObject that refers to the class that I am creating here. */
var myLibrary = (function (myLibrary) {

    /* Constructor of the AnimationGameObject class that inherits from SpriteGameObject and makes use of SpriteSheet and Animation classes to generate
    and store animations of a game object. As it inherits from SpriteGameObject I call the parent method but setting the value of the sprite parameter
    to null, otherwise the parent class would try to draw the image stored in its sprite member variable. */
    function AnimatedGameObject(layer, id) {
        myLibrary.SpriteGameObject.call(this, null, layer, id);

        /* I also create a composite object that will hold all the animations */
        this._animations = {};

        /* Declaring a variable that will hold the currently playing animation */
        this._current = null;

        /* Variable containing the amount of time the current frame needs to be shown on screen */
        this._time = 0;
    }

    /* Invoking the parent's prototype object */
    AnimatedGameObject.prototype = Object.create(myLibrary.SpriteGameObject.prototype);


    /* Method that creates a new animation object and stores it in the composite object by the id provided in the constructor parameter */
    AnimatedGameObject.prototype.loadAnimation = function (animname, id, looping, frametime) {
        this._animations[id] = new myLibrary.Animation(animname, looping, frametime);
    };

    /* Method that checks if the animation I want to play is already playing, if it is I do nothing and return from the method */
    AnimatedGameObject.prototype.playAnimation = function (id) {
        if (this._current === this._animations[id])
            return;

        /* If not, I set the sheetIndex and time variables of the parent class to 0 and O also assign the currently active animation
        according to the ID that was passed along as a parameter. Finally I set the sprite member variable to the sprite that should be drawn */
        this._sheetIndex = 0;
        this._time = 0;
        this._current = this._animations[id];
        this.sprite = this._current.sprite;
    };

    /* If the looping atribute is set to false and the animation has reached the last frame  this method will return true. */
    AnimatedGameObject.prototype.animationEnded = function () {
        return !this._current.looping && this.sheetIndex >= this.sprite.nrSheetElements - 1;
    };

    /* In the update method I update the value of the _time member variable according to the time passed since the last game loop iteration
    This way I can update the frame of the sprite sheet that should be drawn */
    AnimatedGameObject.prototype.update = function (timeStep) {
        this._time += timeStep;

        /* Then I use a while loop so whenever the value of _time (= timeStep = 0.01 seconds) is greater than the the time a frame should be shown (frameTime),
        I subtract the frame rate from _time (so the cycle can start again) and I also show the next frame of the spritesheet.  */
        while (this._time > this._current.frameTime) {
            this._time -= this._current.frameTime;
            this._sheetIndex++;

            /* And I also check if the currently shown frame is the last one of the sprite, and the looping value is set to true, 
            the animation will start again from the first frame */
            if (this._sheetIndex > this.sprite.nrSheetElements - 1)
                if (this._current.looping)
                    this._sheetIndex = 0;

                /* Otherwise, I stop the animation on its last frame. */
                else
                    this._sheetIndex = this.sprite.nrSheetElements - 1;
        }
        /* Finally I call the update method of the parent class*/
        myLibrary.SpriteGameObject.prototype.update.call(this, timeStep);
    };

    /* Here I assign the class definition to a variable in the myLibrary namespace and then I return it */
    myLibrary.AnimatedGameObject = AnimatedGameObject;
    return myLibrary;

/* When using the design pattern for the creation of a namespace, the first time I declare the global variable myLibrary the function will have
to take an empty object literal as a parameter, but afterwards the parameter should be the myLibrary variable itself -in order to fill it with 
all the classes and code belonging to it.- So in the following code I tell the interpreter that if myLibrary is defined I will use it as the 
parameter, otherwise I will pass an empty object literal  */
})(myLibrary || {});   
