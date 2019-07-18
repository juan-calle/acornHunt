"use strict";

/* I recreate a namespace that will hold all the generic code that can be reused in future games and I will call this namespace myLibrary. To do
so, I use a design pattern that allows me to define and call a function at the same time. That function expects an object literal as a parameter.
In the function, I create and define the class and its properties/methods, and after that I assign the class to a variable in the myLibrary
variable, which I then return. So the result of the function is stored into myLibrary global variable, which now contains a variable called 
AnimatedGameObject that refers to the class that I am creating here. */
var myLibrary = (function (myLibrary) {

    /* Constructor of the GameObjectGrid subclass of GameObjectList that serves to represent a grid of game objects. Unlike GameObjectList class, which
    doesn't take into account the position of the objects it holds, what the GameObjectGrid class does is to relate all its child game objects to a grid, 
    providing them with an anchor position that is different to their global position. As a subclass of GameObjectList, this class requires a layer value
    as a parameter, but also values that define the number of columns and rows the grid should have.
    After invoking the parent's constructor I set 4 member variables (2 to calculate the size of a cell in the grid, the number of rows and the number of
    columns */
    function GameObjectGrid(rows, columns, layer, id) {
        myLibrary.GameObjectList.call(this, layer, id);

        this.cellWidth = 0;
        this.cellHeight = 0;
        this._rows = rows;
        this._columns = columns;
        //console.log("Rows: " + (this._rows) + ", Columns: " + (this._columns));
    }

    /* Here I create a copy of the prototype object of GameObjectList and I store it into the grid's class prototype */
    GameObjectGrid.prototype = Object.create(myLibrary.GameObjectList.prototype);

    /* Property that returns the number of rows of the grid */
    Object.defineProperty(GameObjectGrid.prototype, "rows", {
        get: function () {
            return this._rows;
        }
    });

    /* Property that returns the number of columns of the grid */
    Object.defineProperty(GameObjectGrid.prototype, "columns", {
        get: function () {
            return this._columns;
        }
    });

    /* Here I override the parent's add method because I no longer need to sort the elements of an array according to their layer order. Here, what I need to
    do is to place each of the elements contained in the array in a different cell of the grid. To do so, I calculate the row and column indices from the 
    target location in the array, I push the game object into the array and I also tell it that from now on it belongs to the GameObjectcGrid class. Finally,
    I give it a position. */
    GameObjectGrid.prototype.add = function (gameobject) {
        var row = Math.floor(this._gameObjects.length / this._columns);
        var col = this._gameObjects.length % this._columns;
        this._gameObjects.push(gameobject);
        gameobject.parent = this;
        gameobject.position = new myLibrary.Vector2(col * this.cellWidth, row * this.cellHeight);
    };

    /* Method that allows me to place a game object into a specific position in the grid */
    GameObjectGrid.prototype.addAt = function (gameobject, col, row) {
        this._gameObjects[row * this._columns + col] = gameobject;
        gameobject.parent = this;
        gameobject.position = new myLibrary.Vector2(col * this.cellWidth, row * this.cellHeight);
        //console.log("Rows: " + (row+1) + ", Columns: " + (col+1));
    };

    /* Method that returns the array index of an object in the grid given its position in the grid */
    GameObjectGrid.prototype.at = function (col, row) {
        var index = row * this._columns + col;
        if (index < 0 || index >= this._gameObjects.length)
            return null;
        else
            return this._gameObjects[index];
    };

    /* Method that retrieves the anchor position of an object placed in the grid taking as a parameter the object itself. The loop will look for that
    object in the array and when it finds it it calculates the index of the row where it's placed by dividing the index of the object in the 
    array by the total number of columns and rounding it to the closest smaller integer. The column index is calculated using a modulus division 
    (In a 10 rows x 5 columns grid, with a cell size of 50x50 let's imagine the object is placed at the index 12 of the array. Then the row index 
    would be: Math.floor(12/5) which is 2. The would be 12-{(12/5)*5} which is 2. Therefore, the index 12 corresponds to the position (2,2) of the 
    grid. The anchor point would then be ((2x50),(2x50) ---> (100,100) which matches with the top left corner of the cell) */
    GameObjectGrid.prototype.getAnchorPosition = function (gameobject) {
        var l = this._gameObjects.length;
        for (var i = 0; i < l; ++i)
            if (this._gameObjects[i] == gameobject) {
                var row = Math.floor(i / this.columns);
                var col = i % this.columns;
                return new myLibrary.Vector2(col * this.cellWidth, row * this.cellHeight);
            }
        return myLibrary.Vector2.zero;
    };

    /* Here I assign the class definition to a variable in the myLibrary namespace and then I return it */
    myLibrary.GameObjectGrid = GameObjectGrid;
    return myLibrary;

/* When using the design pattern for the creation of a namespace, the first time I declare the global variable myLibrary the function will have
to take an empty object literal as a parameter, but afterwards the parameter should be the myLibrary variable itself -in order to fill it with 
all the classes and code belonging to it.- So in the following code I tell the interpreter that if myLibrary is defined I will use it as the 
parameter, otherwise I will pass an empty object literal  */
})(myLibrary || {});
