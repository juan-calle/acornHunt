"use strict";

/* Including the class in the namespace - explained in the comments in the myLibrary/gameobjects files -  */
var myLibrary = (function (myLibrary) {
    
    /* Constructor of the Mouse_Singleton class (there is only one single Mouse object which is instantiated just once as a global variable at 
    the end of this file) and that handles mouse input from the user
    I declare a variable position that will hold the position of the mouse and will be initially a vector of value {x : 0, y: 0}
    I also declare three variables that create instances of the ButtonState class for each of the mouse buttons and assign the document mouse-event 
    handlers to three functions that are described bellow */
    function Mouse_Singleton() {
        this._position = myLibrary.Vector2.zero;
        this._left = new myLibrary.ButtonState();
        this._middle = new myLibrary.ButtonState();
        this._right = new myLibrary.ButtonState();
        document.onmousemove = handleMouseMove;
        document.onmousedown = handleMouseDown;
        document.onmouseup = handleMouseUp;
    }   

    /* Function triggered everytime the user moves the mouse. It scales the position of the mouse according to the canvas current size and its
    offset and it stores the new value into the _position variable of the class*/
    function handleMouseMove(evt) {
        var canvasScale = myLibrary.Canvas2D.scale;
        var canvasOffset = myLibrary.Canvas2D.offset;
        var mx = (evt.pageX - canvasOffset.x) / canvasScale.x;
        var my = (evt.pageY - canvasOffset.y) / canvasScale.y;
        myLibrary.Mouse._position = new myLibrary.Vector2(mx, my);
    }

    /* Function triggered when the user presses a mouse button. It takes into account the scaling of the mouse position by calling the 
    handleMouseMove function first.*/
    function handleMouseDown(evt) {
        handleMouseMove(evt);

        /* Then I check wheter the buttons are pressed or not. The buttons will be pressed only if they are currently down when they weren't in the
        previous game-loop iteration */
        if (evt.which === 1) {
            if (!myLibrary.Mouse._left.down)
                myLibrary.Mouse._left.pressed = true;
            myLibrary.Mouse._left.down = true;
        } else if (evt.which === 2) {
            if (!myLibrary.Mouse._middle.down)
                myLibrary.Mouse._middle.pressed = true;
            myLibrary.Mouse._middle.down = true;
        } else if (evt.which === 3) {
            if (!myLibrary.Mouse._right.down)
                myLibrary.Mouse._right.pressed = true;
            myLibrary.Mouse._right.down = true;
        }
    }

    /* Function triggered when the user releases a mouse button. It takes into account the scaling of the mouse position by calling the 
    handleMouseMove function first.*/
    function handleMouseUp(evt) {
        handleMouseMove(evt);

        if (evt.which === 1)
            myLibrary.Mouse._left.down = false;
        else if (evt.which === 2)
            myLibrary.Mouse._middle.down = false;
        else if (evt.which === 3)
            myLibrary.Mouse._right.down = false;
    }

    /* Set of getters to access the value of the different Button States */
    Object.defineProperty(Mouse_Singleton.prototype, "left",
        {
            get: function () {
                return this._left;
            }
        });

    Object.defineProperty(Mouse_Singleton.prototype, "middle",
        {
            get: function () {
                return this._middle;
            }
        });

    Object.defineProperty(Mouse_Singleton.prototype, "right",
        {
            get: function () {
                return this._right;
            }
        });

    Object.defineProperty(Mouse_Singleton.prototype, "position",
        {
            get: function () {
                return this._position;
            }
        });
    
    /* Method that reset the state of the mouse key pressed by resetting the value of the pressed variable of ButtonState to false again. This way
    I make sure that after each game-loop iteration a mouse key press is handled only once */
    Mouse_Singleton.prototype.reset = function () {
        this._left.pressed = false;
        this._middle.pressed = false;
        this._right.pressed = false;
    };

    /* Method that takes a rectangle as a parameter and returns the position of a mouse down and whether that position is within the boundaries
    of the rectangle passed as a paramater of the method */
    Mouse_Singleton.prototype.containsMouseDown = function (rect) {
        return this._left.down && rect.contains(this._position);
    };

    /* Same as above but with a mouse press */
    Mouse_Singleton.prototype.containsMousePress = function (rect) {
        return this._left.pressed && rect.contains(this._position);
    };

    /* As this class is intended to be a singleton class I store a a single instance of it in the namespace variable instead of the class
    definition itself. This provides extra security by encapsulating the class in the namespace. Therefore, the class is no longer accesible
    by any other JavaScript files. It can only be accessed by the this single instance */
    myLibrary.Mouse = new Mouse_Singleton();
    return myLibrary;

})(myLibrary || {});
