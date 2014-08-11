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

    _baseRadius: 0.0,
    _baseRadiusSq: 0.0,

    _thumbRadius: 0.0,
    _thumbRadiusSq: 0.0,

    _stickPosition: cc.p(0, 0),
    _degree: 0.0,
    _velocity: cc.p(0, 0),
    _isAutoCenter: true,

    _isActive: false,
    _isKeyboard: false,


    ctor: function (size) {
        this._super();
        this.setContentSize(size);

        this._baseRadius = size.width / 2;
        this._baseRadiusSq = this._baseRadius * this._baseRadius;

        this.setThumbRadius(this._baseRadius);
    },

    onEnterTransitionDidFinish: function () {
        this._super();

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

        if (this._isKeyboard) {
            var keyListener = cc.EventListener.create({
                event: cc.EventListener.KEYBOARD,
                onKeyPressed: this.onKeyPressed,
                onKeyReleased: this.onKeyReleased
            });

            cc.eventManager.addListener(keyListener, this);
        }

        this.scheduleUpdate();
    },

    onExit: function () {
        this._super();
        cc.eventManager.removeListener(this);
    },

    update: function (delta) {

        if (this._thumbSprite) {
            this._thumbSprite.setPosition(this._stickPosition);
        }
    },

    updateVelocity: function (pos) {
        var dx = pos.x;
        var dy = pos.y;
        var dSq = dx * dx + dy * dy;

        // check D-Pad dead zone
        if (dSq < this._deadRadiusSq) {
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
    }
});


