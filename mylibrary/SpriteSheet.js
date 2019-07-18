"use strict";

/* Including the class in the namespace - explained in the comments in the myLibrary/gameobjects files -  */
var myLibrary = (function (myLibrary) {

    /* Constructor of the SpriteSheet class. The createCollisionMask parameter will be a boolean that will determine whether a collision mask for per-pixel collision 
    detection will be needed in that instance. This class will allow me to use sprite sheets, mantain their rows and columns and select a desired element of the
    sheet to be drawn. I also decided to follow a naming convention for my sprite sheets that follows this format: "sprite_name @ numColumns x numRows .fileFormat "
    This naming convention allows me to specify the dimensions of the sprite sheet in the file name, and using some methods defined here extract and use that info.
    There are three posibilities when dealing with a sprite: 
            1. The image is a single sprite: in this case I don't add any definition at the end of the file name ie: spr_acorn.png
            2. The image is a strip of sprites: in this case I add the @ sign at the end of the file name and an integer number after it that matches the number of sprites in the strip ie: spr_run@5.jpg
            3. The image is a sheet of sprites: here I follow the same steps as above but after the @ I define both the number of columns and rows ie: spr_explode@5x5.png */
    function SpriteSheet(image, createCollisionMask) {
        
        /* First I set two status variables that hold the number of sprites that are still loading and the total of sprites */
        myLibrary.Game._spritesStillLoading += 1;
        myLibrary.Game._totalSprites += 1;

        /* I create an instance of the Image object and set its source to the sprite passed to the constructor parameter */
        this._image = new Image();
        this._image.src = image;

        /* I create variables that represent the rows and columns of a sprite sheet that by defaul will always be at least 1x1 */
        this._sheetColumns = 1;
        this._sheetRows = 1;

        /* I also define a collisionMask variable that by default will be null. I will use it when I need to generate per-pixel collision detection 
        between sprites. Per-pixel collision detection is expensive so I will only use it for some sprites */
        this._collisionMask = null;

        /* Then, when the sprite is loaded, if it needs a collsiionMask this one will be created. Then I subtract the loaded sprite from the status
        variable _spritesStillLoading */
        var sprite = this;
        this._image.onload = function () {
            if (createCollisionMask) {
                sprite.createPixelCollisionMask();
            }
            myLibrary.Game._spritesStillLoading -= 1;
        };

        /* Here I determine the number of rows and columns of the sheet by using the split method 
        First I split the string removing all '/' present in it and obtaining an array with as many items as parent folders the sprite has */
        var pathSplit = image.split('/');

        /* Then, from the obtained array I store in a variable the last item (the file name itself) */
        var fileName = pathSplit[pathSplit.length - 1];

        /* Once I have the file name without the path I repeat the process to split the file extension ('.') and then the '@'' sign 
        If the resulting array has only one item it means there was no '@' sign in the file name so the image is a single sprite 
        and I don't need to extract more info from it, so I return from the method */
        var fileSplit = fileName.split(".")[0].split("@");
        if (fileSplit.length <= 1)
            return;

        /* But if the array lenght is greater that one it means the filename contains info about the rows, columns or both. So I look for
        and 'x' in the file name and split it from there. I store the result into colRow variable */
        var colRow = fileSplit[fileSplit.length - 1].split("x");

        /* The first item of the resulting array will be the number of columns and If the array lenght is 2 it means the second item is the
        number of rows. I update the member variables accordingly */
        this._sheetColumns = colRow[0];
        if (colRow.length === 2)
            this._sheetRows = colRow[1];
    }

    /* Property that retrieves the image represented by an instance of this class */
    Object.defineProperty(SpriteSheet.prototype, "image",
        {
            get: function () {
                return this._image;
            }
        });

    /* Property that returns the width of the currently displayed part of a sprite sheet */
    Object.defineProperty(SpriteSheet.prototype, "width",
        {
            get: function () {
                return this._image.width / this._sheetColumns;
            }
        });

    /* Property that returns the height of the currently displayed part of a sprite sheet */
    Object.defineProperty(SpriteSheet.prototype, "height",
        {
            get: function () {
                return this._image.height / this._sheetRows;
            }
        });

    /* Property that returns a new vector containing the X and Y measures of a sprite sheet */
    Object.defineProperty(SpriteSheet.prototype, "size",
        {
            get: function () {
                return new myLibrary.Vector2(this.width, this.height);
            },

        });

    /* Property that retrieves the center point of a sprite sheet */
    Object.defineProperty(SpriteSheet.prototype, "center",
        {
            get: function () {
                return this.size.divideBy(2);
            }
        });

    /* Property that returns the number of sprites in a sprite sheet */
    Object.defineProperty(SpriteSheet.prototype, "nrSheetElements",
        {
            get: function () {
                return this._sheetRows * this._sheetColumns;
            }
        });

    /* Method that draws the sprite in the pixelDataAuxCanvas and then extracts the the pixel colour data from it. I also initialize an
    array that will hold the collision mask and I make the pixelDataAuxCanvas the same size as the image */
    SpriteSheet.prototype.createPixelCollisionMask = function () {

        /* Initializing the array */
        this._collisionMask = [];

        /* Setting the size of the pixelDataAuxCanvas to the size of the sprite and */
        var w = this._image.width;
        var h = this._image.height;
        myLibrary.Canvas2D._pixeldrawingCanvas.width = w;
        myLibrary.Canvas2D._pixeldrawingCanvas.height = h;

        /* Getting the context of the auxiliar canvas and drawing the sprite into it using drawing states by saving the context first */
        var ctx = myLibrary.Canvas2D._pixeldrawingCanvas.getContext('2d');
        ctx.clearRect(0, 0, w, h);
        ctx.save();
        ctx.drawImage(this._image, 0, 0, w, h, 0, 0, w, h);
        ctx.restore();

        /* I use the canvas.context method "getImageData", which retrieves the colour data for each and every pixel drawn in the auxiliar 
        canvas and stores it into an array. This array will hold a very large array of numbers because the method stores 4 numeric values
        for each pixel into the array (ammount of red colour, ammount of green colour, ammount of blue colour & alpha -transparency- value) */
        var imageData = ctx.getImageData(0, 0, w, h);

        /* I don't care about the colour of a pixel but rather about if is transparent or not. Using a for loop I iterate through the array
        and I push every fourth value into the collision mask array.
        I start pushing elements into the array starting from the first fourth value stored into imageData.data array and then I keep pushing every
        fourth value - alpha - */
        for (var x = 3, l = w * h * 4; x < l; x += 4) {
            this._collisionMask.push(imageData.data[x]);
        }
    };

    /* Method that simplifies the access to the collision mask according to the pixel's X & Y coordinates, the current sheet index and wheter 
    the sprite is mirrored or not */
    SpriteSheet.prototype.getAlpha = function (x, y, sheetIndex, mirror) {

        /* If the collision mask array is empty it means it doesn't hold any transparent pixels in it, so I return a full alpha value 
        (255 = fully opaque) */
        if (this._collisionMask === null)
            return 255;

        /* I calculate the column and row indices of the currently active sheet index */
        var columnIndex = sheetIndex % this._sheetColumns;
        var rowIndex = Math.floor(sheetIndex / this._sheetColumns) % this._sheetRows;

        /* Then I calculate the pixel's X coordinate by multiplying the width of one sprite sheet column for the currently active sheet column
        index and adding the local x value -passed as a parameter-  */
        var targetPixelX = columnIndex * this.width + x;

        /* But if the sprite is mirrored I calculate this value starting from the right side of the sprite element and then I subtract x to get
        the pixel's x position. */
        if (mirror)
            targetPixelX = (columnIndex + 1) * this.width - x //- 1;

        /* I do the same with the Y coordinate but, as I only allowed sprites to be mirrored horizontally I won't need to make more but just
        one calculation */
        var targetPixelY = rowIndex * this.height + y;

        /* Based on the x and y coordinates of the pixel in the sprite, I calculate the index of that pixel in the collision mask array */
        var arrayIndex = Math.floor(targetPixelY * this._image.width + targetPixelX);

        /* I check if the recently calculated array index value is within the range of the array. If it is not, I return 0 - fully transparent -. 
        By returning a numeric value instead of just returning, I make sure that the getAlpha method will always give me a logic value even if I am
        trying to access non existent pixels. */
        if (arrayIndex < 0 || arrayIndex >= this._collisionMask.length)
            return 0;
        /* Finally I return the alpha value stored into collisionMask at the given index */
        else
            return this._collisionMask[arrayIndex];
    };

    /* Drawing method that uses the info passed to it in the parameters to draw, position, scale or mirror a sprite. */
    SpriteSheet.prototype.draw = function (position, origin, sheetIndex, mirror) {
        var columnIndex = sheetIndex % this._sheetColumns;
        var rowIndex = Math.floor(sheetIndex / this._sheetColumns) % this._sheetRows;
        var imagePart = new myLibrary.Rectangle(columnIndex * this.width, rowIndex * this.height,
            this.width, this.height);
        myLibrary.Canvas2D.drawImage(this._image, position, 0, 1, origin, imagePart, mirror);
    };

    myLibrary.SpriteSheet = SpriteSheet;
    return myLibrary;

})(myLibrary || {});
