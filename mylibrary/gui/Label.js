"use strict";

/* Including the class in the namespace - explained in the comments in the myLibrary/gameobjects files -  */
var myLibrary = (function (myLibrary) {

    /* Label class constructor, inherits from GameObject and its main functionality is to write some text on the screen at a certain position
    by requiring the text to write, a fontsize and a font name, appart from the usual layer and id parameters. 
    I also keep some more properties of the text to be written in the member variables, and I set some default values for its parameters*/
    function Label(fontname, fontsize, layer, id) {
        myLibrary.GameObject.call(this, layer, id);

        this.color = myLibrary.Color.black;
        this.origin = myLibrary.Vector2.zero;
        this._fontname = typeof fontname !== 'undefined' ? fontname : "Courier New";
        this._fontsize = typeof fontsize !== 'undefined' ? fontsize : "20px";
        this._contents = "";
        this._align = "left";
        
        /* I declare this variable in oreder to calculate the size of the text (widht and height in pixels) which is very handy to write text
        in the spot.*/
        this._size = myLibrary.Vector2.zero;
    }

    /* Calling the prototype of GameObject and storing it into the prototype of Label */
    Label.prototype = Object.create(myLibrary.GameObject.prototype);    

    /* Function that helps me to calculate the size of the text by dynamically adding the text to the HTML page and calculating its size when it's
    drawn. Then it removes it again.
    First I create a div where I write the text outside of the screen (-1000,-1000) so it cannot be seen and I can calculate its size*/
    function calculateTextSize(fontname, fontsize, text) {
        var div = document.createElement("div");
        div.style.position = "absolute";
        div.style.left = -1000;
        div.style.top = -1000;
        document.body.appendChild(div);

        /* I add a capital M as a default value because is normally the tallest and widest of the characters, I also style it with my desired font
        family and fontsize.*/
        text = typeof text !== 'undefined' ? text : "M";
        div.style.fontSize = "" + fontsize;
        div.style.fontFamily = fontname;
        div.innerHTML = text;

        /* I measure the text size by measuring its offsetWidth & offsetheight properties and I store the result in a new vector. Then I remove the div
        from the HTML and return the vector just calculated*/
        var size = new myLibrary.Vector2(div.offsetWidth, div.offsetHeight);
        document.body.removeChild(div);
        return size;
    }

    /* Read-only property to retrieve the value of the size internal variable once the function calculateTextSize has done its work*/
    Object.defineProperty(Label.prototype, "size",
        {
            get: function () {
                return this._size;
            }
        });

    /* Property that returns the width of the text */
    Object.defineProperty(Label.prototype, "width",
        {
            get: function () {
                return this._size.x;
            }
        });

    /* Property that returns the height of the text */
    Object.defineProperty(Label.prototype, "height",
        {
            get: function () {
                return this._size.y;
            }
        });

    /* Property that easily allows me to place the drawn text in the middle of the x axis of the screen*/
    Object.defineProperty(Label.prototype, "screenCenterX",
        {
            get: function () {
                return (myLibrary.Game.size.x - this.width) / 2 + this.origin.x;
            }
        });

    /* Property that easily allows me to place the drawn text in the middle of the y axis of the screen*/
    Object.defineProperty(Label.prototype, "screenCenterY",
        {
            get: function () {
                return (myLibrary.Game.size.y - this.height) / 2 + this.origin.y;
            }
        });

    /* Property that centers the text in both x and y axis of the screen*/
    Object.defineProperty(Label.prototype, "screenCenter",
        {
            get: function () {
                return myLibrary.Game.size.subtract(this.size).divideBy(2).addTo(this.origin);
            }
        });

    /* Property in where I can set the text to be measured as well as retrieving the content of text already set in the _contents member
    variable */
    Object.defineProperty(Label.prototype, "text",
        {
            get: function () {
                return this._contents;
            },

            set: function (value) {
                this._contents = value;
                this._size = calculateTextSize(this._fontname, this._fontsize, value);
            }
        });

    /* Drawing methof of the Label class that checks if the text object is visible or not, if it's visible it calls the Canvas drawText
    method and uses the variables declared in the constructor and the position inherited by the parent class as parameters*/
    Label.prototype.draw = function () {
        if (!this.visible)
            return;
        myLibrary.Canvas2D.drawText(this._contents, this.worldPosition,
            this.origin, this.color, this._align,
            this._fontname, this._fontsize);
    };

    myLibrary.Label = Label;
    return myLibrary;

})(myLibrary || {});
