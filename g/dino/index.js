// Copyright (c) 2021 HowardZhangdqs GDev TEAM. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// extract from chromium source code by @HowardZhangdqs
var hzwd = true
  , hzupoc = false
  , hzdooc = false
  , hzup = document.getElementById('hzbtup')
  , hzdo = document.getElementById('hzbtdo');

(function() {
    'use strict';
    /**
     * T-Rex runner.
     * @param {string} outerContainerId Outer containing element id.
     * @param {Object} opt_config
     * @constructor
     * @export
     */
    function Runner(outerContainerId, opt_config) {
        // Singleton
        if (Runner.instance_) {
            return Runner.instance_;
        }
        Runner.instance_ = this;

        this.outerContainerEl = document.querySelector(outerContainerId);
        this.containerEl = null;
        this.snackbarEl = null;
        this.detailsButton = this.outerContainerEl.querySelector('#details-button');

        this.config = opt_config || Runner.config;

        this.dimensions = Runner.defaultDimensions;

        this.canvas = null;
        this.canvasCtx = null;

        this.tRex = null;

        this.distanceMeter = null;
        this.distanceRan = 0;

        this.highestScore = 0;

        this.time = 0;
        this.runningTime = 0;
        this.msPerFrame = 1000 / FPS;
        this.currentSpeed = this.config.SPEED;

        this.obstacles = [];

        this.activated = false;
        // Whether the easter egg has been activated.
        this.playing = false;
        // Whether the game is currently in play state.
        this.crashed = false;
        this.paused = false;
        this.inverted = false;
        this.invertTimer = 0;
        this.resizeTimerId_ = null;

        this.playCount = 0;

        // Sound FX.
        this.audioBuffer = null;
        this.soundFx = {};

        // Global web audio context for playing sounds.
        this.audioContext = null;

        // Images.
        this.images = {};
        this.imagesLoaded = 0;

        if (this.isDisabled()) {
            this.setupDisabledRunner();
        } else {
            this.loadImages();
        }
    }
    window['Runner'] = Runner;

    /**
     * Default game width.
     * @const
     */
    var DEFAULT_WIDTH = 600;

    /**
     * Frames per second.
     * @const
     */
    var FPS = 60;

    /** @const */
    var IS_HIDPI = false;
    /** window.devicePixelRatio > 1 */

    /** @const */
    var IS_IOS = /iPad|iPhone|iPod/.test(window.navigator.platform);
    /** */

    /** @const */
    var IS_MOBILE = false;
    /* /Android/.test(window.navigator.userAgent) || IS_IOS */
    /** @const */
    var IS_TOUCH_ENABLED = 'ontouchstart'in window;
    /**  */

    /**
     * Default game configuration.
     * @enum {number}
     */
    Runner.config = {
        ACCELERATION: 0.001,
        BG_CLOUD_SPEED: 0.2,
        BOTTOM_PAD: 10,
        CLEAR_TIME: 3000,
        CLOUD_FREQUENCY: 0.5,
        GAMEOVER_CLEAR_TIME: 750,
        GAP_COEFFICIENT: 0.6,
        GRAVITY: 0.6,
        INITIAL_JUMP_VELOCITY: 12,
        INVERT_FADE_DURATION: 12000,
        INVERT_DISTANCE: 700,
        MAX_BLINK_COUNT: 3,
        MAX_CLOUDS: 6,
        MAX_OBSTACLE_LENGTH: 3,
        MAX_OBSTACLE_DUPLICATION: 2,
        MAX_SPEED: 13,
        MIN_JUMP_HEIGHT: 35,
        MOBILE_SPEED_COEFFICIENT: 1.2,
        RESOURCE_TEMPLATE_ID: 'audio-resources',
        SPEED: 6,
        SPEED_DROP_COEFFICIENT: 3
    };

    /**
     * Default dimensions.
     * @enum {string}
     */
    Runner.defaultDimensions = {
        WIDTH: DEFAULT_WIDTH,
        HEIGHT: 150
    };

    /**
     * CSS class names.
     * @enum {string}
     */
    Runner.classes = {
        CANVAS: 'runner-canvas',
        CONTAINER: 'runner-container',
        CRASHED: 'crashed',
        ICON: 'icon-offline',
        INVERTED: 'inverted',
        SNACKBAR: 'snackbar',
        SNACKBAR_SHOW: 'snackbar-show',
        TOUCH_CONTROLLER: 'controller'
    };

    /**
     * Sprite definition layout of the spritesheet.
     * @enum {Object}
     */
    Runner.spriteDefinition = {
        LDPI: {
            CACTUS_LARGE: {
                x: 332,
                y: 2
            },
            CACTUS_SMALL: {
                x: 228,
                y: 2
            },
            CLOUD: {
                x: 86,
                y: 2
            },
            HORIZON: {
                x: 2,
                y: 54
            },
            MOON: {
                x: 484,
                y: 2
            },
            PTERODACTYL: {
                x: 134,
                y: 2
            },
            RESTART: {
                x: 2,
                y: 2
            },
            TEXT_SPRITE: {
                x: 655,
                y: 2
            },
            TREX: {
                x: 848,
                y: 2
            },
            STAR: {
                x: 645,
                y: 2
            }
        },
        HDPI: {
            CACTUS_LARGE: {
                x: 652,
                y: 2
            },
            CACTUS_SMALL: {
                x: 446,
                y: 2
            },
            CLOUD: {
                x: 166,
                y: 2
            },
            HORIZON: {
                x: 2,
                y: 104
            },
            MOON: {
                x: 954,
                y: 2
            },
            PTERODACTYL: {
                x: 260,
                y: 2
            },
            RESTART: {
                x: 2,
                y: 2
            },
            TEXT_SPRITE: {
                x: 1294,
                y: 2
            },
            TREX: {
                x: 1678,
                y: 2
            },
            STAR: {
                x: 1276,
                y: 2
            }
        }
    };

    /**
     * Sound FX. Reference to the ID of the audio tag on interstitial page.
     * @enum {string}
     */
    Runner.sounds = {
        BUTTON_PRESS: 'offline-sound-press',
        HIT: 'offline-sound-hit',
        SCORE: 'offline-sound-reached'
    };

    /**
     * Key code mapping.
     * @enum {Object}
     */
    Runner.keycodes = {
        JUMP: {
            '38': 1,
            '32': 1
        },
        // Up, spacebar
        DUCK: {
            '40': 1
        },
        // Down
        RESTART: {
            '13': 1
        }// Enter
    };

    /**
     * Runner event names.
     * @enum {string}
     */
    Runner.events = {
        ANIM_END: 'webkitAnimationEnd',
        CLICK: 'click',
        KEYDOWN: 'keydown',
        KEYUP: 'keyup',
        MOUSEDOWN: 'mousedown',
        MOUSEUP: 'mouseup',
        RESIZE: 'resize',
        TOUCHEND: 'touchend',
        TOUCHSTART: 'touchstart',
        VISIBILITY: 'visibilitychange',
        BLUR: 'blur',
        FOCUS: 'focus',
        LOAD: 'load'
    };

    Runner.prototype = {
        /**
         * Whether the easter egg has been disabled. CrOS enterprise enrolled devices.
         * @return {boolean}
         */
        isDisabled: function() {
            // return loadTimeData && loadTimeData.valueExists('disabledEasterEgg');
            return false;
        },

        /**
         * For disabled instances, set up a snackbar with the disabled message.
         */
        setupDisabledRunner: function() {
            this.containerEl = document.createElement('div');
            this.containerEl.className = Runner.classes.SNACKBAR;
            this.containerEl.textContent = loadTimeData.getValue('disabledEasterEgg');
            this.outerContainerEl.appendChild(this.containerEl);

            // Show notification when the activation key is pressed.
            document.addEventListener(Runner.events.KEYDOWN, function(e) {
                if (Runner.keycodes.JUMP[e.keyCode]) {
                    this.containerEl.classList.add(Runner.classes.SNACKBAR_SHOW);
                    document.querySelector('.icon').classList.add('icon-disabled');
                }
            }
            .bind(this));
        },

        /**
         * Setting individual settings for debugging.
         * @param {string} setting
         * @param {*} value
         */
        updateConfigSetting: function(setting, value) {
            if (setting in this.config && value != undefined) {
                this.config[setting] = value;

                switch (setting) {
                case 'GRAVITY':
                case 'MIN_JUMP_HEIGHT':
                case 'SPEED_DROP_COEFFICIENT':
                    this.tRex.config[setting] = value;
                    break;
                case 'INITIAL_JUMP_VELOCITY':
                    this.tRex.setJumpVelocity(value);
                    break;
                case 'SPEED':
                    this.setSpeed(value);
                    break;
                }
            }
        },

        /**
         * Cache the appropriate image sprite from the page and get the sprite sheet
         * definition.
         */
        loadImages: function() {
            if (IS_HIDPI) {
                Runner.imageSprite = document.getElementById('offline-resources-2x');
                this.spriteDef = Runner.spriteDefinition.HDPI;
            } else {
                Runner.imageSprite = document.getElementById('offline-resources-1x');
                this.spriteDef = Runner.spriteDefinition.LDPI;
            }

            if (Runner.imageSprite.complete) {
                this.init();
            } else {
                // If the images are not yet loaded, add a listener.
                Runner.imageSprite.addEventListener(Runner.events.LOAD, this.init.bind(this));
            }
        },

        /**
         * Load and decode base 64 encoded sounds.
         */
        loadSounds: function() {
            if (!IS_IOS) {
                this.audioContext = new AudioContext();

                var resourceTemplate = document.getElementById(this.config.RESOURCE_TEMPLATE_ID).content;

                for (var sound in Runner.sounds) {
                    var soundSrc = resourceTemplate.getElementById(Runner.sounds[sound]).src;
                    soundSrc = soundSrc.substr(soundSrc.indexOf(',') + 1);
                    var buffer = decodeBase64ToArrayBuffer(soundSrc);

                    // Async, so no guarantee of order in array.
                    this.audioContext.decodeAudioData(buffer, function(index, audioData) {
                        this.soundFx[index] = audioData;
                    }
                    .bind(this, sound));
                }
            }
        },

        /**
         * Sets the game speed. Adjust the speed accordingly if on a smaller screen.
         * @param {number} opt_speed
         */
        setSpeed: function(opt_speed) {
            var speed = opt_speed || this.currentSpeed;

            // Reduce the speed on smaller mobile screens.
            if (this.dimensions.WIDTH < DEFAULT_WIDTH) {
                var mobileSpeed = speed * this.dimensions.WIDTH / DEFAULT_WIDTH * this.config.MOBILE_SPEED_COEFFICIENT;
                this.currentSpeed = mobileSpeed > speed ? speed : mobileSpeed;
            } else if (opt_speed) {
                this.currentSpeed = opt_speed;
            }
        },

        /**
         * Game initialiser.
         */
        init: function() {
            // Hide the static icon.
            document.querySelector('.' + Runner.classes.ICON).style.visibility = 'hidden';

            this.adjustDimensions();
            this.setSpeed();

            this.containerEl = document.createElement('div');
            this.containerEl.className = Runner.classes.CONTAINER;

            // Player canvas container.
            this.canvas = createCanvas(this.containerEl, this.dimensions.WIDTH, this.dimensions.HEIGHT, Runner.classes.PLAYER);

            this.canvasCtx = this.canvas.getContext('2d');
            this.canvasCtx.fillStyle = '#f7f7f7';
            this.canvasCtx.fill();
            Runner.updateCanvasScaling(this.canvas);

            // Horizon contains clouds, obstacles and the ground.
            this.horizon = new Horizon(this.canvas,this.spriteDef,this.dimensions,this.config.GAP_COEFFICIENT);

            // Distance meter
            this.distanceMeter = new DistanceMeter(this.canvas,this.spriteDef.TEXT_SPRITE,this.dimensions.WIDTH);

            // Draw t-rex
            this.tRex = new Trex(this.canvas,this.spriteDef.TREX);

            this.outerContainerEl.appendChild(this.containerEl);

            if (IS_MOBILE) {
                this.createTouchController();
            }

            this.startListening();
            this.update();

            window.addEventListener(Runner.events.RESIZE, this.debounceResize.bind(this));
        },

        /**
         * Create the touch controller. A div that covers whole screen.
         */
        createTouchController: function() {
            this.touchController = document.createElement('div');
            this.touchController.className = Runner.classes.TOUCH_CONTROLLER;
            this.outerContainerEl.appendChild(this.touchController);
        },

        /**
         * Debounce the resize event.
         */
        debounceResize: function() {
            if (!this.resizeTimerId_) {
                this.resizeTimerId_ = setInterval(this.adjustDimensions.bind(this), 250);
            }
        },

        /**
         * Adjust game space dimensions on resize.
         */
        adjustDimensions: function() {
            clearInterval(this.resizeTimerId_);
            this.resizeTimerId_ = null;

            var boxStyles = window.getComputedStyle(this.outerContainerEl);
            var padding = Number(boxStyles.paddingLeft.substr(0, boxStyles.paddingLeft.length - 2));

            this.dimensions.WIDTH = this.outerContainerEl.offsetWidth - padding * 2;

            // Redraw the elements back onto the canvas.
            if (this.canvas) {
                this.canvas.width = this.dimensions.WIDTH;
                this.canvas.height = this.dimensions.HEIGHT;

                Runner.updateCanvasScaling(this.canvas);

                this.distanceMeter.calcXPos(this.dimensions.WIDTH);
                this.clearCanvas();
                this.horizon.update(0, 0, true);
                this.tRex.update(0);

                // Outer container and distance meter.
                if (this.playing || this.crashed || this.paused) {
                    this.containerEl.style.width = this.dimensions.WIDTH + 'px';
                    this.containerEl.style.height = this.dimensions.HEIGHT + 'px';
                    this.distanceMeter.update(0, Math.ceil(this.distanceRan));
                    this.stop();
                } else {
                    this.tRex.draw(0, 0);
                }

                // Game over panel.
                if (this.crashed && this.gameOverPanel) {
                    this.gameOverPanel.updateDimensions(this.dimensions.WIDTH);
                    this.gameOverPanel.draw();
                }
            }
        },

        /**
         * Play the game intro.
         * Canvas container width expands out to the full width.
         */
        playIntro: function() {
            if (!this.activated && !this.crashed) {
                this.playingIntro = true;
                this.tRex.playingIntro = true;

                // CSS animation definition.
                var keyframes = '@-webkit-keyframes intro { ' + 'from { width:' + Trex.config.WIDTH + 'px }' + 'to { width: ' + this.dimensions.WIDTH + 'px }' + '}';

                // create a style sheet to put the keyframe rule in 
                // and then place the style sheet in the html head    
                var sheet = document.createElement('style');
                sheet.innerHTML = keyframes;
                document.head.appendChild(sheet);

                this.containerEl.addEventListener(Runner.events.ANIM_END, this.startGame.bind(this));

                this.containerEl.style.webkitAnimation = 'intro .4s ease-out 1 both';
                this.containerEl.style.width = this.dimensions.WIDTH + 'px';

                // if (this.touchController) {
                //     this.outerContainerEl.appendChild(this.touchController);
                // }
                this.playing = true;
                this.activated = true;
            } else if (this.crashed) {
                this.restart();
            }
        },

        /**
         * Update the game status to started.
         */
        startGame: function() {
            this.runningTime = 0;
            this.playingIntro = false;
            this.tRex.playingIntro = false;
            this.containerEl.style.webkitAnimation = '';
            this.playCount++;

            // Handle tabbing off the page. Pause the current game.
            document.addEventListener(Runner.events.VISIBILITY, this.onVisibilityChange.bind(this));

            window.addEventListener(Runner.events.BLUR, this.onVisibilityChange.bind(this));
            window.addEventListener(Runner.events.FOCUS, this.onVisibilityChange.bind(this));
        },

        clearCanvas: function() {
            this.canvasCtx.clearRect(0, 0, this.dimensions.WIDTH, this.dimensions.HEIGHT);
        },

        /**
         * Update the game frame and schedules the next one.
         */
        update: function() {
            this.updatePending = false;

            var now = getTimeStamp();
            var deltaTime = now - (this.time || now);
            this.time = now;

            if (this.playing) {
                this.clearCanvas();

                if (this.tRex.jumping) {
                    this.tRex.updateJump(deltaTime);
                }

                this.runningTime += deltaTime;
                var hasObstacles = this.runningTime > this.config.CLEAR_TIME;

                // First jump triggers the intro.
                if (this.tRex.jumpCount == 1 && !this.playingIntro) {
                    this.playIntro();
                }

                // The horizon doesn't move until the intro is over.
                if (this.playingIntro) {
                    this.horizon.update(0, this.currentSpeed, hasObstacles);
                } else {
                    deltaTime = !this.activated ? 0 : deltaTime;
                    this.horizon.update(deltaTime, this.currentSpeed, hasObstacles, this.inverted);
                }

                // Check for collisions.
                var collision = hasObstacles && checkForCollision(this.horizon.obstacles[0], this.tRex);

                if (!collision) {
                    this.distanceRan += this.currentSpeed * deltaTime / this.msPerFrame;

                    if (this.currentSpeed < this.config.MAX_SPEED) {
                        this.currentSpeed += this.config.ACCELERATION;
                    }
                } else {
                    this.gameOver();
                }

                var playAchievementSound = this.distanceMeter.update(deltaTime, Math.ceil(this.distanceRan));

                if (playAchievementSound) {
                    this.playSound(this.soundFx.SCORE);
                }

                // Night mode.
                if (this.invertTimer > this.config.INVERT_FADE_DURATION) {
                    this.invertTimer = 0;
                    this.invertTrigger = false;
                    this.invert();
                } else if (this.invertTimer) {
                    this.invertTimer += deltaTime;
                } else {
                    var actualDistance = this.distanceMeter.getActualDistance(Math.ceil(this.distanceRan));

                    if (actualDistance > 0) {
                        this.invertTrigger = !(actualDistance % this.config.INVERT_DISTANCE);

                        if (this.invertTrigger && this.invertTimer === 0) {
                            this.invertTimer += deltaTime;
                            this.invert();
                        }
                    }
                }
            }

            if (this.playing || (!this.activated && this.tRex.blinkCount < Runner.config.MAX_BLINK_COUNT)) {
                this.tRex.update(deltaTime);
                this.scheduleNextUpdate();
            }
        },

        /**
         * Event handler.
         */
        handleEvent: function(e) {
            //console.log(e);
            return (function(evtType, events) {
                switch (evtType) {
                case events.KEYDOWN:
                case events.TOUCHSTART:
                case events.MOUSEDOWN:
                    this.onKeyDown(e);
                    break;
                case events.KEYUP:
                case events.TOUCHEND:
                case events.MOUSEUP:
                    this.onKeyUp(e);
                    break;
                }
            }
            .bind(this))(e.type, Runner.events);
        },

        /**
         * Bind relevant key / mouse / touch listeners.
         */
        startListening: function() {
            // Keys.
            document.addEventListener(Runner.events.KEYDOWN, this);
            document.addEventListener(Runner.events.KEYUP, this);
            if (IS_MOBILE) {
                // Mobile only touch devices.
                //this.touchController.addEventListener(Runner.events.TOUCHSTART, this);
                //this.touchController.addEventListener(Runner.events.TOUCHEND, this);
                this.containerEl.addEventListener(Runner.events.TOUCHSTART, this);
            } else {
                // Mouse.
                document.addEventListener(Runner.events.MOUSEDOWN, this);
                document.addEventListener(Runner.events.MOUSEUP, this);
            }
        },

        /**
         * Remove all listeners.
         */
        stopListening: function() {
            document.removeEventListener(Runner.events.KEYDOWN, this);
            document.removeEventListener(Runner.events.KEYUP, this);

            if (IS_MOBILE) {
                this.touchController.removeEventListener(Runner.events.TOUCHSTART, this);
                this.touchController.removeEventListener(Runner.events.TOUCHEND, this);
                this.containerEl.removeEventListener(Runner.events.TOUCHSTART, this);
            } else {
                document.removeEventListener(Runner.events.MOUSEDOWN, this);
                document.removeEventListener(Runner.events.MOUSEUP, this);
            }
        },

        /**
         * Process keydown.
         * @param {Event} e
         */
        onKeyDown: function(e) {
            console.log(e);
            // Prevent native page scrolling whilst tapping on mobile.
            if (IS_MOBILE && this.playing) {//e.preventDefault();
            }

            if (true) {
                if (!this.crashed && (Runner.keycodes.JUMP[e.keyCode] || e.type == Runner.events.TOUCHSTART)) {
                    if (!this.playing) {
                        this.loadSounds();
                        this.playing = true;
                        this.update();
                        if (window.errorPageController) {
                            errorPageController.trackEasterEgg();
                        }
                    }
                    //  Play sound effect and jump on starting the game for the first time.
                    if (!this.tRex.jumping && !this.tRex.ducking) {
                        this.playSound(this.soundFx.BUTTON_PRESS);
                        this.tRex.startJump(this.currentSpeed);
                    }
                }

                if (this.crashed && e.type == Runner.events.TOUCHSTART && e.currentTarget == this.containerEl) {
                    this.restart();
                }
            }

            if (this.playing && !this.crashed && Runner.keycodes.DUCK[e.keyCode]) {
                //e.preventDefault();
                if (this.tRex.jumping) {
                    // Speed drop, activated only when jump key is not pressed.
                    this.tRex.setSpeedDrop();
                } else if (!this.tRex.jumping && !this.tRex.ducking) {
                    // Duck.
                    this.tRex.setDuck(true);
                }
            }
        },

        /**
         * Process key up.
         * @param {Event} e
         */
        onKeyUp: function(e) {
            var keyCode = String(e.keyCode);
            var isjumpKey = Runner.keycodes.JUMP[keyCode] || e.type == Runner.events.TOUCHEND || e.type == Runner.events.MOUSEDOWN;

            if (this.isRunning() && isjumpKey) {
                this.tRex.endJump();
            } else if (Runner.keycodes.DUCK[keyCode]) {
                this.tRex.speedDrop = false;
                this.tRex.setDuck(false);
            } else if (this.crashed) {
                // Check that enough time has elapsed before allowing jump key to restart.
                var deltaTime = getTimeStamp() - this.time;

                if (Runner.keycodes.RESTART[keyCode] || this.isLeftClickOnCanvas(e) || (deltaTime >= this.config.GAMEOVER_CLEAR_TIME && Runner.keycodes.JUMP[keyCode])) {
                    this.restart();
                }
            } else if (this.paused && isjumpKey) {
                // Reset the jump state
                this.tRex.reset();
                this.play();
            }
        },

        /**
         * Returns whether the event was a left click on canvas.
         * On Windows right click is registered as a click.
         * @param {Event} e
         * @return {boolean}
         */
        isLeftClickOnCanvas: function(e) {
            return e.button != null && e.button < 2 && e.type == Runner.events.MOUSEUP;
        },

        /**
         * RequestAnimationFrame wrapper.
         */
        scheduleNextUpdate: function() {
            if (!this.updatePending) {
                this.updatePending = true;
                this.raqId = requestAnimationFrame(this.update.bind(this));
            }
        },

        /**
         * Whether the game is running.
         * @return {boolean}
         */
        isRunning: function() {
            return !!this.raqId;
        },

        /**
         * Game over state.
         */
        gameOver: function() {
            if (hzwd) {
                this.playSound(this.soundFx.HIT);
                vibrate(200);

                this.stop();
                this.crashed = true;
                this.distanceMeter.acheivement = false;

                this.tRex.update(100, Trex.status.CRASHED);

                // Game over panel.
                if (!this.gameOverPanel) {
                    this.gameOverPanel = new GameOverPanel(this.canvas,this.spriteDef.TEXT_SPRITE,this.spriteDef.RESTART,this.dimensions);
                } else {
                    this.gameOverPanel.draw();
                }
                // Update the high score.
                if (this.distanceRan > this.highestScore) {
                    this.highestScore = Math.ceil(this.distanceRan);
                    this.distanceMeter.setHighScore(this.highestScore);
                    var HISCORE = Math.round(this.highestScore * 0.025);
                    if (HISCORE > 500) {
                        document.getElementById("savebtn").style = "text-align:center;";
                        window['HISCORE'] = HISCORE;
                    }
                }

                // Reset the time clock.
                this.time = getTimeStamp();
            }
        },

        stop: function() {
            this.playing = false;
            this.paused = true;
            cancelAnimationFrame(this.raqId);
            this.raqId = 0;
        },

        play: function() {
            if (!this.crashed) {
                this.playing = true;
                this.paused = false;
                this.tRex.update(0, Trex.status.RUNNING);
                this.time = getTimeStamp();
                this.update();
            }
        },

        restart: function() {
            if (!this.raqId) {
                this.playCount++;
                window['PLAYCOUNT'] = this.playCount;
                this.runningTime = 0;
                this.playing = true;
                this.crashed = false;
                this.distanceRan = 0;
                this.setSpeed(this.config.SPEED);
                this.time = getTimeStamp();
                this.containerEl.classList.remove(Runner.classes.CRASHED);
                this.clearCanvas();
                this.distanceMeter.reset(this.highestScore);
                this.horizon.reset();
                this.tRex.reset();
                this.playSound(this.soundFx.BUTTON_PRESS);
                this.invert(true);
                this.update();
            }
        },

        /**
         * Pause the game if the tab is not in focus.
         */
        onVisibilityChange: function(e) {
            if (document.hidden || document.webkitHidden || e.type == 'blur' || document.visibilityState != 'visible') {
                this.stop();
            } else if (!this.crashed) {
                this.tRex.reset();
                this.play();
            }
        },
        /**
         * Play a sound.
         * @param {SoundBuffer} soundBuffer
         */
        playSound: function(soundBuffer) {
            if (soundBuffer) {
                var sourceNode = this.audioContext.createBufferSource();
                sourceNode.buffer = soundBuffer;
                sourceNode.connect(this.audioContext.destination);
                sourceNode.start(0);
            }
        },

        /**
         * Inverts the current page / canvas colors.
         * @param {boolean} Whether to reset colors.
         */
        invert: function(reset) {
            var hzimax = 2;
            if (reset) {
                for (var hzi = 1; hzi <= hzimax; hzi++) {
                    var classVal = document.getElementById("hzin" + hzi.toString()).getAttribute("class");
                    classVal = classVal.replace(/ inverted/g, "");
                    document.getElementById("hzin" + hzi.toString()).setAttribute("class", classVal);
                }
                document.body.classList.toggle(Runner.classes.INVERTED, false);
                this.invertTimer = 0;
                this.inverted = false;
            } else {
                for (var hzi = 1; hzi <= hzimax; hzi++) {
                    var classVal = document.getElementById("hzin" + hzi.toString()).getAttribute("class");
                    classVal = classVal.replace(/ inverted/g, "");
                    if (this.invertTrigger) {
                        classVal = classVal.concat(" inverted");
                    } else {
                        console.log("switch off the inverted");
                    }
                    document.getElementById("hzin" + hzi.toString()).setAttribute("class", classVal);
                }

                this.inverted = document.body.classList.toggle(Runner.classes.INVERTED, this.invertTrigger);
            }
        }
    };

    /**
     * Updates the canvas size taking into
     * account the backing store pixel ratio and
     * the device pixel ratio.
     *
     * See article by Paul Lewis:
     * http://www.html5rocks.com/en/tutorials/canvas/hidpi/
     *
     * @param {HTMLCanvasElement} canvas
     * @param {number} opt_width
     * @param {number} opt_height
     * @return {boolean} Whether the canvas was scaled.
     */
    Runner.updateCanvasScaling = function(canvas, opt_width, opt_height) {
        var context = canvas.getContext('2d');

        // Query the various pixel ratios
        var devicePixelRatio = Math.floor(window.devicePixelRatio) || 1;
        var backingStoreRatio = Math.floor(context.webkitBackingStorePixelRatio) || 1;
        var ratio = devicePixelRatio / backingStoreRatio;

        // Upscale the canvas if the two ratios don't match
        if (devicePixelRatio !== backingStoreRatio) {
            var oldWidth = opt_width || canvas.width;
            var oldHeight = opt_height || canvas.height;

            canvas.width = oldWidth * ratio;
            canvas.height = oldHeight * ratio;

            canvas.style.width = oldWidth + 'px';
            canvas.style.height = oldHeight + 'px';

            // Scale the context to counter the fact that we've manually scaled
            // our canvas element.
            context.scale(ratio, ratio);
            return true;
        } else if (devicePixelRatio == 1) {
            // Reset the canvas width / height. Fixes scaling bug when the page is
            // zoomed and the devicePixelRatio changes accordingly.
            canvas.style.width = canvas.width + 'px';
            canvas.style.height = canvas.height + 'px';
        }
        return false;
    }
    ;

    /**
     * Get random number.
     * @param {number} min
     * @param {number} max
     * @param {number}
     */
    function getRandomNum(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Vibrate on mobile devices.
     * @param {number} duration Duration of the vibration in milliseconds.
     */
    function vibrate(duration) {
        if (IS_MOBILE && window.navigator.vibrate) {
            window.navigator.vibrate(duration);
        }
    }

    /**
     * Create canvas element.
     * @param {HTMLElement} container Element to append canvas to.
     * @param {number} width
     * @param {number} height
     * @param {string} opt_classname
     * @return {HTMLCanvasElement}
     */
    function createCanvas(container, width, height, opt_classname) {
        var canvas = document.createElement('canvas');
        canvas.className = opt_classname ? Runner.classes.CANVAS + ' ' + opt_classname : Runner.classes.CANVAS;
        canvas.width = width;
        canvas.height = height;
        container.appendChild(canvas);

        return canvas;
    }

    /**
     * Decodes the base 64 audio to ArrayBuffer used by Web Audio.
     * @param {string} base64String
     */
    function decodeBase64ToArrayBuffer(base64String) {
        var len = (base64String.length / 4) * 3;
        var str = atob(base64String);
        var arrayBuffer = new ArrayBuffer(len);
        var bytes = new Uint8Array(arrayBuffer);

        for (var i = 0; i < len; i++) {
            bytes[i] = str.charCodeAt(i);
        }
        return bytes.buffer;
    }

    /**
     * Return the current timestamp.
     * @return {number}
     */
    function getTimeStamp() {
        return IS_IOS ? new Date().getTime() : performance.now();
    }

    //******************************************************************************

    /**
     * Game over panel.
     * @param {!HTMLCanvasElement} canvas
     * @param {Object} textImgPos
     * @param {Object} restartImgPos
     * @param {!Object} dimensions Canvas dimensions.
     * @constructor
     */
    function GameOverPanel(canvas, textImgPos, restartImgPos, dimensions) {
        this.canvas = canvas;
        this.canvasCtx = canvas.getContext('2d');
        this.canvasDimensions = dimensions;
        this.textImgPos = textImgPos;
        this.restartImgPos = restartImgPos;
        this.draw();
    }
    ;
    /**
     * Dimensions used in the panel.
     * @enum {number}
     */
    GameOverPanel.dimensions = {
        TEXT_X: 0,
        TEXT_Y: 13,
        TEXT_WIDTH: 191,
        TEXT_HEIGHT: 11,
        RESTART_WIDTH: 36,
        RESTART_HEIGHT: 32
    };

    GameOverPanel.prototype = {
        /**
         * Update the panel dimensions.
         * @param {number} width New canvas width.
         * @param {number} opt_height Optional new canvas height.
         */
        updateDimensions: function(width, opt_height) {
            this.canvasDimensions.WIDTH = width;
            if (opt_height) {
                this.canvasDimensions.HEIGHT = opt_height;
            }
        },

        /**
         * Draw the panel.
         */
        draw: function() {
            var dimensions = GameOverPanel.dimensions;

            var centerX = this.canvasDimensions.WIDTH / 2;

            // Game over text.
            var textSourceX = dimensions.TEXT_X;
            var textSourceY = dimensions.TEXT_Y;
            var textSourceWidth = dimensions.TEXT_WIDTH;
            var textSourceHeight = dimensions.TEXT_HEIGHT;

            var textTargetX = Math.round(centerX - (dimensions.TEXT_WIDTH / 2));
            var textTargetY = Math.round((this.canvasDimensions.HEIGHT - 25) / 3);
            var textTargetWidth = dimensions.TEXT_WIDTH;
            var textTargetHeight = dimensions.TEXT_HEIGHT;

            var restartSourceWidth = dimensions.RESTART_WIDTH;
            var restartSourceHeight = dimensions.RESTART_HEIGHT;
            var restartTargetX = centerX - (dimensions.RESTART_WIDTH / 2);
            var restartTargetY = this.canvasDimensions.HEIGHT / 2;

            if (IS_HIDPI) {
                textSourceY *= 2;
                textSourceX *= 2;
                textSourceWidth *= 2;
                textSourceHeight *= 2;
                restartSourceWidth *= 2;
                restartSourceHeight *= 2;
            }

            textSourceX += this.textImgPos.x;
            textSourceY += this.textImgPos.y;

            // Game over text from sprite.
            this.canvasCtx.drawImage(Runner.imageSprite, textSourceX, textSourceY, textSourceWidth, textSourceHeight, textTargetX, textTargetY, textTargetWidth, textTargetHeight);

            // Restart button.
            this.canvasCtx.drawImage(Runner.imageSprite, this.restartImgPos.x, this.restartImgPos.y, restartSourceWidth, restartSourceHeight, restartTargetX, restartTargetY, dimensions.RESTART_WIDTH, dimensions.RESTART_HEIGHT);

        }
    };

    //******************************************************************************

    /**
     * Check for a collision.
     * @param {!Obstacle} obstacle
     * @param {!Trex} tRex T-rex object.
     * @param {HTMLCanvasContext} opt_canvasCtx Optional canvas context for drawing
     *    collision boxes.
     * @return {Array<CollisionBox>}
     */
    function checkForCollision(obstacle, tRex, opt_canvasCtx) {
        var obstacleBoxXPos = Runner.defaultDimensions.WIDTH + obstacle.xPos;

        // Adjustments are made to the bounding box as there is a 1 pixel white
        // border around the t-rex and obstacles.
        var tRexBox = new CollisionBox(tRex.xPos + 1,tRex.yPos + 1,tRex.config.WIDTH - 2,tRex.config.HEIGHT - 2);

        var obstacleBox = new CollisionBox(obstacle.xPos + 1,obstacle.yPos + 1,obstacle.typeConfig.width * obstacle.size - 2,obstacle.typeConfig.height - 2);

        // Debug outer box
        if (opt_canvasCtx) {
            drawCollisionBoxes(opt_canvasCtx, tRexBox, obstacleBox);
        }

        // Simple outer bounds check.
        if (boxCompare(tRexBox, obstacleBox)) {
            var collisionBoxes = obstacle.collisionBoxes;
            var tRexCollisionBoxes = tRex.ducking ? Trex.collisionBoxes.DUCKING : Trex.collisionBoxes.RUNNING;

            // Detailed axis aligned box check.
            for (var t = 0; t < tRexCollisionBoxes.length; t++) {
                for (var i = 0; i < collisionBoxes.length; i++) {
                    // Adjust the box to actual positions.
                    var adjTrexBox = createAdjustedCollisionBox(tRexCollisionBoxes[t], tRexBox);
                    var adjObstacleBox = createAdjustedCollisionBox(collisionBoxes[i], obstacleBox);
                    var crashed = boxCompare(adjTrexBox, adjObstacleBox);

                    // Draw boxes for debug.
                    if (opt_canvasCtx) {
                        drawCollisionBoxes(opt_canvasCtx, adjTrexBox, adjObstacleBox);
                    }

                    if (crashed) {
                        return [adjTrexBox, adjObstacleBox];
                    }
                }
            }
        }
        return false;
    }
    ;
    /**
     * Adjust the collision box.
     * @param {!CollisionBox} box The original box.
     * @param {!CollisionBox} adjustment Adjustment box.
     * @return {CollisionBox} The adjusted collision box object.
     */
    function createAdjustedCollisionBox(box, adjustment) {
        return new CollisionBox(box.x + adjustment.x,box.y + adjustment.y,box.width,box.height);
    }
    ;
    /**
     * Draw the collision boxes for debug.
     */
    function drawCollisionBoxes(canvasCtx, tRexBox, obstacleBox) {
        canvasCtx.save();
        canvasCtx.strokeStyle = '#f00';
        canvasCtx.strokeRect(tRexBox.x, tRexBox.y, tRexBox.width, tRexBox.height);

        canvasCtx.strokeStyle = '#0f0';
        canvasCtx.strokeRect(obstacleBox.x, obstacleBox.y, obstacleBox.width, obstacleBox.height);
        canvasCtx.restore();
    }
    ;
    /**
     * Compare two collision boxes for a collision.
     * @param {CollisionBox} tRexBox
     * @param {CollisionBox} obstacleBox
     * @return {boolean} Whether the boxes intersected.
     */
    function boxCompare(tRexBox, obstacleBox) {
        var crashed = false;
        var tRexBoxX = tRexBox.x;
        var tRexBoxY = tRexBox.y;

        var obstacleBoxX = obstacleBox.x;
        var obstacleBoxY = obstacleBox.y;

        // Axis-Aligned Bounding Box method.
        if (tRexBox.x < obstacleBoxX + obstacleBox.width && tRexBox.x + tRexBox.width > obstacleBoxX && tRexBox.y < obstacleBox.y + obstacleBox.height && tRexBox.height + tRexBox.y > obstacleBox.y) {
            crashed = true;
        }

        return crashed;
    }
    ;
    //******************************************************************************

    /**
     * Collision box object.
     * @param {number} x X position.
     * @param {number} y Y Position.
     * @param {number} w Width.
     * @param {number} h Height.
     */
    function CollisionBox(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
    }
    ;
    //******************************************************************************

    /**
     * Obstacle.
     * @param {HTMLCanvasCtx} canvasCtx
     * @param {Obstacle.type} type
     * @param {Object} spritePos Obstacle position in sprite.
     * @param {Object} dimensions
     * @param {number} gapCoefficient Mutipler in determining the gap.
     * @param {number} speed
     * @param {number} opt_xOffset
     */
    function Obstacle(canvasCtx, type, spriteImgPos, dimensions, gapCoefficient, speed, opt_xOffset) {

        this.canvasCtx = canvasCtx;
        this.spritePos = spriteImgPos;
        this.typeConfig = type;
        this.gapCoefficient = gapCoefficient;
        this.size = getRandomNum(1, Obstacle.MAX_OBSTACLE_LENGTH);
        this.dimensions = dimensions;
        this.remove = false;
        this.xPos = dimensions.WIDTH + (opt_xOffset || 0);
        this.yPos = 0;
        this.width = 0;
        this.collisionBoxes = [];
        this.gap = 0;
        this.speedOffset = 0;

        // For animated obstacles.
        this.currentFrame = 0;
        this.timer = 0;

        this.init(speed);
    }
    ;
    /**
     * Coefficient for calculating the maximum gap.
     * @const
     */
    Obstacle.MAX_GAP_COEFFICIENT = 1.5;

    /**
     * Maximum obstacle grouping count.
     * @const
     */
    Obstacle.MAX_OBSTACLE_LENGTH = 3,

    Obstacle.prototype = {
        /**
             * Initialise the DOM for the obstacle.
             * @param {number} speed
             */
        init: function(speed) {
            this.cloneCollisionBoxes();

            // Only allow sizing if we're at the right speed.
            if (this.size > 1 && this.typeConfig.multipleSpeed > speed) {
                this.size = 1;
            }

            this.width = this.typeConfig.width * this.size;

            // Check if obstacle can be positioned at various heights.
            if (Array.isArray(this.typeConfig.yPos)) {
                var yPosConfig = IS_MOBILE ? this.typeConfig.yPosMobile : this.typeConfig.yPos;
                this.yPos = yPosConfig[getRandomNum(0, yPosConfig.length - 1)];
            } else {
                this.yPos = this.typeConfig.yPos;
            }

            this.draw();

            // Make collision box adjustments,
            // Central box is adjusted to the size as one box.
            //      ____        ______        ________
            //    _|   |-|    _|     |-|    _|       |-|
            //   | |<->| |   | |<--->| |   | |<----->| |
            //   | | 1 | |   | |  2  | |   | |   3   | |
            //   |_|___|_|   |_|_____|_|   |_|_______|_|
            //
            if (this.size > 1) {
                this.collisionBoxes[1].width = this.width - this.collisionBoxes[0].width - this.collisionBoxes[2].width;
                this.collisionBoxes[2].x = this.width - this.collisionBoxes[2].width;
            }

            // For obstacles that go at a different speed from the horizon.
            if (this.typeConfig.speedOffset) {
                this.speedOffset = Math.random() > 0.5 ? this.typeConfig.speedOffset : -this.typeConfig.speedOffset;
            }

            this.gap = this.getGap(this.gapCoefficient, speed);
        },

        /**
             * Draw and crop based on size.
             */
        draw: function() {
            var sourceWidth = this.typeConfig.width;
            var sourceHeight = this.typeConfig.height;

            if (IS_HIDPI) {
                sourceWidth = sourceWidth * 2;
                sourceHeight = sourceHeight * 2;
            }

            // X position in sprite.
            var sourceX = (sourceWidth * this.size) * (0.5 * (this.size - 1)) + this.spritePos.x;

            // Animation frames.
            if (this.currentFrame > 0) {
                sourceX += sourceWidth * this.currentFrame;
            }

            this.canvasCtx.drawImage(Runner.imageSprite, sourceX, this.spritePos.y, sourceWidth * this.size, sourceHeight, this.xPos, this.yPos, this.typeConfig.width * this.size, this.typeConfig.height);
        },

        /**
             * Obstacle frame update.
             * @param {number} deltaTime
             * @param {number} speed
             */
        update: function(deltaTime, speed) {
            if (!this.remove) {
                if (this.typeConfig.speedOffset) {
                    speed += this.speedOffset;
                }
                this.xPos -= Math.floor((speed * FPS / 1000) * deltaTime);

                // Update frame
                if (this.typeConfig.numFrames) {
                    this.timer += deltaTime;
                    if (this.timer >= this.typeConfig.frameRate) {
                        this.currentFrame = this.currentFrame == this.typeConfig.numFrames - 1 ? 0 : this.currentFrame + 1;
                        this.timer = 0;
                    }
                }
                this.draw();

                if (!this.isVisible()) {
                    this.remove = true;
                }
            }
        },

        /**
             * Calculate a random gap size.
             * - Minimum gap gets wider as speed increses
             * @param {number} gapCoefficient
             * @param {number} speed
             * @return {number} The gap size.
             */
        getGap: function(gapCoefficient, speed) {
            var minGap = Math.round(this.width * speed + this.typeConfig.minGap * gapCoefficient);
            var maxGap = Math.round(minGap * Obstacle.MAX_GAP_COEFFICIENT);
            return getRandomNum(minGap, maxGap);
        },

        /**
             * Check if obstacle is visible.
             * @return {boolean} Whether the obstacle is in the game area.
             */
        isVisible: function() {
            return this.xPos + this.width > 0;
        },

        /**
             * Make a copy of the collision boxes, since these will change based on
             * obstacle type and size.
             */
        cloneCollisionBoxes: function() {
            var collisionBoxes = this.typeConfig.collisionBoxes;

            for (var i = collisionBoxes.length - 1; i >= 0; i--) {
                this.collisionBoxes[i] = new CollisionBox(collisionBoxes[i].x,collisionBoxes[i].y,collisionBoxes[i].width,collisionBoxes[i].height);
            }
        }
    };

    /**
     * Obstacle definitions.
     * minGap: minimum pixel space betweeen obstacles.
     * multipleSpeed: Speed at which multiples are allowed.
     * speedOffset: speed faster / slower than the horizon.
     * minSpeed: Minimum speed which the obstacle can make an appearance.
     */
    Obstacle.types = [{
        type: 'CACTUS_SMALL',
        width: 17,
        height: 35,
        yPos: 105,
        multipleSpeed: 4,
        minGap: 120,
        minSpeed: 0,
        collisionBoxes: [new CollisionBox(0,7,5,27), new CollisionBox(4,0,6,34), new CollisionBox(10,4,7,14)]
    }, {
        type: 'CACTUS_LARGE',
        width: 25,
        height: 50,
        yPos: 90,
        multipleSpeed: 7,
        minGap: 120,
        minSpeed: 0,
        collisionBoxes: [new CollisionBox(0,12,7,38), new CollisionBox(8,0,7,49), new CollisionBox(13,10,10,38)]
    }, {
        type: 'PTERODACTYL',
        width: 46,
        height: 40,
        yPos: [100, 75, 50],
        // Variable height.
        yPosMobile: [100, 50],
        // Variable height mobile.
        multipleSpeed: 999,
        minSpeed: 8.5,
        minGap: 150,
        collisionBoxes: [new CollisionBox(15,15,16,5), new CollisionBox(18,21,24,6), new CollisionBox(2,14,4,3), new CollisionBox(6,10,4,7), new CollisionBox(10,8,6,9)],
        numFrames: 2,
        frameRate: 1000 / 6,
        speedOffset: .8
    }];

    //******************************************************************************
    /**
     * T-rex game character.
     * @param {HTMLCanvas} canvas
     * @param {Object} spritePos Positioning within image sprite.
     * @constructor
     */
    function Trex(canvas, spritePos) {
        this.canvas = canvas;
        this.canvasCtx = canvas.getContext('2d');
        this.spritePos = spritePos;
        this.xPos = 0;
        this.yPos = 0;
        // Position when on the ground.
        this.groundYPos = 0;
        this.currentFrame = 0;
        this.currentAnimFrames = [];
        this.blinkDelay = 0;
        this.blinkCount = 0;
        this.animStartTime = 0;
        this.timer = 0;
        this.msPerFrame = 1000 / FPS;
        this.config = Trex.config;
        // Current status.
        this.status = Trex.status.WAITING;

        this.jumping = false;
        this.ducking = false;
        this.jumpVelocity = 0;
        this.reachedMinHeight = false;
        this.speedDrop = false;
        this.jumpCount = 0;
        this.jumpspotX = 0;

        this.init();
    }
    ;
    /**
     * T-rex player config.
     * @enum {number}
     */
    Trex.config = {
        DROP_VELOCITY: -5,
        GRAVITY: 0.6,
        HEIGHT: 47,
        HEIGHT_DUCK: 25,
        INIITAL_JUMP_VELOCITY: -10,
        INTRO_DURATION: 1500,
        MAX_JUMP_HEIGHT: 30,
        MIN_JUMP_HEIGHT: 30,
        SPEED_DROP_COEFFICIENT: 3,
        SPRITE_WIDTH: 262,
        START_X_POS: 50,
        WIDTH: 44,
        WIDTH_DUCK: 59
    };

    /**
     * Used in collision detection.
     * @type {Array<CollisionBox>}
     */
    Trex.collisionBoxes = {
        DUCKING: [new CollisionBox(1,18,55,25)],
        RUNNING: [new CollisionBox(22,0,17,16), new CollisionBox(1,18,30,9), new CollisionBox(10,35,14,8), new CollisionBox(1,24,29,5), new CollisionBox(5,30,21,4), new CollisionBox(9,34,15,4)]
    };

    /**
     * Animation states.
     * @enum {string}
     */
    Trex.status = {
        CRASHED: 'CRASHED',
        DUCKING: 'DUCKING',
        JUMPING: 'JUMPING',
        RUNNING: 'RUNNING',
        WAITING: 'WAITING'
    };

    /**
     * Blinking coefficient.
     * @const
     */
    Trex.BLINK_TIMING = 7000;

    /**
     * Animation config for different states.
     * @enum {Object}
     */
    Trex.animFrames = {
        WAITING: {
            frames: [44, 0],
            msPerFrame: 1000 / 3
        },
        RUNNING: {
            frames: [88, 132],
            msPerFrame: 1000 / 12
        },
        CRASHED: {
            frames: [220],
            msPerFrame: 1000 / 60
        },
        JUMPING: {
            frames: [0],
            msPerFrame: 1000 / 60
        },
        DUCKING: {
            frames: [264, 323],
            msPerFrame: 1000 / 8
        }
    };

    Trex.prototype = {
        /**
         * T-rex player initaliser.
         * Sets the t-rex to blink at random intervals.
         */
        init: function() {
            this.groundYPos = Runner.defaultDimensions.HEIGHT - this.config.HEIGHT - Runner.config.BOTTOM_PAD;
            this.yPos = this.groundYPos;
            this.minJumpHeight = this.groundYPos - this.config.MIN_JUMP_HEIGHT;

            this.draw(0, 0);
            this.update(0, Trex.status.WAITING);
        },

        /**
         * Setter for the jump velocity.
         * The approriate drop velocity is also set.
         */
        setJumpVelocity: function(setting) {
            this.config.INIITAL_JUMP_VELOCITY = -setting;
            this.config.DROP_VELOCITY = -setting / 2;
        },

        /**
         * Set the animation status.
         * @param {!number} deltaTime
         * @param {Trex.status} status Optional status to switch to.
         */
        update: function(deltaTime, opt_status) {
            this.timer += deltaTime;

            // Update the status.
            if (opt_status) {
                this.status = opt_status;
                this.currentFrame = 0;
                this.msPerFrame = Trex.animFrames[opt_status].msPerFrame;
                this.currentAnimFrames = Trex.animFrames[opt_status].frames;

                if (opt_status == Trex.status.WAITING) {
                    this.animStartTime = getTimeStamp();
                    this.setBlinkDelay();
                }
            }

            // Game intro animation, T-rex moves in from the left.
            if (this.playingIntro && this.xPos < this.config.START_X_POS) {
                this.xPos += Math.round((this.config.START_X_POS / this.config.INTRO_DURATION) * deltaTime);
            }

            if (this.status == Trex.status.WAITING) {
                this.blink(getTimeStamp());
            } else {
                this.draw(this.currentAnimFrames[this.currentFrame], 0);
            }

            // Update the frame position.
            if (this.timer >= this.msPerFrame) {
                this.currentFrame = this.currentFrame == this.currentAnimFrames.length - 1 ? 0 : this.currentFrame + 1;
                this.timer = 0;
            }

            // Speed drop becomes duck if the down key is still being pressed.
            if (this.speedDrop && this.yPos == this.groundYPos) {
                this.speedDrop = false;
                this.setDuck(true);
            }
        },

        /**
         * Draw the t-rex to a particular position.
         * @param {number} x
         * @param {number} y
         */
        draw: function(x, y) {
            var sourceX = x;
            var sourceY = y;
            var sourceWidth = this.ducking && this.status != Trex.status.CRASHED ? this.config.WIDTH_DUCK : this.config.WIDTH;
            var sourceHeight = this.config.HEIGHT;

            if (IS_HIDPI) {
                sourceX *= 2;
                sourceY *= 2;
                sourceWidth *= 2;
                sourceHeight *= 2;
            }

            // Adjustments for sprite sheet position.
            sourceX += this.spritePos.x;
            sourceY += this.spritePos.y;

            // Ducking.
            if (this.ducking && this.status != Trex.status.CRASHED) {
                this.canvasCtx.drawImage(Runner.imageSprite, sourceX, sourceY, sourceWidth, sourceHeight, this.xPos, this.yPos, this.config.WIDTH_DUCK, this.config.HEIGHT);
            } else {
                // Crashed whilst ducking. Trex is standing up so needs adjustment.
                if (this.ducking && this.status == Trex.status.CRASHED) {
                    this.xPos++;
                }
                // Standing / running
                this.canvasCtx.drawImage(Runner.imageSprite, sourceX, sourceY, sourceWidth, sourceHeight, this.xPos, this.yPos, this.config.WIDTH, this.config.HEIGHT);
            }
        },

        /**
         * Sets a random time for the blink to happen.
         */
        setBlinkDelay: function() {
            this.blinkDelay = Math.ceil(Math.random() * Trex.BLINK_TIMING);
        },

        /**
         * Make t-rex blink at random intervals.
         * @param {number} time Current time in milliseconds.
         */
        blink: function(time) {
            var deltaTime = time - this.animStartTime;

            if (deltaTime >= this.blinkDelay) {
                this.draw(this.currentAnimFrames[this.currentFrame], 0);

                if (this.currentFrame == 1) {
                    // Set new random delay to blink.
                    this.setBlinkDelay();
                    this.animStartTime = time;
                    this.blinkCount++;
                }
            }
        },

        /**
         * Initialise a jump.
         * @param {number} speed
         */
        startJump: function(speed) {
            if (!this.jumping) {
                this.update(0, Trex.status.JUMPING);
                // Tweak the jump velocity based on the speed.
                this.jumpVelocity = this.config.INIITAL_JUMP_VELOCITY - (speed / 10);
                this.jumping = true;
                this.reachedMinHeight = false;
                this.speedDrop = false;
            }
        },

        /**
         * Jump is complete, falling down.
         */
        endJump: function() {
            if (this.reachedMinHeight && this.jumpVelocity < this.config.DROP_VELOCITY) {
                this.jumpVelocity = this.config.DROP_VELOCITY;
            }
        },

        /**
         * Update frame for a jump.
         * @param {number} deltaTime
         * @param {number} speed
         */
        updateJump: function(deltaTime, speed) {
            var msPerFrame = Trex.animFrames[this.status].msPerFrame;
            var framesElapsed = deltaTime / msPerFrame;

            // Speed drop makes Trex fall faster.
            if (this.speedDrop) {
                this.yPos += Math.round(this.jumpVelocity * this.config.SPEED_DROP_COEFFICIENT * framesElapsed);
            } else {
                this.yPos += Math.round(this.jumpVelocity * framesElapsed);
            }

            this.jumpVelocity += this.config.GRAVITY * framesElapsed;

            // Minimum height has been reached.
            if (this.yPos < this.minJumpHeight || this.speedDrop) {
                this.reachedMinHeight = true;
            }

            // Reached max height
            if (this.yPos < this.config.MAX_JUMP_HEIGHT || this.speedDrop) {
                this.endJump();
            }

            // Back down at ground level. Jump completed.
            if (this.yPos > this.groundYPos) {
                this.reset();
                this.jumpCount++;
            }

            this.update(deltaTime);
        },

        /**
         * Set the speed drop. Immediately cancels the current jump.
         */
        setSpeedDrop: function() {
            this.speedDrop = true;
            this.jumpVelocity = 1;
        },

        /**
         * @param {boolean} isDucking.
         */
        setDuck: function(isDucking) {
            if (isDucking && this.status != Trex.status.DUCKING) {
                this.update(0, Trex.status.DUCKING);
                this.ducking = true;
            } else if (this.status == Trex.status.DUCKING) {
                this.update(0, Trex.status.RUNNING);
                this.ducking = false;
            }
        },

        /**
         * Reset the t-rex to running at start of game.
         */
        reset: function() {
            this.yPos = this.groundYPos;
            this.jumpVelocity = 0;
            this.jumping = false;
            this.ducking = false;
            this.update(0, Trex.status.RUNNING);
            this.midair = false;
            this.speedDrop = false;
            this.jumpCount = 0;
        }
    };

    //******************************************************************************

    /**
     * Handles displaying the distance meter.
     * @param {!HTMLCanvasElement} canvas
     * @param {Object} spritePos Image position in sprite.
     * @param {number} canvasWidth
     * @constructor
     */
    function DistanceMeter(canvas, spritePos, canvasWidth) {
        this.canvas = canvas;
        this.canvasCtx = canvas.getContext('2d');
        this.image = Runner.imageSprite;
        this.spritePos = spritePos;
        this.x = 0;
        this.y = 5;

        this.currentDistance = 0;
        this.maxScore = 0;
        this.highScore = 0;
        this.container = null;

        this.digits = [];
        this.acheivement = false;
        this.defaultString = '';
        this.flashTimer = 0;
        this.flashIterations = 0;
        this.invertTrigger = false;

        this.config = DistanceMeter.config;
        this.maxScoreUnits = this.config.MAX_DISTANCE_UNITS;
        this.init(canvasWidth);
    }
    ;
    /**
     * @enum {number}
     */
    DistanceMeter.dimensions = {
        WIDTH: 10,
        HEIGHT: 13,
        DEST_WIDTH: 11
    };

    /**
     * Y positioning of the digits in the sprite sheet.
     * X position is always 0.
     * @type {Array<number>}
     */
    DistanceMeter.yPos = [0, 13, 27, 40, 53, 67, 80, 93, 107, 120];

    /**
     * Distance meter config.
     * @enum {number}
     */
    DistanceMeter.config = {
        // Number of digits.
        MAX_DISTANCE_UNITS: 5,

        // Distance that causes achievement animation.
        ACHIEVEMENT_DISTANCE: 100,

        // Used for conversion from pixel distance to a scaled unit.
        COEFFICIENT: 0.025,

        // Flash duration in milliseconds.
        FLASH_DURATION: 1000 / 4,

        // Flash iterations for achievement animation.
        FLASH_ITERATIONS: 3
    };

    DistanceMeter.prototype = {
        /**
         * Initialise the distance meter to '00000'.
         * @param {number} width Canvas width in px.
         */
        init: function(width) {
            var maxDistanceStr = '';

            this.calcXPos(width);
            this.maxScore = this.maxScoreUnits;
            for (var i = 0; i < this.maxScoreUnits; i++) {
                this.draw(i, 0);
                this.defaultString += '0';
                maxDistanceStr += '9';
            }

            this.maxScore = parseInt(maxDistanceStr);
        },

        /**
         * Calculate the xPos in the canvas.
         * @param {number} canvasWidth
         */
        calcXPos: function(canvasWidth) {
            this.x = canvasWidth - (DistanceMeter.dimensions.DEST_WIDTH * (this.maxScoreUnits + 1));
        },

        /**
         * Draw a digit to canvas.
         * @param {number} digitPos Position of the digit.
         * @param {number} value Digit value 0-9.
         * @param {boolean} opt_highScore Whether drawing the high score.
         */
        draw: function(digitPos, value, opt_highScore) {
            var sourceWidth = DistanceMeter.dimensions.WIDTH;
            var sourceHeight = DistanceMeter.dimensions.HEIGHT;
            var sourceX = DistanceMeter.dimensions.WIDTH * value;
            var sourceY = 0;

            var targetX = digitPos * DistanceMeter.dimensions.DEST_WIDTH;
            var targetY = this.y;
            var targetWidth = DistanceMeter.dimensions.WIDTH;
            var targetHeight = DistanceMeter.dimensions.HEIGHT;

            // For high DPI we 2x source values.
            if (IS_HIDPI) {
                sourceWidth *= 2;
                sourceHeight *= 2;
                sourceX *= 2;
            }

            sourceX += this.spritePos.x;
            sourceY += this.spritePos.y;

            this.canvasCtx.save();

            if (opt_highScore) {
                // Left of the current score.
                var highScoreX = this.x - (this.maxScoreUnits * 2) * DistanceMeter.dimensions.WIDTH;
                this.canvasCtx.translate(highScoreX, this.y);
            } else {
                this.canvasCtx.translate(this.x, this.y);
            }

            this.canvasCtx.drawImage(this.image, sourceX, sourceY, sourceWidth, sourceHeight, targetX, targetY, targetWidth, targetHeight);

            this.canvasCtx.restore();
        },

        /**
         * Covert pixel distance to a 'real' distance.
         * @param {number} distance Pixel distance ran.
         * @return {number} The 'real' distance ran.
         */
        getActualDistance: function(distance) {
            return distance ? Math.round(distance * this.config.COEFFICIENT) : 0;
        },

        /**
         * Update the distance meter.
         * @param {number} distance
         * @param {number} deltaTime
         * @return {boolean} Whether the acheivement sound fx should be played.
         */
        update: function(deltaTime, distance) {
            var paint = true;
            var playSound = false;

            if (!this.acheivement) {
                distance = this.getActualDistance(distance);
                // Score has gone beyond the initial digit count.
                if (distance > this.maxScore && this.maxScoreUnits == this.config.MAX_DISTANCE_UNITS) {
                    this.maxScoreUnits++;
                    this.maxScore = parseInt(this.maxScore + '9');
                } else {
                    this.distance = 0;
                }

                if (distance > 0) {
                    // Acheivement unlocked
                    if (distance % this.config.ACHIEVEMENT_DISTANCE == 0) {
                        // Flash score and play sound.
                        this.acheivement = true;
                        this.flashTimer = 0;
                        playSound = true;
                    }

                    // Create a string representation of the distance with leading 0.
                    var distanceStr = (this.defaultString + distance).substr(-this.maxScoreUnits);
                    this.digits = distanceStr.split('');
                } else {
                    this.digits = this.defaultString.split('');
                }
            } else {
                // Control flashing of the score on reaching acheivement.
                if (this.flashIterations <= this.config.FLASH_ITERATIONS) {
                    this.flashTimer += deltaTime;

                    if (this.flashTimer < this.config.FLASH_DURATION) {
                        paint = false;
                    } else if (this.flashTimer > this.config.FLASH_DURATION * 2) {
                        this.flashTimer = 0;
                        this.flashIterations++;
                    }
                } else {
                    this.acheivement = false;
                    this.flashIterations = 0;
                    this.flashTimer = 0;
                }
            }

            // Draw the digits if not flashing.
            if (paint) {
                for (var i = this.digits.length - 1; i >= 0; i--) {
                    this.draw(i, parseInt(this.digits[i]));
                }
            }

            this.drawHighScore();
            return playSound;
        },

        /**
         * Draw the high score.
         */
        drawHighScore: function() {
            this.canvasCtx.save();
            this.canvasCtx.globalAlpha = .8;
            for (var i = this.highScore.length - 1; i >= 0; i--) {
                this.draw(i, parseInt(this.highScore[i], 10), true);
            }
            this.canvasCtx.restore();
        },

        /**
         * Set the highscore as a array string.
         * Position of char in the sprite: H - 10, I - 11.
         * @param {number} distance Distance ran in pixels.
         */
        setHighScore: function(distance) {
            distance = this.getActualDistance(distance);
            var highScoreStr = (this.defaultString + distance).substr(-this.maxScoreUnits);

            this.highScore = ['10', '11', ''].concat(highScoreStr.split(''));
        },

        /**
         * Reset the distance meter back to '00000'.
         */
        reset: function() {
            this.update(0);
            this.acheivement = false;
        }
    };

    //******************************************************************************

    /**
     * Cloud background item.
     * Similar to an obstacle object but without collision boxes.
     * @param {HTMLCanvasElement} canvas Canvas element.
     * @param {Object} spritePos Position of image in sprite.
     * @param {number} containerWidth
     */
    function Cloud(canvas, spritePos, containerWidth) {
        this.canvas = canvas;
        this.canvasCtx = this.canvas.getContext('2d');
        this.spritePos = spritePos;
        this.containerWidth = containerWidth;
        this.xPos = containerWidth;
        this.yPos = 0;
        this.remove = false;
        this.cloudGap = getRandomNum(Cloud.config.MIN_CLOUD_GAP, Cloud.config.MAX_CLOUD_GAP);

        this.init();
    }
    ;
    /**
     * Cloud object config.
     * @enum {number}
     */
    Cloud.config = {
        HEIGHT: 14,
        MAX_CLOUD_GAP: 400,
        MAX_SKY_LEVEL: 30,
        MIN_CLOUD_GAP: 100,
        MIN_SKY_LEVEL: 71,
        WIDTH: 46
    };

    Cloud.prototype = {
        /**
         * Initialise the cloud. Sets the Cloud height.
         */
        init: function() {
            this.yPos = getRandomNum(Cloud.config.MAX_SKY_LEVEL, Cloud.config.MIN_SKY_LEVEL);
            this.draw();
        },

        /**
         * Draw the cloud.
         */
        draw: function() {
            this.canvasCtx.save();
            var sourceWidth = Cloud.config.WIDTH;
            var sourceHeight = Cloud.config.HEIGHT;

            if (IS_HIDPI) {
                sourceWidth = sourceWidth * 2;
                sourceHeight = sourceHeight * 2;
            }

            this.canvasCtx.drawImage(Runner.imageSprite, this.spritePos.x, this.spritePos.y, sourceWidth, sourceHeight, this.xPos, this.yPos, Cloud.config.WIDTH, Cloud.config.HEIGHT);

            this.canvasCtx.restore();
        },

        /**
         * Update the cloud position.
         * @param {number} speed
         */
        update: function(speed) {
            if (!this.remove) {
                this.xPos -= Math.ceil(speed);
                this.draw();

                // Mark as removeable if no longer in the canvas.
                if (!this.isVisible()) {
                    this.remove = true;
                }
            }
        },

        /**
         * Check if the cloud is visible on the stage.
         * @return {boolean}
         */
        isVisible: function() {
            return this.xPos + Cloud.config.WIDTH > 0;
        }
    };

    //******************************************************************************

    /**
     * Nightmode shows a moon and stars on the horizon.
     */
    function NightMode(canvas, spritePos, containerWidth) {
        this.spritePos = spritePos;
        this.canvas = canvas;
        this.canvasCtx = canvas.getContext('2d');
        this.xPos = containerWidth - 50;
        this.yPos = 30;
        this.currentPhase = 0;
        this.opacity = 0;
        this.containerWidth = containerWidth;
        this.stars = [];
        this.drawStars = false;
        this.placeStars();
    }
    ;
    /**
     * @enum {number}
     */
    NightMode.config = {
        FADE_SPEED: 0.035,
        HEIGHT: 40,
        MOON_SPEED: 0.25,
        NUM_STARS: 2,
        STAR_SIZE: 9,
        STAR_SPEED: 0.3,
        STAR_MAX_Y: 70,
        WIDTH: 20
    };

    NightMode.phases = [140, 120, 100, 60, 40, 20, 0];

    NightMode.prototype = {
        /**
         * Update moving moon, changing phases.
         * @param {boolean} activated Whether night mode is activated.
         * @param {number} delta
         */
        update: function(activated, delta) {
            // Moon phase.
            if (activated && this.opacity == 0) {
                this.currentPhase++;

                if (this.currentPhase >= NightMode.phases.length) {
                    this.currentPhase = 0;
                }
            }

            // Fade in / out.
            if (activated && (this.opacity < 1 || this.opacity == 0)) {
                this.opacity += NightMode.config.FADE_SPEED;
            } else if (this.opacity > 0) {
                this.opacity -= NightMode.config.FADE_SPEED;
            }

            // Set moon positioning.
            if (this.opacity > 0) {
                this.xPos = this.updateXPos(this.xPos, NightMode.config.MOON_SPEED);

                // Update stars.
                if (this.drawStars) {
                    for (var i = 0; i < NightMode.config.NUM_STARS; i++) {
                        this.stars[i].x = this.updateXPos(this.stars[i].x, NightMode.config.STAR_SPEED);
                    }
                }
                this.draw();
            } else {
                this.opacity = 0;
                this.placeStars();
            }
            this.drawStars = true;
        },

        updateXPos: function(currentPos, speed) {
            if (currentPos < -NightMode.config.WIDTH) {
                currentPos = this.containerWidth;
            } else {
                currentPos -= speed;
            }
            return currentPos;
        },

        draw: function() {
            var moonSourceWidth = this.currentPhase == 3 ? NightMode.config.WIDTH * 2 : NightMode.config.WIDTH;
            var moonSourceHeight = NightMode.config.HEIGHT;
            var moonSourceX = this.spritePos.x + NightMode.phases[this.currentPhase];
            var moonOutputWidth = moonSourceWidth;
            var starSize = NightMode.config.STAR_SIZE;
            var starSourceX = Runner.spriteDefinition.LDPI.STAR.x;

            if (IS_HIDPI) {
                moonSourceWidth *= 2;
                moonSourceHeight *= 2;
                moonSourceX = this.spritePos.x + (NightMode.phases[this.currentPhase] * 2);
                starSize *= 2;
                starSourceX = Runner.spriteDefinition.HDPI.STAR.x;
            }

            this.canvasCtx.save();
            this.canvasCtx.globalAlpha = this.opacity;

            // Stars.
            if (this.drawStars) {
                for (var i = 0; i < NightMode.config.NUM_STARS; i++) {
                    this.canvasCtx.drawImage(Runner.imageSprite, starSourceX, this.stars[i].sourceY, starSize, starSize, Math.round(this.stars[i].x), this.stars[i].y, NightMode.config.STAR_SIZE, NightMode.config.STAR_SIZE);
                }
            }

            // Moon.
            this.canvasCtx.drawImage(Runner.imageSprite, moonSourceX, this.spritePos.y, moonSourceWidth, moonSourceHeight, Math.round(this.xPos), this.yPos, moonOutputWidth, NightMode.config.HEIGHT);

            this.canvasCtx.globalAlpha = 1;
            this.canvasCtx.restore();
        },

        // Do star placement.
        placeStars: function() {
            var segmentSize = Math.round(this.containerWidth / NightMode.config.NUM_STARS);

            for (var i = 0; i < NightMode.config.NUM_STARS; i++) {
                this.stars[i] = {};
                this.stars[i].x = getRandomNum(segmentSize * i, segmentSize * (i + 1));
                this.stars[i].y = getRandomNum(0, NightMode.config.STAR_MAX_Y);

                if (IS_HIDPI) {
                    this.stars[i].sourceY = Runner.spriteDefinition.HDPI.STAR.y + NightMode.config.STAR_SIZE * 2 * i;
                } else {
                    this.stars[i].sourceY = Runner.spriteDefinition.LDPI.STAR.y + NightMode.config.STAR_SIZE * i;
                }
            }
        },

        reset: function() {
            this.currentPhase = 0;
            this.opacity = 0;
            this.update(false);
        }

    };

    //******************************************************************************

    /**
     * Horizon Line.
     * Consists of two connecting lines. Randomly assigns a flat / bumpy horizon.
     * @param {HTMLCanvasElement} canvas
     * @param {Object} spritePos Horizon position in sprite.
     * @constructor
     */
    function HorizonLine(canvas, spritePos) {
        this.spritePos = spritePos;
        this.canvas = canvas;
        this.canvasCtx = canvas.getContext('2d');
        this.sourceDimensions = {};
        this.dimensions = HorizonLine.dimensions;
        this.sourceXPos = [this.spritePos.x, this.spritePos.x + this.dimensions.WIDTH];
        this.xPos = [];
        this.yPos = 0;
        this.bumpThreshold = 0.5;

        this.setSourceDimensions();
        this.draw();
    }
    ;
    /**
     * Horizon line dimensions.
     * @enum {number}
     */
    HorizonLine.dimensions = {
        WIDTH: 600,
        HEIGHT: 12,
        YPOS: 127
    };

    HorizonLine.prototype = {
        /**
         * Set the source dimensions of the horizon line.
         */
        setSourceDimensions: function() {

            for (var dimension in HorizonLine.dimensions) {
                if (IS_HIDPI) {
                    if (dimension != 'YPOS') {
                        this.sourceDimensions[dimension] = HorizonLine.dimensions[dimension] * 2;
                    }
                } else {
                    this.sourceDimensions[dimension] = HorizonLine.dimensions[dimension];
                }
                this.dimensions[dimension] = HorizonLine.dimensions[dimension];
            }

            this.xPos = [0, HorizonLine.dimensions.WIDTH];
            this.yPos = HorizonLine.dimensions.YPOS;
        },

        /**
         * Return the crop x position of a type.
         */
        getRandomType: function() {
            return Math.random() > this.bumpThreshold ? this.dimensions.WIDTH : 0;
        },

        /**
         * Draw the horizon line.
         */
        draw: function() {
            this.canvasCtx.drawImage(Runner.imageSprite, this.sourceXPos[0], this.spritePos.y, this.sourceDimensions.WIDTH, this.sourceDimensions.HEIGHT, this.xPos[0], this.yPos, this.dimensions.WIDTH, this.dimensions.HEIGHT);

            this.canvasCtx.drawImage(Runner.imageSprite, this.sourceXPos[1], this.spritePos.y, this.sourceDimensions.WIDTH, this.sourceDimensions.HEIGHT, this.xPos[1], this.yPos, this.dimensions.WIDTH, this.dimensions.HEIGHT);
        },

        /**
         * Update the x position of an indivdual piece of the line.
         * @param {number} pos Line position.
         * @param {number} increment
         */
        updateXPos: function(pos, increment) {
            var line1 = pos;
            var line2 = pos == 0 ? 1 : 0;

            this.xPos[line1] -= increment;
            this.xPos[line2] = this.xPos[line1] + this.dimensions.WIDTH;

            if (this.xPos[line1] <= -this.dimensions.WIDTH) {
                this.xPos[line1] += this.dimensions.WIDTH * 2;
                this.xPos[line2] = this.xPos[line1] - this.dimensions.WIDTH;
                this.sourceXPos[line1] = this.getRandomType() + this.spritePos.x;
            }
        },

        /**
         * Update the horizon line.
         * @param {number} deltaTime
         * @param {number} speed
         */
        update: function(deltaTime, speed) {
            var increment = Math.floor(speed * (FPS / 1000) * deltaTime);

            if (this.xPos[0] <= 0) {
                this.updateXPos(0, increment);
            } else {
                this.updateXPos(1, increment);
            }
            this.draw();
        },

        /**
         * Reset horizon to the starting position.
         */
        reset: function() {
            this.xPos[0] = 0;
            this.xPos[1] = HorizonLine.dimensions.WIDTH;
        }
    };

    //******************************************************************************

    /**
     * Horizon background class.
     * @param {HTMLCanvasElement} canvas
     * @param {Object} spritePos Sprite positioning.
     * @param {Object} dimensions Canvas dimensions.
     * @param {number} gapCoefficient
     * @constructor
     */
    function Horizon(canvas, spritePos, dimensions, gapCoefficient) {
        this.canvas = canvas;
        this.canvasCtx = this.canvas.getContext('2d');
        this.config = Horizon.config;
        this.dimensions = dimensions;
        this.gapCoefficient = gapCoefficient;
        this.obstacles = [];
        this.obstacleHistory = [];
        this.horizonOffsets = [0, 0];
        this.cloudFrequency = this.config.CLOUD_FREQUENCY;
        this.spritePos = spritePos;
        this.nightMode = null;

        // Cloud
        this.clouds = [];
        this.cloudSpeed = this.config.BG_CLOUD_SPEED;

        // Horizon
        this.horizonLine = null;
        this.init();
    }
    ;
    /**
     * Horizon config.
     * @enum {number}
     */
    Horizon.config = {
        BG_CLOUD_SPEED: 0.2,
        BUMPY_THRESHOLD: .3,
        CLOUD_FREQUENCY: .5,
        HORIZON_HEIGHT: 16,
        MAX_CLOUDS: 6
    };

    Horizon.prototype = {
        /**
         * Initialise the horizon. Just add the line and a cloud. No obstacles.
         */
        init: function() {
            this.addCloud();
            this.horizonLine = new HorizonLine(this.canvas,this.spritePos.HORIZON);
            this.nightMode = new NightMode(this.canvas,this.spritePos.MOON,this.dimensions.WIDTH);
        },

        /**
         * @param {number} deltaTime
         * @param {number} currentSpeed
         * @param {boolean} updateObstacles Used as an override to prevent
         *     the obstacles from being updated / added. This happens in the
         *     ease in section.
         * @param {boolean} showNightMode Night mode activated.
         */
        update: function(deltaTime, currentSpeed, updateObstacles, showNightMode) {
            this.runningTime += deltaTime;
            this.horizonLine.update(deltaTime, currentSpeed);
            this.nightMode.update(showNightMode);
            this.updateClouds(deltaTime, currentSpeed);

            if (updateObstacles) {
                this.updateObstacles(deltaTime, currentSpeed);
            }
        },

        /**
         * Update the cloud positions.
         * @param {number} deltaTime
         * @param {number} currentSpeed
         */
        updateClouds: function(deltaTime, speed) {
            var cloudSpeed = this.cloudSpeed / 1000 * deltaTime * speed;
            var numClouds = this.clouds.length;

            if (numClouds) {
                for (var i = numClouds - 1; i >= 0; i--) {
                    this.clouds[i].update(cloudSpeed);
                }

                var lastCloud = this.clouds[numClouds - 1];

                // Check for adding a new cloud.
                if (numClouds < this.config.MAX_CLOUDS && (this.dimensions.WIDTH - lastCloud.xPos) > lastCloud.cloudGap && this.cloudFrequency > Math.random()) {
                    this.addCloud();
                }

                // Remove expired clouds.
                this.clouds = this.clouds.filter(function(obj) {
                    return !obj.remove;
                });
            } else {
                this.addCloud();
            }
        },

        /**
         * Update the obstacle positions.
         * @param {number} deltaTime
         * @param {number} currentSpeed
         */
        updateObstacles: function(deltaTime, currentSpeed) {
            // Obstacles, move to Horizon layer.
            var updatedObstacles = this.obstacles.slice(0);

            for (var i = 0; i < this.obstacles.length; i++) {
                var obstacle = this.obstacles[i];
                obstacle.update(deltaTime, currentSpeed);

                // Clean up existing obstacles.
                if (obstacle.remove) {
                    updatedObstacles.shift();
                }
            }
            this.obstacles = updatedObstacles;

            if (this.obstacles.length > 0) {
                var lastObstacle = this.obstacles[this.obstacles.length - 1];

                if (lastObstacle && !lastObstacle.followingObstacleCreated && lastObstacle.isVisible() && (lastObstacle.xPos + lastObstacle.width + lastObstacle.gap) < this.dimensions.WIDTH) {
                    this.addNewObstacle(currentSpeed);
                    lastObstacle.followingObstacleCreated = true;
                }
            } else {
                // Create new obstacles.
                this.addNewObstacle(currentSpeed);
            }
        },

        removeFirstObstacle: function() {
            this.obstacles.shift();
        },

        /**
         * Add a new obstacle.
         * @param {number} currentSpeed
         */
        addNewObstacle: function(currentSpeed) {
            var obstacleTypeIndex = getRandomNum(0, Obstacle.types.length - 1);
            var obstacleType = Obstacle.types[obstacleTypeIndex];

            // Check for multiples of the same type of obstacle.
            // Also check obstacle is available at current speed.
            if (this.duplicateObstacleCheck(obstacleType.type) || currentSpeed < obstacleType.minSpeed) {
                this.addNewObstacle(currentSpeed);
            } else {
                var obstacleSpritePos = this.spritePos[obstacleType.type];

                this.obstacles.push(new Obstacle(this.canvasCtx,obstacleType,obstacleSpritePos,this.dimensions,this.gapCoefficient,currentSpeed,obstacleType.width));

                this.obstacleHistory.unshift(obstacleType.type);

                if (this.obstacleHistory.length > 1) {
                    this.obstacleHistory.splice(Runner.config.MAX_OBSTACLE_DUPLICATION);
                }
            }
        },

        /**
         * Returns whether the previous two obstacles are the same as the next one.
         * Maximum duplication is set in config value MAX_OBSTACLE_DUPLICATION.
         * @return {boolean}
         */
        duplicateObstacleCheck: function(nextObstacleType) {
            var duplicateCount = 0;

            for (var i = 0; i < this.obstacleHistory.length; i++) {
                duplicateCount = this.obstacleHistory[i] == nextObstacleType ? duplicateCount + 1 : 0;
            }
            return duplicateCount >= Runner.config.MAX_OBSTACLE_DUPLICATION;
        },

        /**
         * Reset the horizon layer.
         * Remove existing obstacles and reposition the horizon line.
         */
        reset: function() {
            this.obstacles = [];
            this.horizonLine.reset();
            this.nightMode.reset();
        },

        /**
         * Update the canvas width and scaling.
         * @param {number} width Canvas width.
         * @param {number} height Canvas height.
         */
        resize: function(width, height) {
            this.canvas.width = width;
            this.canvas.height = height;
        },

        /**
         * Add a new cloud to the horizon.
         */
        addCloud: function() {
            this.clouds.push(new Cloud(this.canvas,this.spritePos.CLOUD,this.dimensions.WIDTH));
        }
    };
}
)();

function hzswitchgO() {
    if (hzwd) {
        hzwd = false;
    } else {
        hzwd = true;
    }
}

function hzsetspeed() {
    Runner.instance_.setSpeed(document.getElementById("hzspeed").value);
}

function hzsetscore() {
    var hzsc = document.getElementById("hzscore").value;
    let hackScore = 0;
    Object.defineProperty(Runner.instance_, 'distanceRan', {
        get: ()=>hackScore,
        set: (value)=>hackScore = value + Math.floor(hzsc),
        configurable: true,
        enumerable: true,
    });
}

function hzsetskin(Keycode) {
    var srcVal;
    if (Keycode == 0) {
        srcVal = document.getElementById("hzskin").value;
        document.getElementById("offline-resources-1x").setAttribute("src", srcVal);
        return;
    }
    if (Keycode == 1) {
        srcVal = "data:image/png;base64,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";
        document.getElementById("offline-resources-1x").setAttribute("src", srcVal);
        return;
    }
    if (Keycode == 2) {
        srcVal = "data:image/png;base64,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";
        document.getElementById("offline-resources-1x").setAttribute("src", srcVal);
        return;
    }
    srcVal = "assets/default_100_percent/" + Keycode.toString() + "100-offline-sprite.png"
    document.getElementById("offline-resources-1x").setAttribute("src", srcVal);
    return;
}

function onDocumentLoad() {
    new Runner('.interstitial-wrapper');
}

document.addEventListener('DOMContentLoaded', onDocumentLoad);

var KeyboardEventup1 = {
    altKey: false,
    bubbles: true,
    cancelBubble: false,
    cancelable: true,
    charCode: 0,
    code: "ArrowUp",
    composed: true,
    ctrlKey: false,
    currentTarget: null,
    defaultPrevented: false,
    detail: 0,
    eventPhase: 0,
    isComposing: false,
    isTrusted: true,
    key: "ArrowUp",
    keyCode: 38,
    location: 0,
    metaKey: false,
    repeat: false,
    returnValue: true,
    shiftKey: false,
    type: "keydown"
}
  , KeyboardEventup2 = {
    altKey: false,
    bubbles: true,
    cancelBubble: false,
    cancelable: true,
    charCode: 0,
    code: "ArrowUp",
    composed: true,
    ctrlKey: false,
    currentTarget: null,
    defaultPrevented: false,
    detail: 0,
    eventPhase: 0,
    isComposing: false,
    isTrusted: true,
    key: "ArrowUp",
    keyCode: 38,
    location: 0,
    metaKey: false,
    repeat: false,
    returnValue: true,
    shiftKey: false,
    type: "keyup"
}
  , KeyboardEventdo1 = {
    altKey: false,
    bubbles: true,
    cancelBubble: false,
    cancelable: true,
    charCode: 0,
    code: "ArrowDown",
    composed: true,
    ctrlKey: false,
    currentTarget: null,
    defaultPrevented: false,
    detail: 0,
    eventPhase: 0,
    isComposing: false,
    isTrusted: true,
    key: "ArrowDown",
    keyCode: 40,
    location: 0,
    metaKey: false,
    repeat: false,
    returnValue: true,
    shiftKey: false,
    type: "keydown"
}
  , KeyboardEventdo2 = {
    altKey: false,
    bubbles: true,
    cancelBubble: false,
    cancelable: true,
    charCode: 0,
    code: "ArrowDown",
    composed: true,
    ctrlKey: false,
    currentTarget: null,
    defaultPrevented: false,
    detail: 0,
    eventPhase: 0,
    isComposing: false,
    isTrusted: true,
    key: "ArrowDown",
    keyCode: 40,
    location: 0,
    metaKey: false,
    repeat: false,
    returnValue: true,
    shiftKey: false,
    type: "keyup"
}
  , IS_IOS = /iPad|iPhone|iPod/.test(window.navigator.platform)
  , IS_MOBILE = /Android/.test(window.navigator.userAgent) || IS_IOS;

window.onload = function() {
    document.querySelector('#hzbtup').addEventListener('touchstart', function() {
        console.log("up-enter");
        Runner.instance_.onKeyDown(KeyboardEventup1);
    }, false);
    document.querySelector('#hzbtdo').addEventListener('touchstart', function() {
        console.log("do-enter");
        Runner.instance_.onKeyDown(KeyboardEventdo1);
    }, false);
    document.querySelector('#hzbtup').addEventListener('touchend', function() {
        console.log("up-leave");
        Runner.instance_.onKeyUp(KeyboardEventup2);
    }, false);
    document.querySelector('#hzbtdo').addEventListener('touchend', function() {
        console.log("do-leave");
        Runner.instance_.onKeyUp(KeyboardEventdo2);
    }, false);
}

$(document).ready(function() {
    $("#hzbtup").mousedown(function() {
        Runner.instance_.onKeyDown(KeyboardEventup1);
    });
    $("#hzbtup").mouseup(function() {
        Runner.instance_.onKeyUp(KeyboardEventup2);
    });
    $("#hzbtdo").mousedown(function() {
        Runner.instance_.onKeyDown(KeyboardEventdo1);
    });
    $("#hzbtdo").mouseup(function() {
        Runner.instance_.onKeyUp(KeyboardEventdo2);
    });
});
