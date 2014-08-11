/**
 * Created by Robert on 2014-08-08.
 */
var Joystick = Joystick || {};

var kLimitRate = 1.0 / 120.0;

var SimpleButton = cc.Node.extend({
    // Sprite
    _sprDefault: null,
    _sprActivated: null,
    _sprPressed: null,
    _sprDisabled: null,

    _isHoldable: false,
    _isToggleable: false,
    _isKeyboard: false,
    _isEnable: true,
    _keyCode: 0,

    _isActive: false,      // is Button Touched
    _isPressed: false,     // is Button Pressed
    _radius: 0,
    _radiusSq: 0,
    _type: null,

    ctor: function (size) {
        this._super();
        this.setContentSize(size);

        this._radius = size.width / 2;
        this._radiusSq = this._radius * this._radius;
    },

    onEnterTransitionDidFinish: function () {
        this._super();

        // Touch
        var touchListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded,
            onTouchCancelled: this.onTouchCancelled
        },this);

        touchListener.setSwallowTouches(true);
        cc.eventManager.addListener(touchListener, this);

        // Keyboard
        if (this._isKeyboard) {
            var keyListener = cc.EventListener.create({
                event: cc.EventListener.KEYBOARD,
                onKeyPressed: this.onKeyPressed,
                onKeyReleased: this.onKeyReleased
            },this);

            cc.eventManager.addListener(keyListener, this);
        }

        this.scheduleUpdate();
        if (!this._isEnabled) this._sprDefault.setVisible(false);

    },
    onTouchBegan: function (touch, event) {
        var target = event.getCurrentTarget();
        if (!target._isActive) {
            var loc = target.convertTouchToNodeSpace(touch);
            // Do a fast rect check before doing a circle hit check

            if (loc.x > -target._radius && loc.x < target._radius && loc.y > -target._radius && loc.y < target._radius) {
                var dSq = loc.x * loc.x + loc.y * loc.y;
                if (target._radiusSq > dSq) {
                    target.touchBegin();
                    return true;
                }
            }
        }
        return false;
    },
    touchBegin: function () {
        if (this._isActive) return;
        this._isActive = true;
        if (!this._isHoldable && !this._isToggleable) {
            this._isPressed = true;
            this.schedule(this.limiter, kLimitRate);
        }
        if (this._isHoldable) this._isPressed = true;
        if (this._isToggleable) this._isPressed = !this._isPressed;
    },
    touchEnd: function () {
        if (this._isActive) {
            if (this._isHoldable) {
                this._isPressed = false;
                this._isActive = false;
            }
            if (this._isToggleable) {
                this._isActive = false;
            }
        }
    },
    limiter: function (dt) {
        this._isActive = false;
        this._isPressed = false;
        this.unschedule(this.limiter);
    },
    onTouchMoved: function (touch, event) {
        var target = event.getCurrentTarget();

        if (target._isActive) {
            var loc = target.convertTouchToNodeSpace(touch);
            if (loc.x > -target._radius || loc.x < target._radius || loc.y > -target._radius || loc.y < target._radius) {
                var dSq = loc.x * loc.x + loc.y * loc.y;

                if (target._radiusSq > dSq) {
                    if (target.isHoldable) target._isPressed = true;
                }
                // out of range
                else {
                    if (target.isHoldable) target._isPressed = false;
                    target._isActive = false;
                }
            }
        }
    },
    onTouchEnded: function (touch, event) {
        var target = event.getCurrentTarget();
        target.touchEnd();
    },

    onTouchCancelled: function (touch, event) {
        var target = event.getCurrentTarget();
        target.onTouchEnded();
    },
    onKeyPressed: function (keycode, event) {
        var target = event.getCurrentTarget();
        if (keycode == target._keyCode && !target.isKeyInput) {
            target.isKeyInput = true;
            target.touchBegin();
        }
    },
    onKeyReleased: function (keycode, event) {
        var target = event.getCurrentTarget();
        if (keycode == target._keyCode) {
            target.isKeyInput = false;      // fix web continuing key pressed problem
            target.touchEnd();
        }
    },
    onExit: function () {
        this._super();
        cc.eventManager.removeListener(this);
    },
    setDefaultSprite: function (aSprite) {
        if (this._sprDefault) {
            this._sprDefault.removeFromParent(true);
        }

        this._sprDefault = aSprite;
        this.addChild(this._sprDefault, 0);

    },
    setActivetdSprite: function (aSprite) {
        if (this._sprActivated) {
            this._sprActivated.removeFromParent(true);
        }

        this._sprActivated = aSprite;
        this._sprActivated.setVisible(false);
        this.addChild(this._sprActivated, 1);

    },

    setPressSprite: function (aSprite) {
        if (this._sprPressed) {
            this._sprPressed.removeFromParent(true);
        }

        this._sprPressed = aSprite;
        this._sprPressed.setVisible(false);
        this.addChild(this._sprPressed, 2);


    },

    setDisabledSprite: function (aSprite) {
        if (this._sprDisabled) {
            this._sprDisabled.removeFromParent(true);
        }

        this._sprDisabled = aSprite;
        this._sprDisabled.setVisible(false);
        this.addChild(this._sprDisabled, 3);

    },

    update: function (delta) {
        if (this._isEnable) {
            if (this._sprDisabled) this._sprDisabled.setVisible(false);

            // button is active
            if (this._isActive) {
                this._sprDefault.setVisible(false);
                if (this._sprPressed) {
                    this._sprPressed.setVisible(true);
                }
            } else {
                this._sprPressed.setVisible(false);
                if (this._isPressed) {
                    this._sprActivated.setVisible(true);
                }
                else {
                    this._sprActivated.setVisible(false);
                    if (this._sprDefault) {
                        this._sprDefault.setVisible(true);
                    }
                }
            }
        }
        else {
            this._sprDefault.setVisible(false);
            if (this._sprDisabled) {
                this._sprDisabled.setVisible(true);
            }
        }
    },
    getIsPressed: function () {
        return this._isPressed;
    },

    // Holdable
    getIsHoldable: function () {
        return this._isHoldable;
    },
    setIsHoldable: function (bool) {
        this._isHoldable = bool;
    },

    // Toggleable
    getIsToggleable: function () {
        return this._isToggleable;
    },
    setIsToggleable: function (bool) {
        this._isToggleable = bool;
    },

    // Keyboard
    getIsKeyboard: function () {
        return this._isKeyboard;
    },
    setIsKeyboard: function (isKeyboard) {
        this._isKeyboard = isKeyboard;
    },

    // Enable
    getIsEnable: function () {
        return this._isEnable;
    },

    setIsEnable: function (isEnable) {
        this._isEnable = isEnable;
    },

    // Keycode
    getKeyCode: function () {
        return this._keyCode;
    },

    setKeyCode: function (keyCode) {
        this._keyCode = keyCode;
    }
});

