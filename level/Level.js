"use strict";

/* Class Level that inherits from GameObjectList and requires the level index and Id as parameters. In the constructor I create the different
game objects that will be present in the level */
function Level(levelIndex, id) {
    myLibrary.GameObjectList.call(this, id);

    /* Variable holding the index number of the level */
    this._levelIndex = levelIndex;

    /* I create a new GameObjectList called _acorns that will hold all the Acorn instances present in the level and I add this list to the
    GameObjectList parent class */
    this._acorns = new myLibrary.GameObjectList(ID.layer_objects);
    this.add(this._acorns);

    /* I create a button that will allow me to exit from the level and go back to the level selection menu. I give it a position and I
    add it to the GameObject list */
    this._quitButton = new myLibrary.Button(sprites.button_quit, ID.layer_overlays);
    this._quitButton.position = new myLibrary.Vector2(25, 10);
    this.add(this._quitButton);

    /* In the same way I create a list that will hold all the backgrounds and I store it in the parent object list too*/
    this.backgrounds = new myLibrary.GameObjectList(ID.layer_background);

    /* I create and position the level main background image and I add it to the recently created backgrounds list. Then, I add the list
    itself to the parent GameObjectList */

    this.background_main = new myLibrary.SpriteGameObject(sprites.background_level[levelIndex+1], ID.layer_background);
    this.backgrounds.add(this.background_main);
    this.add(this.backgrounds);

    /* I also create another spriteGameObject for the timer background and I position it on the screen. Then I add it to GameObjectList */
    var timerBackground = new myLibrary.SpriteGameObject(sprites.timer, ID.layer_overlays);
    timerBackground.position = new myLibrary.Vector2(1320, 10);
    this.add(timerBackground);
    /* The I create a new timer that gets added to the GameObjectList too. */
    var timer = new Timer(ID.layer_overlays_1, ID.timer);
    timer.position = new myLibrary.Vector2(1335, 33);
    this.add(timer);
    /* Finally, I call the loadtiles method that will manage the creation of the tile objects needed to build the game world of the level */
    this.loadTiles();
}

Level.prototype = Object.create(myLibrary.GameObjectList.prototype);

/* Property that checks whether the player has collected all the acorns on the screen and if it has reached the exit sign. To do so I use the id 
I gave to the player and the exit sign and I use the find method of the GameObjectList class to find both items and store a reference to them into
two variables. Then, using an if instruction I check if the exit sign bounding box has collide with the player's bounding box. If not, I return from
false because there was no collision. If there was collision, I use a for loop to iterate through the list of acorns checking their visibility; If
the visibility of all the acorns is set to false, it means the player has picked all of them */
Object.defineProperty(Level.prototype, "completed", 
    {
        get: function () {
            var player = this.find(ID.player);
            var exit = this.find(ID.exit);
            if (!exit.collidesWith(player))
                return false;
            for (var i = 0, l = this._acorns.length; i < l; ++i) {
                if (this._acorns.at(i).visible)
                    return false;
            }
            return true;
        }
    })

/* Property that returns true if the timer is 0 or the player has died */
Object.defineProperty(Level.prototype, "gameOver",
    {
        get: function () {
            var timer = this.find(ID.timer);
            var player = this.find(ID.player);
            return !player.alive || timer.gameOver;
        }
    });

/* Here I retrieve info from the global LEVELS variable and I create the hint field and I set its visibility timer */
Level.prototype.loadTiles = function () {
    var levelData = window.LEVELS[this._levelIndex];

    var hintField = new myLibrary.GameObjectList(ID.layer_overlays);
    this.add(hintField);
    var hintFrame = new myLibrary.SpriteGameObject(sprites.frame_hint, ID.layer_overlays_1);
    hintField.position = new myLibrary.Vector2(hintFrame.screenCenterX, 10);
    hintField.add(hintFrame);
    var hintText = new myLibrary.Label("Helvetica", "14pt", ID.layer_overlays_2);
    hintText.text = levelData.hint;
    hintText.position = new myLibrary.Vector2(200, 25);
    hintText.color = myLibrary.Color.white;
    hintField.add(hintText);
    var hintTimer = new VisibilityTimer(hintField, ID.layer_overlays, ID.hint_timer);
    this.add(hintTimer);

    /* If the device is a touch device I show the buttons needed to control the player in such devices */
    if (myLibrary.Touch.isTouchDevice) {
        var walkLeftButton = new myLibrary.Button(sprites.buttons_player, ID.layer_overlays, ID.button_walkleft);
        walkLeftButton.position = new myLibrary.Vector2(10, 500);
        this.add(walkLeftButton);
        var walkRightButton = new myLibrary.Button(sprites.buttons_player, ID.layer_overlays, ID.button_walkright);
        walkRightButton.position = new myLibrary.Vector2(walkRightButton.width + 20, 500);
        walkRightButton.sheetIndex = 1;
        this.add(walkRightButton);
        var jumpButton = new myLibrary.Button(sprites.buttons_player, ID.layer_overlays, ID.button_jump);
        jumpButton.position = new myLibrary.Vector2(myLibrary.Game.size.x - jumpButton.width - 10, 500);
        jumpButton.sheetIndex = 2;
        this.add(jumpButton);
    }

    /* I create the tile field grid and give it a number of rows, columns, cell width and height and I populate
    it with the different tiles at their certain positions */
    var tiles = new TileField(levelData.tiles.length, levelData.tiles[0].length, 1, ID.tiles);
    this.add(tiles);
    tiles.cellWidth = 72;
    tiles.cellHeight = 55;
    for (var y = 0, ly = tiles.rows; y < ly; ++y)
        for (var x = 0, lx = tiles.columns; x < lx; ++x) {
            var t = this.loadTile(levelData.tiles[y][x], x, y);
            tiles.add(t, x, y);
        }
};


Level.prototype.loadTile = function (tileType, x, y) {
    switch (tileType) {
        case '.':
            return new Tile();
        case '-':
            return this.loadBasicTile(sprites.platform, TileType.platform);
        case '+':
            return this.loadBasicTile(sprites.platform_hot, TileType.platform, true, false);
        case '@':
            return this.loadBasicTile(sprites.platform_ice, TileType.platform, false, true);
        case 'X':
            return this.loadEndTile(x, y);
        case 'A':
            return this.loadAcornTile(x, y);
        case '1':
            return this.loadStartTile(x, y);            
        case '#':
            return this.loadBasicTile(sprites.wall, TileType.normal);
        case '^':
            return this.loadBasicTile(sprites.wall_hot, TileType.normal, true, false);
        case '*':
            return this.loadBasicTile(sprites.wall_ice, TileType.normal, false, true);
        default:
            return new Tile();
    }
};

Level.prototype.loadBasicTile = function (id, tileType, hot, ice) {
    var t = new Tile(id, tileType);
    t.hot = hot;
    t.ice = ice;
    return t;
};

Level.prototype.loadStartTile = function (x, y) {
    var tiles = this.find(ID.tiles);
    var startPosition = new myLibrary.Vector2(x * tiles.cellWidth, (y + 1) * tiles.cellHeight);
    this.add(new Player(startPosition, ID.layer_objects, ID.player));
    return new Tile();
};

Level.prototype.loadEndTile = function (x, y) {
    var tiles = this.find(ID.tiles);
    var exit = new myLibrary.SpriteGameObject(sprites.goal, ID.layer_objects, ID.exit);
    exit.position = new myLibrary.Vector2(x * tiles.cellWidth, (y + 1) * tiles.cellHeight);
    exit.origin = new myLibrary.Vector2(0, exit.height);
    this.add(exit);
    return new Tile();
};

Level.prototype.loadAcornTile = function (x, y) {
    var tiles = this.find(ID.tiles);
    var w = new Acorn(ID.layer_objects);
    w.origin = w.center.copy();
    w.position = new myLibrary.Vector2((x + 0.5) * tiles.cellWidth, (y + 0.5) * tiles.cellHeight - 10);
    this._acorns.add(w);
    return new Tile();
};

Level.prototype.handleInput = function (timeStep) {
    myLibrary.GameObjectList.prototype.handleInput.call(this, timeStep);

    if (!this._quitButton.pressed)
        return;
    this.reset();
    myLibrary.GameStateManager.switchTo(ID.game_state_levelselect);
};

/* The update method of the Level class checks whether the level has been completed or not. If so, I call the levelFinished method of the player
class that plays the celebration animation */
Level.prototype.update = function (timeStep) {
    myLibrary.GameObjectList.prototype.update.call(this, timeStep);

    var timer = this.find(ID.timer);
    var player = this.find(ID.player);

    /* I check if the player is alive or not. If not, I stop the timer */
     if (!player.alive)
         timer.running = false;

    /* Here I access the timer property of the timer object that tells me if there's still time remaining in the timer. If not,
    I call the explode method of the Player class that plays an animation */
     if (timer.gameOver)
         player.explode();

    /* Here I check if the player has completed the level and the timer still has time left, in which case I call the levelFinished method of 
    the Player class that plays an animation, I stop the timer and I change the solved variable of the level to true. */
     if (this.completed && timer.running) {
         player.levelFinished();
         timer.running = false;
         window.LEVELS[this._levelIndex].solved = true;
    }
};

/* Method that */
Level.prototype.reset = function () {
    myLibrary.GameObjectList.prototype.reset.call(this);
    var hintTimer = this.find(ID.hint_timer);
    hintTimer.startVisible();
};