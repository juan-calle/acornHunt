"use strict";

/* Constructor of the timer class, blueprint of the timer that will limit the time the player has to solve a level. It inherits from the Label class
because it will be represented by text on the screen, therefore I call the constructor of the parent class first and I also call the reset method
so when an instance of this class is created the instructions defined in that method will be automatically triggered*/
function Timer(layer, id) {
    myLibrary.Label.call(this, "Arial", "26pt", layer, id);
    this.reset()
}

Timer.prototype = Object.create(myLibrary.Label.prototype);

/* Property that tells me if the timer has reached zero. I will use it later to manage the event that the player doesn't finish the level in time */
Object.defineProperty(Timer.prototype, "gameOver",
    {
        get: function () {
            return this._timeLeft <= 0;
        }
    });

/* In this update method I override the update method of the class' grandparent (GameObject) and I define the timer's behaviour in it.*/
Timer.prototype.update = function (timeStep) {

    /* Firstly, I only update the timer if it is running (this.running = true) */
    if (!this.running)
        return;

    /* If the above condition is false, then I update the number of seconds shown by the timer by subtracting the elapsed time since the last game
    loop iteration (timeStep = 1/60) and multiplying it by the penaltyMultiplier value */
    this._timeLeft -= timeStep * this.penaltyMultiplier;

    /* Then I make the timer stop running once it reaches a value of zero */
    if (this._timeLeft < 0)
        this.running = false;

    /* Using the Math object and its "floor" and "ceil" methods I can nicely display amounts of time in a format 'minutes : seconds' instead of displaying
    only the number of seconds, which will look quite ugly if, for example I want to give the player 2 minutes to solve the game (2:00 looks much better
    than 120). So I declare both varibles for minutes and seconds. For the minutes I divide the time left by 60 in order to obtain the minutes and I
    take the closest smaller integer number to the result obtained. For the seconds I use a modulo division to get the remainder after dividing the timeLeft
    by 60 and I pick the highest integer number closest
    to the result of the operation */
    var minutes = Math.floor(this._timeLeft / 60);
    var seconds = Math.ceil(this._timeLeft % 60);

    /* With this if instructions I manage the outlook of how the time is displayed. When the time left is zero, I also make sure to set the value of 
    minutes and seconds to zero as well. Otherwise, I create a variable text in which I store the remaining time in the desired format mm:ss */
    if (this._timeLeft < 0)
        minutes = seconds = 0;
    this.text = minutes + ":" + seconds;

    /* When the timer goes below 10, I need to add a 0 before the number of seconds left, otherwise the format mm:ss will be mm:s, and that is not what
    I want. I also change the colour of the text to yellow to better suit the design of the game */
    if (seconds < 10)
        this.text = minutes + ":0" + seconds;
    this.color = myLibrary.Color.yellow;

    /* Finally, I warn the user that the time is running low by changing the colour of the text to red when the timer reaches a value of 10 or less */
    if (this._timeLeft <= 10 && seconds % 2 === 0)
        this.color = myLibrary.Color.red;
};

/* In this reset method I override the reset method of the class' grandparent (GameObject) and I provide the following instructions */
Timer.prototype.reset = function () {
    myLibrary.Label.prototype.reset.call(this);

    /* I declare a variable that holds the remaining time, another one that contains a boolean that tells me if the timer is running or not, and
    finally I add another one called penaltyMultiplier that will hold values that will speed up the countdown according to different game penalties */
    this._timeLeft = 30;
    this.running = true;
    this.penaltyMultiplier = 1;
};