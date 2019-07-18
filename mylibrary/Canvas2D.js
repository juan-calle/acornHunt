"use strict";

/* Including the class in the namespace - explained in the comments in the myLibrary/gameobjects files -  */
var myLibrary = (function (myLibrary) {

    /* Constructor of the Canvas_2D Singleton class (there is only one single Canvas2d object which is instantiated just once as a global variable 
    at the end of this file) that manages the way the canvas is initialized and cleared and also how it draws images and text.
    In the constructor I add an underscore at the beginning of its member variables to state that this variables are internal and shouldn't be
    changed outside this class */
    function Canvas2D_Singleton() {
        this._canvas = null;
        this._canvasContext = null;

        /* I define an null variable that will hold a new canvas that I will use to draw sprites and extract their pixel colour data, so I can generate more
        precise collisions between sprite game objects */
        this._pixelDataAuxCanvas = null;
        this._canvasOffset = myLibrary.Vector2.zero;
    }

    /* Property that retrieves the offset of the canvas */
    Object.defineProperty(Canvas2D_Singleton.prototype, "offset",
        {
            get: function () {
                return this._canvasOffset;
            }
        });

    /* Property that allows me easily calculate the position at which the sprites should be drawn after resizing by retrieving a vector that
    holds the value of the scaling factor and is applied in the draw methods of this class */
    Object.defineProperty(Canvas2D_Singleton.prototype, "scale",
        {
            get: function () {
                return new myLibrary.Vector2(this._canvas.width / myLibrary.Game.size.x,
                    this._canvas.height / myLibrary.Game.size.y);
            }
        });

    /* Method that initialize the Canvas. It takes the div containing the Canvas and its name as a parameters. It also checks if the getContext 
    method exists, and if it does, it means that the Canvas exists and sets its value to 2d, otherwise the script couldn't find the canvas what 
    means that the browser's not suporting the Canvas feature, in which case we throw an alert to the user */
    Canvas2D_Singleton.prototype.initialize = function (divName, canvasName) {
        this._canvas = document.getElementById(canvasName);
        this._div = document.getElementById(divName);

        if (this._canvas.getContext)
            this._canvasContext = this._canvas.getContext('2d');
        else {
            alert('Your browser is not HTML5 compatible.!');
            return;
        }

        /* I initialize the auxiliar canvas that I will use to retrieve the pixel colour data for sprites that need per-pixel collision detection */
        this._pixelDataAuxCanvas = document.createElement('canvasAux');

        /* I also include an event handler to check whenever the viewport is resized and call the resize method to calculate the scaling factor*/
        window.onresize = this.resize;
        this.resize();
    };

    /* Method that clears the canvas every time the game main-loop is executed */
    Canvas2D_Singleton.prototype.clear = function () {
        this._canvasContext.clearRect(0, 0, this._canvas.width, this._canvas.height);
    };

    /* Method that calculates the right scale of the game according to the window size when the game is started. It needs to calculate the desired 
    scale at which the sprites should be drawn, and the margins of the game area to place the game in the middle of the window */
    Canvas2D_Singleton.prototype.resize = function () {
        /* I first store the div and the canvas into two variables*/
        var gameCanvas = myLibrary.Canvas2D._canvas;
        var gameArea = myLibrary.Canvas2D._div;
        
        /* Here I calculate the ratio of the native size of the game*/
        var nativeRatio = myLibrary.Game.size.x / myLibrary.Game.size.y;
        
        /* I also access the browser's window innerWidth and innerHeight variables to calculate its ratio */
        var newWidth = window.innerWidth;
        var newHeight = window.innerHeight;
        var newRatio = newWidth / newHeight;

        /* I make sure the both of the ratios (native and new) are the same 
        If the new ratio is bigger than the native ratio it means the browser's window is too wide and I have to recalculate the width in order to
        correct the ratio*/
        if (newRatio > nativeRatio) {
            newWidth = newHeight * nativeRatio;
        
        /* In case the new ratio is smaller, it means that the browser window is too high and I have to recalculate the height */
        } else {
            newHeight = newWidth / nativeRatio;
        }
        /* Once I have the correct values of the resized width and height I edit the style of the div element to match these values */
        gameArea.style.width = newWidth + 'px';
        gameArea.style.height = newHeight + 'px';

        /* And I also apply some margins to the div to have the game positioned in the center of the screen */
        gameArea.style.marginTop = (window.innerHeight - newHeight) / 2 + 'px';
        gameArea.style.marginLeft = (window.innerWidth - newWidth) / 2 + 'px';
        gameArea.style.marginBottom = (window.innerHeight - newHeight) / 2 + 'px';
        gameArea.style.marginRight = (window.innerWidth - newWidth) / 2 + 'px';

        /* Finally I change the size of the canvas to the new resized values */
        gameCanvas.width = newWidth;
        gameCanvas.height = newHeight;

        var offset = myLibrary.Vector2.zero;
        if (gameCanvas.offsetParent) {
            do {
                offset.x += gameCanvas.offsetLeft;
                offset.y += gameCanvas.offsetTop;
            } while ((gameCanvas = gameCanvas.offsetParent));
        }
        myLibrary.Canvas2D._canvasOffset = offset;
    };

    /* Method that extends, simplifies and improve the canvasContext drawImage method by letting it automatically provide default values for position,
    rotation, scale, origin and clipping rectangle parameters */
    Canvas2D_Singleton.prototype.drawImage = function (sprite, position, rotation, scale, origin, sourceRect, mirror) {
        var canvasScale = this.scale;

        /* Here I access the getter of the scale property that retrieves the scaling ratio */
        position = typeof position !== 'undefined' ? position : myLibrary.Vector2.zero;
        rotation = typeof rotation !== 'undefined' ? rotation : 0;
        scale = typeof scale !== 'undefined' ? scale : 1;
        origin = typeof origin !== 'undefined' ? origin : myLibrary.Vector2.zero;
        sourceRect = typeof sourceRect !== 'undefined' ? sourceRect : new myLibrary.Rectangle(0, 0, sprite.width, sprite.height);

        /* I make use of the drawing states capabilities of the Canvas context to have a wider variety at the time of drawing sprites, for that I
        need to save the canvas context first, then define the different drawing states and finally restore the context. */
        this._canvasContext.save();

        /* In addition, if the sprite I want to draw has its mirror property set to true, I scale it negatively */
        if (mirror) {                                       
            this._canvasContext.scale(scale * canvasScale.x * -1, scale * canvasScale.y);
            /* I also translate and rotate the canvas context taking into account the sprite's mirrored state */
            this._canvasContext.translate(-position.x - sourceRect.width, position.y);
            this._canvasContext.rotate(rotation);
            this._canvasContext.drawImage(sprite, sourceRect.x, sourceRect.y,
                sourceRect.width, sourceRect.height,
                sourceRect.width - origin.x, -origin.y,
                sourceRect.width, sourceRect.height);
        }                                           
        else {                                  
            this._canvasContext.scale(scale * canvasScale.x, scale * canvasScale.y);
            this._canvasContext.translate(position.x, position.y);
            this._canvasContext.rotate(rotation);
            this._canvasContext.drawImage(sprite, sourceRect.x, sourceRect.y,
                sourceRect.width, sourceRect.height,
                -origin.x, -origin.y,
                sourceRect.width, sourceRect.height);
        }   
        this._canvasContext.restore();
    };

    /* Method that extends, simplifies and improve the native Canvas context capabilities to draw text on the screen and sets a series of default 
    values for when any of the parameters stated in the method definition are not defined. This is done in a very similar way as before in the 
    drawImage method*/
    Canvas2D_Singleton.prototype.drawText = function (text, position, origin, color, textAlign, fontname, fontsize) {
        var canvasScale = this.scale;

        position = typeof position !== 'undefined' ? position : myLibrary.Vector2.zero;
        origin = typeof origin !== 'undefined' ? origin : myLibrary.Vector2.zero;
        color = typeof color !== 'undefined' ? color : myLibrary.Color.black;
        textAlign = typeof textAlign !== 'undefined' ? textAlign : "top";
        fontname = typeof fontname !== 'undefined' ? fontname : "Courier New";
        fontsize = typeof fontsize !== 'undefined' ? fontsize : "20px";

        this._canvasContext.save();
        
        /* At the time of drawing text I apply the the scaling vector obtained in the scale property*/
        this._canvasContext.scale(canvasScale.x, canvasScale.y);
        this._canvasContext.translate(position.x - origin.x, position.y - origin.y);
        this._canvasContext.textBaseline = 'top';
        this._canvasContext.font = fontsize + " " + fontname;
        this._canvasContext.fillStyle = color.toString();
        this._canvasContext.textAlign = textAlign;
        this._canvasContext.fillText(text, 0, 0);
        this._canvasContext.restore();
    };

    /* Method that allows me to draw a pixel on the canvas given the desired colour and position */
    Canvas2D_Singleton.prototype.drawPixel = function (x, y, color) {
        /* Here I access the getter of the scale property that retrieves the scaling ratio */
        var canvasscale = this.scale;
        this._canvasContext.save();
        this._canvasContext.scale(canvasscale.x, canvasscale.y);
        this._canvasContext.fillStyle = color.toString();
        /* At the end of the day a pixel is a rectangle with a measure of 1 in each of its sides */
        this._canvasContext.fillRect(x, y, 1, 1);
        this._canvasContext.restore();
    };

    /* Method that allows me to draw a rectangle on screen given its desired position, width & height */
    Canvas2D_Singleton.prototype.drawRectangle = function (x, y, width, height) {
        var canvasScale = this.scale;
        this._canvasContext.save();
        this._canvasContext.scale(canvasScale.x, canvasScale.y);
        this._canvasContext.strokeRect(x, y, width, height);
        this._canvasContext.restore();
    };

    myLibrary.Canvas2D = new Canvas2D_Singleton();

    return myLibrary;

})(myLibrary || {});
