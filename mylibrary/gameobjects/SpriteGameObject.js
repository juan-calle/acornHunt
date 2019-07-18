"use strict";

/* I recreate a namespace that will hold all the generic code that can be reused in future games and I will call this namespace myLibrary. To do
so, I use a design pattern that allows me to define and call a function at the same time. That function expects an object literal as a parameter.
In the function, I create and define the class and its properties/methods, and after that I assign the class to a variable in the myLibrary
variable, which I then return. So the result of the function is stored into myLibrary global variable, which now contains a variable called 
AnimatedGameObject that refers to the class that I am creating here. */
var myLibrary = (function (myLibrary) {

    /* Constructor of the SpriteGameObject class that manages the behaviour of those game objects that are represented by a sprite in the game
    world. It is a child of GameObject class, therefore it inherits its position and velocity properties. In addition I also add properties
    to store the sprite that will be displayed by the instance, its origin, wheter the sprite needs to be mirrored or not and the part of the
    sprite that has to be displayed. In addition to the inherited parameters I also force this class to require a sprite as a parameter */
    function SpriteGameObject(sprite, layer, id) {
        myLibrary.GameObject.call(this, layer, id);
        this.sprite = sprite;
        this.origin = myLibrary.Vector2.zero;
        this.mirror = false;
        this._sheetIndex = 0;
    }

    /* Inheriting the prototype object of the parent GameObject class */
    SpriteGameObject.prototype = Object.create(myLibrary.GameObject.prototype);

    /* Read-only property that returns the size of the sprite */
    Object.defineProperty(SpriteGameObject.prototype, "size",
        {
            get: function () {
                return this.sprite.size;
            },
        });

    /* Read-only property that returns the width of the sprite */
    Object.defineProperty(SpriteGameObject.prototype, "width",
        {
            get: function () {
                return this.sprite.width;
            }
        });

    /* Read-only property that returns the height of the sprite */
    Object.defineProperty(SpriteGameObject.prototype, "height",
        {
            get: function () {
                return this.sprite.height;
            }
        });

    /* Read-only property that returns the width of the sprite */
    Object.defineProperty(SpriteGameObject.prototype, "center",
        {
            get: function () {
                return this.sprite.center;
            }
        });

    /* Property that allows me to retrieve or set the currently displayed part of a spritesheet. */
    Object.defineProperty(SpriteGameObject.prototype, "sheetIndex",
        {
            get: function () {
                return this._sheetIndex;
            },
            set: function (value) {
                if (value >= 0)
                    this._sheetIndex = value % this.sprite.nrSheetElements;
            }
        });

    /* Read-only property that returns the x center point of the screen */
    Object.defineProperty(SpriteGameObject.prototype, "screenCenterX",
        {
            get: function () {
                return (myLibrary.Game.size.x - this.width) / 2 + this.origin.x;
            }
        });

    /* Same as above with the Y axis */
    Object.defineProperty(SpriteGameObject.prototype, "screenCenterY",
        {
            get: function () {
                return (myLibrary.Game.size.y - this.height) / 2 + this.origin.y;
            }
        });

    /* Read-only property that retrieves a Vector witht he position of the center point of the screen */
    Object.defineProperty(SpriteGameObject.prototype, "screenCenter",
        {
            get: function () {
                return myLibrary.Game.size.subtract(this.size).divideBy(2).addTo(this.origin);
            }
        });

    /* Property that returns a new rectangle that corresponds with the sprite's bounding box according to its world position */
    Object.defineProperty(SpriteGameObject.prototype, "boundingBox",
        {
            get: function () {
                var leftTop = this.worldPosition.subtractFrom((this.origin));
                return new myLibrary.Rectangle(leftTop.x, leftTop.y, this.width, this.height);
            }
        });

    /* I override the draw method from the parent class GameObject (which is empty). If the sprite is meant to be visible then I draw it at
    the given position, origin, I display the given part of the sheet and declare whether the sprite should be mirrored or not */
    SpriteGameObject.prototype.draw = function () {
        if (this._visible)
            this.sprite.draw(this.worldPosition, this.origin, this._sheetIndex, this.mirror);
    };

    /* Method that check if sprite object collides with another given object that is passed as a parameter. If the sprite object or the passed
    object are not visible or if there is no intersection between their bounding boxes the result will be false. */
    SpriteGameObject.prototype.collidesWith = function (objectToCheck) {
        if (!this.visible || !objectToCheck.visible || !this.boundingBox.intersects(objectToCheck.boundingBox))
            return false;

        /* If there is intersection between two sprites bounding boxes there is still a chance that the actual pixels of those sprites are not 
        colliding, so I use an efficient per-pixel collision-detection approach in where I analize the rectangle generated by the intersection
        of two bounding boxes and I check if no-transparent pixels of both sprites actually collide.*/

        /* First I generate the overlap rectangle and store it in a variable */
        var overlapRect = this.boundingBox.intersection(objectToCheck.boundingBox);

        /* The overlap rectangle coordinates are expressed in world coordinates because both bounding boxes are expressed in world coordinates
        but I need the local position of the overlap rectangle in the two overlapping sprites. To do so, I subtract the world position of each
        sprite and their origin. */
        var local = overlapRect.position.subtractFrom(this.worldPosition.subtractFrom(this.origin));
        var objLocal = overlapRect.position.subtractFrom(objectToCheck.worldPosition.subtractFrom(objectToCheck.origin));

        /* Using a nested for loop I check the overlap rectangle iterating through all the pixels contained in it. I use the getAlpha method to
        check whether no-transparent pixels are present in the overlap rectangle. If no-transparent pixels from both sprites are present in the 
        overlap rectangle a collision happens. */
        for (var x = 0; x < overlapRect.width; x++)
            for (var y = 0; y < overlapRect.height; y++) {
                if (this.getAlpha(Math.floor(local.x + x), Math.floor(local.y + y)) !== 0
                    && objectToCheck.getAlpha(Math.floor(objLocal.x + x), Math.floor(objLocal.y + y)) !== 0)
                    return true;
            }
        return false;
    };

    /* I add a getAlpha method that calls the getAlpha method from SpriteSheet class */
    SpriteGameObject.prototype.getAlpha = function (x, y) {
        return this.sprite.getAlpha(x, y, this._sheetIndex, this.mirror);
    };

    /* Here I assign the class definition to a variable in the myLibrary namespace and then I return it */
    myLibrary.SpriteGameObject = SpriteGameObject;
    return myLibrary;

/* When using the design pattern for the creation of a namespace, the first time I declare the global variable myLibrary the function will have
to take an empty object literal as a parameter, but afterwards the parameter should be the myLibrary variable itself -in order to fill it with 
all the classes and code belonging to it.- So in the following code I tell the interpreter that if myLibrary is defined I will use it as the 
parameter, otherwise I will pass an empty object literal  */
})(myLibrary || {});   
