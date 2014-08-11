cc.game.onStart = function(){
    cc.view.setDesignResolutionSize(320, 480, cc.ResolutionPolicy.SHOW_ALL);
	cc.view.resizeWithBrowserSize(true);

    var origin = cc.director.getVisibleOrigin();
    var size = cc.director.getVisibleSize();

    var visiblerect = cc.rect(origin.x,origin.y,size.width,size.height);
    cc.visibleRect.init(visiblerect);


    //load resources
    cc.LoaderScene.preload(g_resources, function () {
        cc.director.runScene(new HelloWorldScene());
    }, this);
};
cc.game.run();