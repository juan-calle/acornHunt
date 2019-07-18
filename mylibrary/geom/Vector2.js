"use strict";

/* Including the class in the namespace - explained in the comments in the myLibrary/gameobjects files -  */
var myLibrary = (function (myLibrary) {

    /* I created a new Vector2 class that will simplify the way I handle positions and velocities of game objects.
    Because the JavaScript mathematical and logical operators aren't defined for composite objects, I will add some extra 
    methods to this class to allow more manageability and be able to copy, compare, add, subtract, multiply, divide and normalize vectors

    The constructor of the class checks wheter x or y has values or are otherwise undefined, in which case they will be automatically
    assigned the default value of 0 

    The constructor is expressed in a way equivalent to an if instruction but shorter. It's good to check wheter parameters are defined in a 
    function but otherwise a regular if instruction is preferred because the code can become unreadable.
    The condition is placed before the ? symbol, and after them there are the two options for the values separated by a colon.
    The equivalent if instruction would be:
        function Vector(x,y) {
            if (typeof x === 'undefined')
                this.x = 0;
            else if (typeof y === 'undefined')
                this.y = 0;
            else
                this.x = x;
                this.y = y;
        }*/
    function Vector2(x, y) {
        this.x = typeof x !== 'undefined' ? x : 0;
        this.y = typeof y !== 'undefined' ? y : 0;
    }

    /* This defines a read-only property to allow me to quickly create a new 2d vector */
    Object.defineProperty(Vector2, "zero",
        {
            get: function () {
                return new myLibrary.Vector2();
            }
        });

    /* Read-only property that checks if the maginitude of the vector is equal to 0 */
    Object.defineProperty(Vector2.prototype, "isZero",
        {
            get: function () {
                return this.x === 0 && this.y === 0;
            }
        });

    /* Read-only property that returns the length of a vector using the pythagorean formula, given the origin and end of a vector */
    Object.defineProperty(Vector2.prototype, "length",
        {
            get: function () {
                return Math.sqrt(this.x * this.x + this.y * this.y);
            }
        });

    /* Method that will allow me to add either a vector to an existent vector or just add a number to each of the x & y values of the existent
    vector, it will depend on what value is passed as a parameter into the method. 
    Adding the "return this" line of code allows me to do operator chaining, because the return value will be a 
    vector as well and, therefore, will have its own methods available */    
    Vector2.prototype.addTo = function (v) {
        if (v.constructor == Vector2) {
            this.x += v.x;
            this.y += v.y;
        }
        else if (v.constructor == Number) {
            this.x += v;
            this.y += v;
        }
        return this;
    };

    /* Method that will allow me to add two vectors and return a new vector without changing the values of the pre existent vectors*/
    Vector2.prototype.add = function (v) {
        var result = this.copy();
        return result.addTo(v);
    };

    /* Same follows for subtraction */
    Vector2.prototype.subtractFrom = function (v) {
        if (v.constructor == Vector2) {
            this.x -= v.x;
            this.y -= v.y;
        }
        else if (v.constructor == Number) {
            this.x -= v;
            this.y -= v;
        }
        return this;
    };

    Vector2.prototype.subtract = function (v) {
        var result = this.copy();
        return result.subtractFrom(v);
    };

    /* Division */
    Vector2.prototype.divideBy = function (v) {
        if (v.constructor == Vector2) {
            this.x /= v.x;
            this.y /= v.y;
        }
        else if (v.constructor == Number) {
            this.x /= v;
            this.y /= v;
        }
        return this;
    };

    Vector2.prototype.divide = function (v) {
        var result = this.copy();
        return result.divideBy(v);
    };

    /* Multiplication */
    Vector2.prototype.multiplyWith = function (v) {
        if (v.constructor == Vector2) {
            this.x *= v.x;
            this.y *= v.y;
        }
        else if (v.constructor == Number) {
            this.x *= v;
            this.y *= v;
        }
        return this;
    };

    Vector2.prototype.multiply = function (v) {
        var result = this.copy();
        return result.multiplyWith(v);
    };

    /* Method that will allow me to cast the x and y values of the vector2 into a string */
    Vector2.prototype.toString = function () {
        return "(" + this.x + ", " + this.y + ")";
    };

    /* Method that allows me to normalize vectors (magnitude = 1 or vectors that only represent a direction) */
    Vector2.prototype.normalize = function () {
        var length = this.length;
        if (length === 0)
            return;
        this.divideBy(length);
    };

    /* Method that will allow me to copy vectors, handy if I need to copy positions or velocities from different game objects */
    Vector2.prototype.copy = function () {
        return new myLibrary.Vector2(this.x, this.y);
    };

    Vector2.prototype.equals = function (obj) {
        return this.x === obj.x && this.y === obj.y;
    };
    
    /* Method that will allow me to compare vectors */
    myLibrary.Vector2 = Vector2;
    return myLibrary;

})(myLibrary || {});