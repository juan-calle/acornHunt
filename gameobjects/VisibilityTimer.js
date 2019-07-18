"use strict";

/* Constructor of the VisibilityTimer class that targets an object and sets its visibility to false after a predefined timer runs out of time
It inherits from the GameObject class and In addition I declare a variable holding a reference of the targeted object, the time left and total
time available in the timer. I use it to make the hint field at the top of the level disappear after 5 seconds*/
function VisibilityTimer(target, layer, id) {
    myLibrary.GameObject.call(this, layer, id);
    this._target = target;
    this._timeLeft = 0;
    this._totalTime = 5;
}

VisibilityTimer.prototype = Object.create(myLibrary.GameObject.prototype);

/* I subtract the time passed since the last loop iteration and when the value of _timeLeft reaches 0, the object becomes invisible */
VisibilityTimer.prototype.update = function (timeStep) {
    this._timeLeft -= timeStep;
    if (this._timeLeft <= 0)
        this._target.visible = false;
};

/* Method that sets the time left to be the same as the total time and the object to visible. It is called within the Level class */
VisibilityTimer.prototype.startVisible = function () {
    this._timeLeft = this._totalTime;
    this._target.visible = true;
};