"use strict";

/* I recreate a namespace that will hold all the generic code that can be reused in future games and I will call this namespace myLibrary. To do
so, I use a design pattern that allows me to define and call a function at the same time. That function expects an object literal as a parameter.
In the function, I create and define the class and its properties/methods, and after that I assign the class to a variable in the myLibrary
variable, which I then return. So the result of the function is stored into myLibrary global variable, which now contains a variable called 
AnimatedGameObject that refers to the class that I am creating here. */
var myLibrary = (function (myLibrary) {

    /* This is de constructor of the class GameObject which inherits from IGameLoopObject class. It takes as parameters the layer where the object 
    sits and an id that facilitates communication between objects that interact with each other. In the constructor I first set a default value for 
    the layer parameter, if it is not provided it will be 0. Then I declare a variable that holds the parent class of the instance, in this case 
    is null. Position, velocity and visibility are also declared */
    function GameObject(layer, id) {
        myLibrary.IGameLoopObject.call(this);

        /* Providing default values for layer and id */
        this.layer = typeof layer !== 'undefined' ? layer : 0;
        this.id = typeof id !== 'undefined' ? id : 0;

        this.parent = null;
        this.position = myLibrary.Vector2.zero;
        this.velocity = myLibrary.Vector2.zero;
        this._visible = true;
    }

    /* Here I call the prototype object of the IGameLoopObject */
    GameObject.prototype = Object.create(myLibrary.IGameLoopObject.prototype);

    /* Property that checks if the object has a parent; if not (meaning the object belongs to the parent class) it returns the value of the 
    visibility internal variable. Otherwise, it checks the visibility of the object AND its parent. 
    In the same way I declare a setter to allow me to manipulate the visibility value */
    Object.defineProperty(GameObject.prototype, "visible",
        {
            get: function () {
                if (this.parent === null)
                    return this._visible;
                else
                    return this._visible && this.parent.visible;
            },

            set: function (bool) {
                this._visible = bool;
            }
        });

    /* Read-only property that retrieves all the possible parents and grand parents of an object until it reaches the root */
    Object.defineProperty(GameObject.prototype, "root",
        {
            get: function () {
                if (this.parent === null)
                    return this;
                else
                    return this.parent.root;
            }
        });

    /* Property that returns a copy of the global position of an object by adding its local position to the position of its parent until it 
    reaches the root */
    Object.defineProperty(GameObject.prototype, "worldPosition",
        {
            get: function () {
                if (this.parent !== null)
                    return this.parent.worldPosition.addTo(this.position);
                else
                    return this.position.copy();
            }
        });

    /* Method that resets the visibility of the game object bringing it back to its default true value */
    GameObject.prototype.reset = function () {
        this._visible = true;
    };

    /* Update method of the class that updates the current position of the game object by using the variable timeStep as a parameter. It 
    basically calculates the new position of a game object based on its velocity, the time passed since tha last call of the game-loop and its 
    current position. It multiplies the velocity with the timeStep and adds the result to the position of the object  */
    GameObject.prototype.update = function (timeStep) {
        this.position.addTo(this.velocity.multiply(timeStep));
    };

    /* Here I assign the class definition to a variable in the myLibrary namespace and then I return it */
    myLibrary.GameObject = GameObject;
    return myLibrary;

    /* When using the design pattern for the creation of a namespace, the first time I declare the global variable myLibrary the function will have
    to take an empty object literal as a parameter, but afterwards the parameter should be the myLibrary variable itself -in order to fill it with 
    all the classes and code belonging to it.- So in the following code I tell the interpreter that if myLibrary is defined I will use it as the 
    parameter, otherwise I will pass an empty object literal  */
})(myLibrary || {});