$(function(){
    $("#sprite").spritespin({
        source: '../../img/360_640_.png',
        width   : 480,  // width in pixels of the window/frame
        height  : 640,  // height in pixels of the window/frame
        frames: 72,
        framesX: 72,
        sense: -1,
        frameTime         : 80,
        renderer: 'background'
    });
});