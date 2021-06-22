(function (window) {
    "use strict";

    var SpriteAnim = function (canvasId, forceCanvas) {
        this.canvas = document.getElementById(canvasId); // Select given canvas ID
        this.useCanvas = forceCanvas || false;
        this.init();
    }
    // Get type of context
    SpriteAnim.prototype.init = function() {
        this.context = this.canvas.getContext("2d"); // Get 2D context
    }
    // Start method
    SpriteAnim.prototype.start = function (spriteObj) {
        this.spriteObj = spriteObj;
        this.onStart(); // onStart callback function

        // Sprite Info
        this.width = this.spriteObj.frameWidth; // Set canvas width
        this.height = this.spriteObj.frameHeight; // Set canvas width
        this.totalWidth = this.spriteObj.image.width; // Sprite total width
        this.totalHeight = this.spriteObj.image.height; // Sprite total height
        this.image = this.spriteObj.image; // Sprite image

        this.canvas.width = this.width; // Set canvas width
        this.canvas.height = this.height; // Set canvas width

        // Frame stuff
        this.horizontalframeIndex = 0; // Frame index
        this.verticalFrameIndex = 0;
        this.horizontalFrames = (this.totalWidth / spriteObj.frameWidth) || 1; // Horizontal frames
        this.verticalFrames = (this.totalHeight / spriteObj.frameHeight) || 1; // Vertical frames

        // FPS stuff
        this.fps = this.spriteObj.fps || 30;
        this.timestamp_init = Date.now(); // Before execution of ticker
        this.interval = 1000 / this.fps; // Frame's interval in ms 
        this.timestamp_now, this.delta; // Vars
        this.loopSprite = this.spriteObj.loop || false; // If should loop boolean
        this.playSprite = true; // Play state boolean

        this.canvasTicker(); // Start ticker
    }
    // Stop method
    SpriteAnim.prototype.stop = function() {
        this.playSprite = false;
        this.context.clearRect(0, 0, this.totalWidth, this.totalHeight);
    }
    // New tick update
    SpriteAnim.prototype.canvasUpdate = function() {
        if (this.horizontalframeIndex < this.horizontalFrames) {
            this.horizontalframeIndex += 1;
            this.draw();
        } else {
            if (this.verticalFrameIndex < this.verticalFrames) {
                this.verticalFrameIndex += 1;
                this.horizontalframeIndex = 1;
                this.draw();
            } else {
                if (this.loopSprite) {
                    this.verticalFrameIndex = 1;
                    this.horizontalframeIndex = 1;
                    this.draw();
                } else {
                    this.stop();
                }
                this.onComplete();
            }
        }
    };
    // On start callback
    SpriteAnim.prototype.onStart = function() {
        if (this.spriteObj.onStart) {
            this.spriteObj.onStart();
        }
    };
    // On complete callback
    SpriteAnim.prototype.onComplete = function() {
        if (this.spriteObj.onComplete) {
            this.spriteObj.onComplete();
        }
    };
    // Draw new frame
    SpriteAnim.prototype.draw = function() {
        this.context.clearRect(0, 0, this.totalWidth, this.totalHeight);
        this.context.drawImage(
            this.image,
            (this.horizontalframeIndex - 1) * this.totalWidth / this.horizontalFrames,
            (this.verticalFrameIndex - 1) * this.totalHeight / this.verticalFrames,
            this.totalWidth / this.horizontalFrames,
            this.totalHeight,
            0,
            0,
            this.totalWidth / this.horizontalFrames,
            this.totalHeight
        );
    };
    // Ticker
    SpriteAnim.prototype.canvasTicker = function() {
        if (this.playSprite) {
            window.requestAnimationFrame(this.canvasTicker.bind(this));
            this.timestamp_now = Date.now();
            this.delta = this.timestamp_now - this.timestamp_init;
            if (this.delta > this.interval) {
                this.timestamp_init = this.timestamp_now - (this.delta % this.interval);
                this.canvasUpdate();
            }
        }
    };
    window.SpriteAnim = SpriteAnim;
})(window);