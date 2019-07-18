"use strict";

/* Constructor of the TileField class that inherits from the GameObjectGrid class and whose functionality is to define a field where the player 
will be locked. I want the player not to be able to leave the screen to the right or left. This class will have just a method called getFileType that 
was not implemented into GameObjectGrid because this behaviour is specific of this particular game, so I decided to separate it from a more generic class
like GameObjectGrid */
function TileField(rows, columns, layer, id) {
    myLibrary.GameObjectGrid.call(this, rows, columns, layer, id);
}

TileField.prototype = Object.create(myLibrary.GameObjectGrid.prototype);

/* This method returns the type of tile given its x and y position on the grid */
TileField.prototype.getTileType = function (x, y) {
    if (x < 0 || x >= this.columns)
        return TileType.normal;
    if (y < 0 || y >= this.rows)
        return TileType.background;
    return this.at(x, y).type;
};