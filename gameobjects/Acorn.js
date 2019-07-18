"use strict";

/* Constructor of the Acorn class that manages the behaviour of the acorns placed on the screen and how they interact with other
game objects like the player. The constructor requires a layer and an id and inherits from SpriteGameObject class */
function Acorn(layer, id) {
    myLibrary.SpriteGameObject.call(this, sprites.acorn, layer, id);

    /* I want the acorns to bounce up and down over the platforms to give the game a more visually-appealing outlook. I declare a _bounce
    variable and set its initial value to 0 */
    this._bounce = 0;
}

/* I call the prototype object of the parent class */
Acorn.prototype = Object.create(myLibrary.SpriteGameObject.prototype);

/* And I override the update method of the parent class to give the acorns a bit of life by adding a bouncing effect to them. */
Acorn.prototype.update = function (timeStep) {

	/* In each loop iteration I will update the Y position of an acorn depending on the value that the member variable _bounce will take in each
	game-loop iteration */
    this.position.y -= this._bounce;

    /* To create the bouncing effect I store the toTal elapsed time since the begining of the game. I multiply it by 4 to speed up the movement a bit
    and I add the value of the X coordinate that, after applying the sine function will generate an anti-phase movement from one acorn to the next. */
    var t = myLibrary.Game.totalTime * 4 + this.position.x;

    this._bounce = Math.sin(t)*5;
    this.position.y += this._bounce;
    myLibrary.SpriteGameObject.prototype.update.call(this, timeStep);

    /* Finally, if the player collides with an acorn I play a sound effect and I also set the visibility of the acorn to false */
    var player = this.root.find(ID.player);
    if (this.collidesWith(player)) {
        this.visible = false;
        sounds.acorn_collected.play();
    }
};