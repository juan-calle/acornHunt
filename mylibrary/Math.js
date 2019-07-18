"use strict";


if (!Math.sign) {
    Math.sign = function (value) {
        if (value > 0)
            return 1;
        else if (value < 0)
            return -1;
        else
            return 0;
    };
}

/* With this instruction I augment the JavaScript Math object by supplying a custom-made method that checks if a supplied value is contained
between a minimum and maximum value. If the value is lower than the minimum allowed value the instruction will return the minimum value defined
in the method parameters. In the same way, if the value is greater than the maximum allowed value the instruction will return the minimum value 
defined in the method. Otherwise, if the value is contained between the minimum and maximum values the instruction will return that value.
This extra method will be usefull for example when I want to calculate overlapping rectangles derived from the collision of two sprites' bounding
boxes    */
if (!Math.clamp) {
    Math.clamp = function (value, min, max) {
        if (value < min)
            return min;
        else if (value > max)
            return max;
        else
            return value;
    };
}