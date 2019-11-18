"use strict";

class UI {

    constructor(app) {
        this.app = app;
    }

    init(container) {
        this.container = container;
        this.speedBar = this.createSpeedBar();
        this.bonusBar = this.createBonusBar();
        this.startStopText = this.createStartStopText();
        this.healthBar = this.createHealthBar();
        this.pointBar = this.createPointBar();
    }

    createSpeedBar() {
        const s = new PIXI.Text('Speed: 10 Km/h', new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 36,
            fontStyle: 'italic',
            fontWeight: 'bold',
            fill: ['#ffffff', '#ff0000'], // gradient
            strokeThickness: 3,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 2,
            wordWrap: true,
            wordWrapWidth: 440,
        }));
        s.x = 50;
        s.y = 0;
        this.container.addChild(s);
        return s;
    }

    createBonusBar() {
        const bonusText = new PIXI.Text('0', new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 28,
            fontWeight: 'bold',
            fill: ['#ffffff', '#ff0000'], // gradient
            strokeThickness: 3,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 2,
            wordWrap: true,
            wordWrapWidth: 440,
        }));
        bonusText.x = 550;
        bonusText.y = 34;
        this.container.addChild(bonusText);
        return bonusText;
    }

    createStartStopText() {
        const startStopText = new PIXI.Text('Press ENTER or SPACE', new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 36,
            fontStyle: 'italic',
            fontWeight: 'bold',
            fill: ['#ffffff', '#ff0000'], // gradient
            strokeThickness: 3,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 2,
            wordWrap: true,
            wordWrapWidth: 440,
        }));
        startStopText.x = 450;
        startStopText.y = 100;
        let container = this.container;
        container.addChild(startStopText);
        return startStopText;
    }

    createHealthBar() {
        let h = new PIXI.Text("Health: ", new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 24,
            fontWeight: 'bold',
            fill: ['#ffffff', '#ff0000'], // gradient
            strokeThickness: 3,
            wordWrap: true,
            wordWrapWidth: 440,
        }));
        h.y = 6;
        h.x = 450;
        this.container.addChild(h);
        return this.addHealth(CONFIG_HEALTH);
    }

    createPointBar() {
        let p = new PIXI.Text("Points: ", new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 24,
            fontWeight: 'bold',
            fill: ['#ffffff', '#ff0000'], // gradient
            strokeThickness: 3,
            wordWrap: true,
            wordWrapWidth: 440,
        }));
        p.y = 36;
        p.x = 450;
        this.container.addChild(p);
        return p;
    }

    addPoint(val) {
        this.bonusBar.text = parseInt(this.bonusBar.text) + Math.floor(parseInt(val));
    }

    setSpeed(value) {
        let speed = Math.abs(Math.round(value * 1000 / 2));
        this.speedBar.text = 'Car speed: ' + speed + ' Km/h';
    }

    showStartStopText(flag){
        (flag)?this.container.removeChild(this.startStopText):this.container.addChild(this.startStopText);
    }

    removeOneHealth() {
        let h = this.healthBar.pop();
        this.container.removeChild(h);
    }

    getHealth(){
        return this.healthBar.length;
    }

    addHealth(count){
        let heals = [];
        let offsetX = 550;

        if(typeof this.healthBar != "undefined") {
            offsetX += 35*this.healthBar.length;
        }

        for (let i = 0; i < count; i++) {
            let h = PIXI.Sprite.from("img/heart.png");
            h.y = 6;
            h.x = offsetX + 35 * i;
            h.width = 35;
            h.height = 32;
            this.container.addChild(h);
            heals.push(h);
        }
        return heals;
    }
}