/**
 * Created by Robert on 2014-08-08.
 */

var Joystick = Joystick || {};

var SimpleJoystick = cc.Node.extend({
    // Sprite
    _sprBackground: null,
    _sprThumbSprite: null,

    _isDPad: false,
    _numberOfDirections: 8,

    _deadRadiusSq: 0,

    _joystickRadius: 0.0,
    _josystickRadiusSq: 0.0,

    _thumbRadius: 0.0,
    _thumbRadiusSq: 0.0,

    _stickPosition: cc.p(0, 0),
    _degree: 0.0,
    _velocity: cc.p(0, 0),
    _isAutoCenter: true,

    _isActive: false,
    _isKeyboard: false,
    _keys: [],


    ctor: function (size) {
        this._super();
        this.setContentSize(size);

        this.setJoystickRadius(size.width / 2);
        this.setThumbRadius(size.width / 2);
    },
    setJoystickRadius: function (radius) {
        this._joystickRadius = radius;
        this._josystickRadiusSq = radius * radius;
    },

    onEnterTransitionDidFinish: function () {
        this._super();

        if (this._isKeyboard) {
            var keyListener = cc.EventListener.create({
                event: cc.EventListener.KEYBOARD,
                onKeyPressed: this.onKeyPressed,
                onKeyReleased: this.onKeyReleased
            });

            cc.eventManager.addListener(keyListener, this);
        }
        else {
            var touchListener = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: this.onTouchBegan,
                onTouchMoved: this.onTouchMoved,
                onTouchEnded: this.onTouchEnded,
                onTouchCancelled: this.onTouchCancelled
            });
            touchListener.setSwallowTouches(true);
            cc.eventManager.addListener(touchListener, this);
        }

        this.scheduleUpdate();
    },

    onExit: function () {
        this._super();
        cc.eventManager.removeListener(this);
    },

    update: function (delta) {
        if (this._isKeyboard) {
            var pos = cc.p(0, 0);
            var check = false;
            if (this._keys[cc.KEY.left]) {
                pos.x -= this._joystickRadius;
                check = true;
            }
            if (this._keys[cc.KEY.right]) {
                pos.x += this._joystickRadius;
                check = true;
            }
            if (this._keys[cc.KEY.up]) {
                pos.y += this._joystickRadius;
                check = true;
            }
            if (this._keys[cc.KEY.down]) {
                pos.y -= this._joystickRadius;
                check = true;
            }
            if (check) {
                this.updateVelocity(cc.p(pos.x + this._stickPosition.x, pos.y + this._stickPosition.y));
            } else {
                this.updateVelocity(pos);
            }
        }
        if (this._thumbSprite) {
            this._thumbSprite.setPosition(this._stickPosition);
        }
    },
    onKeyPressed: function (keyCode, event) {
        var target = event.getCurrentTarget();
        target._keys[keyCode] = true;
    },
    onKeyReleased: function (keyCode, event) {
        var target = event.getCurrentTarget();
        target._keys[keyCode] = false;
    },

    updateVelocity: function (pos) {
        var dx = pos.x;
        var dy = pos.y;
        var dSq = dx * dx + dy * dy;

        // check D-Pad dead zone
        if (dSq < this._deadRadiusSq && this._isDPad) {
            this._velocity = cc.p(0, 0);
            this._degree = 0.0;
            this._stickPosition = pos;
            this._isActive = false;
            return;
        }
        else {
            this._isActive = true;
        }

        var angle = Math.atan2(dy, dx);

        if (this._isDPad) {
            var anglePerSector = cc.degreesToRadians(360 / this._numberOfDirections);
            angle = Math.round(angle / anglePerSector) * anglePerSector;
        }

        // out of range
        if (this._thumbRadiusSq < dSq || this._isDPad) {
            var cosAngle = Math.cos(angle);
            var sinAngle = Math.sin(angle);
            dx = cosAngle * this._thumbRadius;
            dy = sinAngle * this._thumbRadius;
        }

        this._velocity = cc.p(dx / this._thumbRadius, dy / this._thumbRadius);
        this._degree = cc.radiansToDegrees(angle);
        //if(this._degree < 0) this._degree += 360;
        this._stickPosition = cc.p(dx, dy);

    },
    setBackgroundSprite: function (aSprite) {
        if (this._backgroundSprite) {
            this._backgroundSprite.removeFromParent(true);
        }
        this._backgroundSprite = aSprite;
        this.addChild(this._backgroundSprite, 0);
    },
    setThumbSprite: function (aSprite) {
        if (this._thumbSprite) {
            this._thumbSprite.removeFromParent(true);
        }
        this._thumbSprite = aSprite;
        this.addChild(this._thumbSprite, 1);
    },
    onTouchBegan: function (touch, event) {
        var target = event.getCurrentTarget();
        var loc = target.convertTouchToNodeSpace(touch);

        // Do a fast rect check before doing a circle hit check
        if (loc.x > -target._baseRadius && loc.x < target._baseRadius && loc.y > -target._baseRadius && loc.y < target._baseRadius) {
            var dSq = loc.x * loc.x + loc.y * loc.y;
            if (target._baseRadiusSq > dSq) {
                target.updateVelocity(loc);
                return true;
            }
        }
        return false;
    },

    onTouchMoved: function (touch, event) {
        var target = event.getCurrentTarget();
        var loc = target.convertTouchToNodeSpace(touch);
        target.updateVelocity(loc);
    },

    onTouchEnded: function (touch, event) {
        var target = event.getCurrentTarget();
        var loc = cc.p(0, 0);
        if (!target._isAutoCenter) {
            loc = target.convertTouchToNodeSpace(touch);
        }
        target.updateVelocity(loc);
        target._isActive = false;
    },
    onTouchCancelled: function (touch, event) {
        this.onTouchEnded(touch, event);
    },

    setDeadRadius: function (radius) {
        this._deadRadiusSq = radius * radius;
    },
    setThumbRadius: function (radius) {
        this._thumbRadius = radius;
        this._thumbRadiusSq = radius * radius;
    },
    getIsDPad: function () {
        return this._isDPad;
    },

    setIsDPad: function (isDPad) {
        this._isDPad = isDPad;
    },
    getNumOfDirection: function () {
        return this._numberOfDirections;
    },
    setNumOfDirection: function (numberOfDirections) {
        this._numberOfDirections = numberOfDirections;
    },
    setIsKeyboard: function (isKeyboard) {
        this._isKeyboard = true;
    },
    getIsKeyboard: function () {
        return this._isKeyboard;
    }
});


