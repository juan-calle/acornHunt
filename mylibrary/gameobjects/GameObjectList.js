"use strict";

/* I recreate a namespace that will hold all the generic code that can be reused in future games and I will call this namespace myLibrary. To do
so, I use a design pattern that allows me to define and call a function at the same time. That function expects an object literal as a parameter.
In the function, I create and define the class and its properties/methods, and after that I assign the class to a variable in the myLibrary
variable, which I then return. So the result of the function is stored into myLibrary global variable, which now contains a variable called 
AnimatedGameObject that refers to the class that I am creating here. */
var myLibrary = (function (myLibrary) {

    /* This is the constructor of the GameObjectList, a subclass of GameObject that will hold in an array a series of other game objects and will manage their
    behaviour. It doesn't define any behaviour for objects instantiated from this class. It's like a container for other game objects and its methods will
    trigger behaviours in all the game objects it contains.
    I begin by calling the constructor of the parent class to inherit its member variables and I also declare an empty internal array that will hold all the
    objects belonging to this list of objects */
    function GameObjectList(layer, id) {
        myLibrary.GameObject.call(this, layer, id);

        this._gameObjects = [];
    }

    /* I create a copy of the prototype object of the base class and I store that copy into the prototype object of GameObjectList. This way, 
    GameObjectList has now access to all the methods defined in the base class */
    GameObjectList.prototype = Object.create(myLibrary.GameObject.prototype);

    /* Property that retrieves the lenght of the array of game Objects */
    Object.defineProperty(GameObjectList.prototype, "length", {
        get: function () {
            return this._gameObjects.length;
        }
    });

    /* Method that pushes an object into the array _gameObjects. It takes as a parameter the object to be pushed. It also modifies the hierarchy 
    of the object by transforming it into a child of the list and it also sorts the objects in order of how they should be drawn (according to 
    the layer value). The sorting could be also done in the draw method but it would be terribly inefficient because the draw method is called 
    60 times per second and it could be problematic in arrays with many objects. In order to sort he array propperly I use the sort function with 
    another sorting function as a parameter. What I do here is that I subtract the layer value of an object B to the layer value of an object A. 
    If the result is positive it means that object A has a higher value in its layer variable and therefore should be placed after object B in 
    the array, otherwise at the time of drawing, object A could interfear with the visibility of object B. The function then returns the value of 
    the subtraction and the sort() functions does the rest of the work. */
    GameObjectList.prototype.add = function (gameobject) {
        this._gameObjects.push(gameobject);
        gameobject.parent = this;
        this._gameObjects.sort(function (a, b) {
            return a.layer - b.layer;
        });
    };

    /* Method that removes an object from the list by passing the name of the object as a parameter. The method will iterate through all the elements stored
    into the array. If the item on focus is not the object provided in the parameter the loop continues iterating, otherwise it splices the array at position
    i (will match with the index of the object passed in the parameter) and will remove just that only item. Finally, as the removed object is not part of
    the gameObjectList class anymore, its parent property is set to null */
    GameObjectList.prototype.remove = function (gameobject) {
        for (var i = 0, l = this._gameObjects.length; i < l; ++i) {
            if (gameobject !== this._gameObjects[i])
                continue;
            this._gameObjects.splice(i, 1);
            gameobject.parent = null;
            return;
        }
    };

    /* Method that will return the object held in the array with the index provided in its parameter */
    GameObjectList.prototype.at = function (index) {
        if (index < 0 || index >= this._gameObjects.length)
            return null;
        return this._gameObjects[index];
    };

    /* Method that clear the relationships and hierarchy */
    GameObjectList.prototype.clear = function () {
        for (var i = 0, l = this._gameObjects.length; i < l; ++i)
            this._gameObjects[i].parent = null;
        this._gameObjects = [];
    };

    /* Method that allows me to find objects using their identifiers. Using a loop, the find method will iterate through all the 
    children of the gameObjectList to check which one matches the requested identifier */
    GameObjectList.prototype.find = function (id) {
        for (var i = 0, l = this._gameObjects.length; i < l; ++i) {
            if (this._gameObjects[i].id === id)
                return this._gameObjects[i];

            /* It can also occur that the object I'm looking for is within another GameObjectList object inside this GameObjectList. 
            In that case I wouldn't be able to find it because the previous instruction only searches within the list items directly 
            represented by the current object (this). I can solve this using recursion and something called depth first search, where 
            I check if any of the items in the GameObjectList is of type GameObjectList, in that case I can access it and try to find 
            what I'm looking for in there. */            
            if (this._gameObjects[i] instanceof myLibrary.GameObjectList) {
                var obj = this._gameObjects[i].find(id);
                if (obj !== null)
                    return obj;
            }
        }
        return null;
    };

    /* Method of the Object list that simply calls the handleInput methods of all the individual objects that belong to this list */
    GameObjectList.prototype.handleInput = function (timeStep) {
        for (var i = this._gameObjects.length - 1; i >= 0; --i)
            this._gameObjects[i].handleInput(timeStep);
    };

    /* The update method of the Object list simply calls the update methods of all the individual objects that belong to it */
    GameObjectList.prototype.update = function (timeStep) {
        for (var i = 0, l = this._gameObjects.length; i < l; ++i)
            this._gameObjects[i].update(timeStep);
    };

    /* The draw method of the Object list simply calls the draw methods of all the individual objects that belong to the list, only 
    if they are visible */    
    GameObjectList.prototype.draw = function () {
        for (var i = 0, l = this._gameObjects.length; i < l; ++i)
            if (this._gameObjects[i].visible)
                this._gameObjects[i].draw();
    };
    
    /* Method that iterates through the array of objects and set the visibility of all of them to true */
    GameObjectList.prototype.reset = function () {
        for (var i = 0, l = this._gameObjects.length; i < l; ++i)
            this._gameObjects[i].reset();
    };

    /* Here I assign the class definition to a variable in the myLibrary namespace and then I return it */
    myLibrary.GameObjectList = GameObjectList;
    return myLibrary;

/* When using the design pattern for the creation of a namespace, the first time I declare the global variable myLibrary the function will have
to take an empty object literal as a parameter, but afterwards the parameter should be the myLibrary variable itself -in order to fill it with 
all the classes and code belonging to it.- So in the following code I tell the interpreter that if myLibrary is defined I will use it as the 
parameter, otherwise I will pass an empty object literal  */
})(myLibrary || {});
