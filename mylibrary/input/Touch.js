"use strict";

/* Including the class in the namespace - explained in the comments in the myLibrary/gameobjects files -  */
var myLibrary = (function (myLibrary) {

    /* Constructor of the Touch_Singleton class that manages and adds touch input capabilities into my game. In its constructor
    I declare an array _touches that will hold each touch and the information related to them. Another array _touchTaps will store those touches 
    that are touch-taps (the finger wasn't touching the screen in the last game-loop iteration but now it is.) */
    function Touch_Singleton() {
        this._touches = [];
        this._touchTaps = [];

        /* I add event listeners for each of the possible touch-input related events and I attach event handler functions to them -I define
        this functions at the end of this file, after the class definition-.
        Due to terminology differences between browsers I have to add event listeners for different varieties of touchend events */
        document.addEventListener('touchstart', handleTouchStart, false);
        document.addEventListener('touchend', handleTouchEnd, false);
        document.addEventListener('touchcancel', handleTouchEnd, false);
        document.addEventListener('touchleave', handleTouchEnd, false);
        document.body.addEventListener('touchmove', handleTouchMove, false);
    }

    /* Read-only property that returns the number of touches stored into the _Touches array */
    Object.defineProperty(Touch_Singleton.prototype, "nrTouches",
        {
            get: function () {
                return this._touches.length;
            }
        });

    /* Read-only property that returns a boolean that let me know if the user is touching the screen or not according to the 
    length of the _touches array */
    Object.defineProperty(Touch_Singleton.prototype, "isTouching",
        {
            get: function () {
                return this._touches.length !== 0;
            }
        });

    /* Property that returns a boolean telling me if the device the user is playing the game into is a touch device (in which case the property
    will return true). As not all browsers figure out this information in the same way, I decided to encapsulate this in a property so I have
    to face browsers differences in this matter only once. */
    Object.defineProperty(Touch_Singleton.prototype, "isTouchDevice",
        {
            get: function () {
                return ('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0);
            }
        });

    /* Method that takes as a parameter an identifier of a touch-event. Using a for loop I iterate through all the elemnts in the _touches array
    and when the loop finds a touch that matches the passed identifier, it will return the index of that specific touch into the array.
    I do this because it will make my life easier when a touchend event occur, in which case I will have to delete the data of that touch from
    both arrays (_touches & _touchTaps). If the loop cannot find the id passed in the method's parameter, it will return -1 */
    Touch_Singleton.prototype.getTouchIndexFromId = function (id) {
        for (var i = 0, l = this._touches.length; i < l; ++i) {
            if (this._touches[i].identifier === id)
                return i;
        }
        return -1;
    };

    /* Method that resets the boolean values stored into the _touchTaps array and setting them to their native false state */
    Touch_Singleton.prototype.reset = function () {
        for (var i = 0, l = this._touchTaps.length; i < l; ++i)
            this._touchTaps[i] = false;
    };

    /* Method that retrieves the position of a touch given an index number passed as a parameter. */
    Touch_Singleton.prototype.getPosition = function (index) {

        /* I scale the position of the touch in the same way as I did for the mouse: according to the canvas current size and its
        offset and returning a new instance of the Vector2 class that contains the touch x & y coordinates */
        var canvasScale = myLibrary.Canvas2D.scale;
        var canvasOffset = myLibrary.Canvas2D.offset;
        var mx = (this._touches[index].pageX - canvasOffset.x) / canvasScale.x;
        var my = (this._touches[index].pageY - canvasOffset.y) / canvasScale.y;
        return new myLibrary.Vector2(mx, my);
    };

    /* Method that returns the array index of a touch that is contained within a given rectangle. If the touch falls within the rectangle limits,
    the method will return its index in the array. If no touches stored in the array fell within the rectangle boundaries the method returns 0,0 */
    Touch_Singleton.prototype.getIndexInRect = function (rect) {
        for (var i = 0, l = this._touches.length; i < l; ++i) {
            var pos = this.getPosition(i);
            if (rect.contains(pos))
                return i;
        }
        return myLibrary.Vector2.zero;
    };

    /* Method that allows me to find out if there has been a touch in an area of the screen delimited by a rectangle (instance of the rectangle
    class) The method requires as a parameter the rectangle to be checked. Using a for loop I iterate through each touch stored into the
    _touches array and using an if instruction I check whether a certain touch has occured inside the given rectangle, in which case the method
    will return true, otherwise it will return false */
    Touch_Singleton.prototype.containsTouch = function (rect) {
        for (var i = 0, l = this._touches.length; i < l; ++i) {
            if (rect.contains(this.getPosition(i)))
                return true;
        }
        return false;
    };

    /* Method very similar to the one above but in this case I check a rectangle to find out if any touch tap has occured within its boundaries */
    Touch_Singleton.prototype.containsTouchTap = function (rect) {
        for (var i = 0, l = this._touches.length; i < l; ++i) {
            if (rect.contains(this.getPosition(i)) && this._touchTaps[i])
                return true;
        }
        return false;
    };

    /* Function triggered when the user starts touching the screen that stores the the touch event in the _touches array */
    function handleTouchStart(evt) {

        /* With this instruction I make sure the touch is not a default-behaviour touch, like one for scrolling or zooming */
        evt.preventDefault();

        /* Because the user can touch the screen with multiple fingers at the same time, the event has an array of new touches attached to it
        that I can access through the 'changedTouches' variable. I store it into a variable called "newTouches" for simplicity */
        var newTouches = evt.changedTouches;

        /* I use a for loop to store all the touches into the _touches array. Because every touch is also a new press I also add true values to 
        the _touchTaps array */
        for (var i = 0; i < newTouches.length; i++) {
            myLibrary.Touch._touches.push(newTouches[i]);
            myLibrary.Touch._touchTaps.push(true);
        }
    }

    /* Function triggered when an existing touch changes, as a result of the user moving its fingers over the screen (the touch would be the same 
    but the data associated to it wouldn't). In practice this means I have to replace and save the touch in the same index position of the array
    but with its new associated data. I use the optional third parameter of the splice method to fulfill this task */
    function handleTouchMove(evt) {
        evt.preventDefault();
        var newTouches = evt.changedTouches;
        for (var i = 0; i < newTouches.length; i++) {
            var id = myLibrary.Touch.getTouchIndexFromId(newTouches[i].identifier);
            myLibrary.Touch._touches.splice(id, 1, newTouches[i]);
        }
    }

    /* Instruction that is triggered when the user stop touching the screen with any of its fingers. What the instruction does is pretty much
    the same to what the handleTouchStart function does, but on the contrary; it removes touches stored in both arrays (_touches & _touchTaps)
    To remove items of an array I use the splice method which requires an index number. In order to facilitate the task I defined a class method 
    getTouchIndexFromId that now proves to be very handy. */
    function handleTouchEnd(evt) {
        evt.preventDefault();
        var newTouches = evt.changedTouches;
        for (var i = 0; i < newTouches.length; ++i) {
            var id = myLibrary.Touch.getTouchIndexFromId(newTouches[i].identifier);
            myLibrary.Touch._touches.splice(id, 1);
            myLibrary.Touch._touchTaps.splice(id, 1);
        }
    }

    /* As this class is intended to be a singleton class I store a a single instance of it in the namespace variable instead of the class
    definition itself. This provides extra security by encapsulating the class in the namespace. Therefore, the class is no longer accesible
    by any other JavaScript files. It can only be accessed by the this single instance */
    myLibrary.Touch = new Touch_Singleton();
    return myLibrary;

})(myLibrary || {});