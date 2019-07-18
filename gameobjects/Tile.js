"use strict";

/* The tile class is a subclass of the SpriteGameObject class that allows me to break down the distribution of game objects in the game worlds
of each level into small chunks or tiles that are represented by sprites. This makes it easy to separate the game content from the game logic 
and avoiding to have to write a class for each of the levels and the subsequent server overload when loading the game. Taking this approach I 
can store the level information separately from the actual game code in a comprehensive way that could be modify by someone non familiar with 
how my code works. This level information is contained into the level.js file */

/* First I create a global composite varaible containing all the different TyleTypes possible */
var TileType = {
    background: 0,
    normal: 1,
    platform: 2
};

/* In the constructor of the class I require as parameters the sprite that represents the tile I want to place in the game world, the type of
tile, the layer where it should be drawn and its ID. I also declare a member variable called type that stores the type of tile that an instance
of this class will represent */
function Tile(sprite, tileTp, layer, id) {

    /* I declare a member variable 'sprite' which value is obtained from the first parameter passed to the constructor function. I also set a 
    default value for it so, if the sprite parameter is empty, I assign the wall sprite to the 'sprite' member variable. I do this BEFORE calling 
    the constructor of the SpriteGameObject class. */
    sprite = typeof sprite !== 'undefined' ? sprite : sprites.wall;
    myLibrary.SpriteGameObject.call(this, sprite, layer, id);

    this.hot = false;
    this.ice = false;
    this.type = typeof tileTp !== 'undefined' ? tileTp : TileType.background;
}

/* Here I call the prototype object of the SpriteGameObject so the Tile class can inherit all its methods */
Tile.prototype = Object.create(myLibrary.SpriteGameObject.prototype);

/* And to allow me to draw trnsparent tiles, I override the draw method of the SpriteGameObject class. Doing so, I will only draw the sprite
if the tile is not a background tile */
Tile.prototype.draw = function () {
    if (this.type === TileType.background)
        return;
    myLibrary.SpriteGameObject.prototype.draw.call(this);
};
