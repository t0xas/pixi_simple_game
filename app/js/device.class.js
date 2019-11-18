"use strict";
class Device {
    points;
    element;
    constructor(app, type) {
        this.app = app;
        this.type = type;
        this.points = 0;
    }
    init(){
        let device;
        if(this.type == 'bomb') {
            device = PIXI.Sprite.from('img/bomb.png');
        }
        else {
            device = PIXI.Sprite.from('img/'+this.type+'.png');
            device.height = 64;
            device.width = 64;
            if(this.type == 'bonus_1') {
                this.points = 10
            }
            else if(this.type == 'bonus_2') {
                this.points = 15
            }
            else if(this.type == 'bonus_3') {
                this.points = 30
            }
            else if(this.type == 'bonus_4') {
                this.points = 50
            }
            device.alpha = 0.9;
            this.effect();
        }
        device.y = 560 - 52 * getRandomInt(0, 4);
        device.x = this.app.screen.width - 100;
        device.zIndex = 4;
        this.element = device;
        return device;
    }
    effect (){
        let th = this.element;
        let effect = PIXI.Sprite.from('/img/effect.png');
        effect.anchor.set(0.5, 0.5);
        effect.alpha = 0.2;
        let animation = function(){
            effect.roration-=0.1;
        };
        this.app.ticker.add(animation);
    }
}