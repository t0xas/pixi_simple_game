"use strict";

class Car {
    carSpeed;
    wheel_l;
    wheel_r;
    car;
    carPosition = 400;
    stopFlag = false;
    carContainer;
    isExploded = false;

    constructor(app) {
        this.app = app;
    }

    init() {
        this.carSpeed = 0;

        this.carContainer = new PIXI.Container();
        this.app.stage.addChild(this.carContainer);

        let wheelTexture = PIXI.Texture.from("img/wheel.png");

        this.wheel_l = new PIXI.TilingSprite(wheelTexture, 56, 56);
        this.wheel_l.y = this.carPosition + 100;
        this.wheel_l.x = 427 + 40;
        this.wheel_l.anchor.set(0.5, 0.5);

        this.wheel_r = new PIXI.TilingSprite(wheelTexture, 56, 56);
        this.wheel_r.y = this.carPosition + 100;
        this.wheel_r.x = 196 + 40;
        this.wheel_r.anchor.set(0.5, 0.5);

        let carTexture = PIXI.Texture.from("img/car.png");
        this.car = new PIXI.TilingSprite(carTexture, 332, 133);
        this.car.y = this.carPosition;
        this.car.x = 150 + 40;
        this.car.zIndex = 10;

        this.carContainer.addChild(this.car);
        this.carContainer.addChild(this.wheel_l);
        this.carContainer.addChild(this.wheel_r);
        this.controlButtons();
        this.animate();
    }

    animate() {
        let car = this;
        this.app.ticker.add(() => {
            car.wheel_l.rotation += car.carSpeed;
            car.wheel_r.rotation += car.carSpeed;
        });
    }

    controlButtons() {
        document.addEventListener('keydown', carKeys);
        let car = this;

        function carKeys(key) {
            if (car.stopFlag === false) {
                if (key.keyCode === 38) {
                    car.carPosition = car.carPosition - 50;
                    if (car.carPosition < 290) {
                        car.carPosition = 290;
                    }
                    car.wheel_r.y = car.wheel_l.y = car.carPosition + 100;
                    car.car.y = car.carPosition;
                }
                //down
                else if (key.keyCode === 40) {
                    car.carPosition = car.carPosition + 50;
                    if (car.carPosition > 490) {
                        car.carPosition = 490;
                    }
                    car.wheel_r.y = car.wheel_l.y = car.carPosition + 100;
                    car.car.y = car.carPosition;
                }
                //право
                else if (key.keyCode === 39) {
                    if (car.carSpeed < 0.6) {
                        car.carSpeed = car.carSpeed + 0.01;
                    }
                }
                //лево
                else if (key.keyCode === 37) {
                    if (car.carSpeed > -0.05) {
                        car.carSpeed = car.carSpeed - 0.01;
                    }
                }
            }
        }
    }

    stop() {
        this.stopFlag = true;
    }

    play() {
        this.stopFlag = false;
    }

    explosion(audioVolume) {
        this.isExploded = true;
        let explosionAudio = new Audio();
        explosionAudio.src = 'audio/explosion.mp3'; // Указываем путь к звуку "клика"
        explosionAudio.loop = false;
        explosionAudio.volume = audioVolume;
        explosionAudio.play();

        let wheeSpeed_tmp = this.carSpeed;
        this.carSpeed = 0;

        const frames = [];
        for (let i = 0; i < 50; i++) {
            frames.push(PIXI.Texture.from(`img/explosion/boom_${i}.png`));
        }
        const anim = new PIXI.AnimatedSprite(frames);
        anim.x = this.car.x + 200;
        anim.y = this.car.y + 50;
        anim.loop = false;
        anim.animationSpeed = 0.5;
        anim.anchor.set(0.5,0.5);
        anim.scale.set(1.8);
        anim.play();
        this.carContainer.addChild(anim);

        let car = this;
        let carDestroy
        setTimeout(function () {
            car.wheel_l.anchor.set(0, 0);
            car.wheel_r.anchor.set(0, 0);
            car.car.anchor.set(.5, .5);
            let lValueRand = Math.random(11, 11.5);
            let sValueRand = Math.random(0.11, 0.12);
            carDestroy = function () {
                car.car.x += lValueRand + 2;
                car.car.y -= lValueRand + 4;
                car.car.rotation -= sValueRand - 0.1;
                car.wheel_l.x += sValueRand;
                car.wheel_l.y -= lValueRand + 3;
                car.wheel_l.rotation -= sValueRand + 0.2;
                car.wheel_r.x -= lValueRand + 1;
                car.wheel_r.y -= sValueRand;
                car.wheel_r.rotation -= sValueRand - 12;
            }.bind(car);
            car.app.ticker.add(carDestroy);
        }.bind(car), 100);

        this.stop();

        setTimeout(function () {
            car.app.ticker.remove(carDestroy);
            car.wheel_l.y = car.carPosition + 100;
            car.wheel_l.x = 427 + 40;
            car.wheel_l.anchor.set(0.5, 0.5);

            car.wheel_r.y = car.carPosition + 100;
            car.wheel_r.x = 196 + 40;
            car.wheel_r.anchor.set(0.5, 0.5);

            car.car.y = car.carPosition;
            car.car.x = 150 + 40;
            car.car.rotation = 0;
            car.car.anchor.set(0, 0);
            car.play();
            car.carSpeed = wheeSpeed_tmp;
            car.isExploded = false;
        }.bind(car), 1500)
    }

    destroy(){
        this.stop();
        this.carSpeed = 0;
        this.app.stage.removeChild(this.carContainer);
    }
    /* use filter
    initLight(){
        let light_position = [this.car.x+this.car.width-30, this.car.y+this.car.height/2-13];
        let light_height = 400;
        let graphics = new PIXI.Graphics();
        graphics.beginFill(0xFBFFD2);
        graphics.moveTo(light_position[0], light_position[1]);
        graphics.lineTo(this.app.screen.width, light_position[1]-light_height/5);
        graphics.lineTo(this.app.screen.width, light_position[1]+light_height/2);
        graphics.lineTo(light_position[0]+20, light_position[1]+20);
        graphics.lineTo(light_position[0], light_position[1]);
        graphics.closePath();
        graphics.alpha = 0.4;
        graphics.endFill();
        graphics.zIndex = 1;
        this.carContainer.addChild(graphics);
    }
     */
}