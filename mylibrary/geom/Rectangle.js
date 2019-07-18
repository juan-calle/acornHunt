"use strict";

/* Including the class in the namespace - explained in the comments of the myLibrary/gameobjects files -  */
var myLibrary = (function (myLibrary) {

    /* Constructor of the rectangle class which is a handy class to manage operations where rectangles are involved, like when creating bounding 
    boxes for sprites and simplify collision detection or simply to find out if the user is clicking or touching a certain area of the screen. 
    An instance of this class would require 4 parameteres (x & y coordinates from where I start drawing the rectangle, the desired width and height. 
    I also give some default values to those parameters not provided by the user */    
    function Rectangle(x, y, w, h) {
        this.x = typeof x !== 'undefined' ? x : 0;
        this.y = typeof y !== 'undefined' ? y : 0;
        this.width = typeof w !== 'undefined' ? w : 1;
        this.height = typeof h !== 'undefined' ? h : 1;
    }

    /* Retrieves the lowest X value of a rectangle */
    Object.defineProperty(Rectangle.prototype, "left",
        {
            get: function () {
                return this.x;
            }
        });

    /* Retrieves the highest X value of a rectangle*/
    Object.defineProperty(Rectangle.prototype, "right",
        {
            get: function () {
                return this.x + this.width;
            }
        });

    /* Retrieves the hihest Y value of a rectangle*/
    Object.defineProperty(Rectangle.prototype, "top",
        {
            get: function () {
                return this.y;
            }
        });

    /* Retrieves the lowest Y value given rectangle*/
    Object.defineProperty(Rectangle.prototype, "bottom",
        {
            get: function () {
                return this.y + this.height;
            }
        });

    /* Retrieves the center of a rectangle */
    Object.defineProperty(Rectangle.prototype, "center",
        {
            get: function () {
                return this.position.addTo(this.size.divideBy(2));
            }
        });

    /* Property to retrieve the position of a rectangle */
    Object.defineProperty(Rectangle.prototype, "position",
        {
            get: function () {
                return new myLibrary.Vector2(this.x, this.y);
            }
        });

    /* Property that retrieves a vector that which is the size of the rectangle*/
    Object.defineProperty(Rectangle.prototype, "size",
        {
            get: function () {
                return new myLibrary.Vector2(this.width, this.height);
            }
        });
    /* Property that checks if an object or event occur within the boundaries of an area delimited by a rectangle*/
    Rectangle.prototype.contains = function (v) {
        v = typeof v !== 'undefined' ? v : new myLibrary.Vector2();
        return (v.x >= this.left && v.x <= this.right &&
            v.y >= this.top && v.y <= this.bottom);
    };

    /* Method that returns true if all the conditions for a collision between two rectangles are met: rectA.left (rectA smallest x value <= rectB.right (rectB greatest x value) */ 
    Rectangle.prototype.intersects = function (rect) {                                              //rectA.right (rectA greatest x value >= rectB.left (rectB smallest x value)    
        return (this.left <= rect.right && this.right >= rect.left &&                               //rectA.top (rectA smallest y value <= rectB.bottom (rectB greatest y value)      
            this.top <= rect.bottom && this.bottom >= rect.top);                                    //rectA.bottom (rectA greatest y value >= rectB.top (rectB smallest y value)        
    };                                                                                                     

    /*  */
    Rectangle.prototype.calculateIntersectionDepth = function (rect) {
        var minDistance = this.size.addTo(rect.size).divideBy(2);
        var distance = this.center.subtractFrom(rect.center);
        var depth = myLibrary.Vector2.zero;
        if (distance.x > 0)
            depth.x = minDistance.x - distance.x;
        else
            depth.x = -minDistance.x - distance.x;
        if (distance.y > 0)
            depth.y = minDistance.y - distance.y;
        else
            depth.y = -minDistance.y - distance.y;
        return depth;
    };

    /* Method that allows me to retrieve a new rectangle that will be the same as the rectangle that is generated when two sprites' bounding boxes overlap. 
    This will allow me to save resources when using pixel-level collision detection, because instead of generating a collision mask for a whole sprite 
    (exponentially increasing the number of computations) I just create it where the two bounding boxes of two sprites collide. With this method
    I return the overlapping rectangle generated in those circumstances */
    Rectangle.prototype.intersection = function (rect) {
        var xmin = Math.max(this.left, rect.left);
        var xmax = Math.min(this.right, rect.right);
        var ymin = Math.max(this.top, rect.top);
        var ymax = Math.min(this.bottom, rect.bottom);
        return new myLibrary.Rectangle(xmin, ymin, xmax - xmin, ymax - ymin);
    };

    /* Method to draw a rectangle starting to draw at the point x,y as the top left corner of it and with a width and height defined in the second
    set of parameters */
    Rectangle.prototype.draw = function () {
    myLibrary.Canvas2D.drawRectangle(this.x, this.y, this.width, this.height);
    };

    myLibrary.Rectangle = Rectangle;
    return myLibrary;

})(myLibrary || {});