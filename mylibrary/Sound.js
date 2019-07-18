"use strict";

/* Including the class in the namespace - explained in the comments in the myLibrary/gameobjects files -  */
var myLibrary = (function (myLibrary) {

    /* Constructor of the Sound class that allows me to play back and loop sounds. It requires as parameters the sound to be played and a boolean
    indicating wheter the sound should be looped or not */
    function Sound(sound, looping) {
        /* As a default value for when no parameter is provided for looping, I tell the interpreter that the sound shouldn't be looped*/
        this.looping = typeof looping !== 'undefined' ? looping : false;
        
        /* I create an audio object and initialize its source to the sound file that needs to be loaded according to the browser's capabilities */
        this.snd = new Audio();
        if (this.snd.canPlayType("audio/ogg")) {
            this.snd.src = sound + ".ogg";
        } else if (this.snd.canPlayType("audio/mpeg")) {
            this.snd.src = sound + ".mp3";
        } else // we cannot play audio in this browser
            this.snd = null;
    }

    /* Setting read & write properties to get the current volume of a sound or modify it by passing a value between 0 an 1
    as a parameter of the setter */
    Object.defineProperty(Sound.prototype, "volume",
        {
            get: function () {
                return this.snd.volume;
            },
            set: function (value) {
                this.snd.volume = value;
            }
        });

    /* In this method I load the sound and I set the atribute autoplay to true, so it will play as soon as it's loaded */
    Sound.prototype.play = function () {
        if (this.snd === null)
            return;
        this.snd.load();
        this.snd.autoplay = true;

        /* If the sound doesn't need to loop -which it doesn't by default- no more instructions will be performed */
        if (!this.looping)
            return;
        /* But if it does, I add an event listener to check when the sound has finished playing and trigger a function that reloads and plays the
        sound again */
        this.snd.addEventListener('ended', function () {
            this.load();
            this.autoplay = true;
        }, false);
    };

    myLibrary.Sound = Sound;
    return myLibrary;

})(myLibrary || {});