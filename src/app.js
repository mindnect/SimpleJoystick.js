var HelloWorldLayer = cc.Layer.extend({
    isMouseDown:false,
    helloImg:null,
    helloLabel:null,
    circle:null,
    sprite:null,

    ctor:function () {
        this._super();

        var buttonAttk = Joystick.createAttkButton();
        this.addChild(buttonAttk,1);

        var buttonDefense = Joystick.createDefenseButton();
        this.addChild(buttonDefense,1);

        var joystick = Joystick.createJoystick();
        this.addChild(joystick, 1);

        return true;
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});



Joystick.createJoystick = function () {
    var xOffset = 12;
    var yOffset = 12;


    var screenSize = cc.director.getWinSize();

    var size = cc.size(82, 82);
    var position = cc.p(
            cc.visibleRect.bottomLeft.x + (size.width / 2) + xOffset,
            cc.visibleRect.bottomLeft.y + (size.height / 2) + yOffset
    );

    cc.Sprite.create(res.Joystick_Thumb_png);

    var joystick = new SimpleJoystick(size);
    //joystick.setName("Joystick"); rc1 has bug
    joystick.setPosition(position);
    joystick.setThumbSprite(cc.Sprite.create(res.Joystick_Thumb_png));
    joystick.setBackgroundSprite(cc.Sprite.create(res.Joystick_Background_png));
    joystick.setDeadRadius(8.0);
    joystick.setThumbRadius(41 - 10);
    joystick.setIsKeyboard(true);
    //joystick.setIsDPad(true);

    return joystick;
};

Joystick.createAttkButton = function () {
    var xOffset = 64, yOffset = 4;
    var size = cc.size(48, 48);

    var position = cc.p(
            cc.visibleRect.bottomRight.x - (size.width / 2) - xOffset,
            cc.visibleRect.bottomRight.y + (size.height / 2) + yOffset
    );

    var button = new SimpleButton(size);
    //button.setName("AttackButton"); rc1 has bug
    button.setDefaultSprite(cc.Sprite.create(res.Button1_Default_png));
    button.setActivetdSprite(cc.Sprite.create(res.Button1_Pressed_png));
    button.setPressSprite(cc.Sprite.create(res.Button1_Pressed_png));
    button.setDisabledSprite(cc.Sprite.create(res.Button1_Disabled_png));
    button.setPosition(position);
    button.setIsKeyboard(true);
    button.setIsHoldable(true);
    button.setKeyCode(cc.KEY.z);

    return button;
};

Joystick.createDefenseButton = function () {
    var xOffset = 8, yOffset = 4;
    var size = cc.size(48, 48);

    var position = cc.p(
            cc.visibleRect.bottomRight.x - (size.width / 2) - xOffset,
            cc.visibleRect.bottomRight.y + (size.height / 2) + yOffset
    );

    var button = new SimpleButton(size);
    //button.setName("DefenseButton");  rc1 has bug
    button.setDefaultSprite(cc.Sprite.create(res.Button2_Default_png));
    button.setActivetdSprite(cc.Sprite.create(res.Button2_Pressed_png));
    button.setPressSprite(cc.Sprite.create(res.Button2_Pressed_png));
    button.setDisabledSprite(cc.Sprite.create(res.Button2_Disabled_png));
    button.setPosition(position);
    button.setIsKeyboard(true);
    button.setIsHoldable(true);
    button.setKeyCode(cc.KEY.x);

    return button;
};

