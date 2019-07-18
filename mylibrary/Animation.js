"use strict";

/* Including the class in the namespace - explained in the comments in the myLibrary/gameobjects files -  */
var myLibrary = (function (myLibrary) {

	/* Constructor of the animation class that I will use in conjunction with instances of the SpriteSheet class in a new AnimatedGameObject class 
	In order to generate an animation I not only need the sprite sheet, but also information on how long I want each frame to be displayed or if I want 
	the animation to loop */
    function Animation(sprite, looping, frameTime) {
        this.sprite = sprite;
        this.frameTime = typeof frameTime != 'undefined' ? frameTime : 0.1;
        this.looping = looping;
    }

    myLibrary.Animation = Animation;
    return myLibrary;

})(myLibrary || {});   
