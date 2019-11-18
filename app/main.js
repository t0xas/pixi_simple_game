"use strict";
let size = [1320, 630];
let app = new PIXI.Application({
    width: size[0],
    height: size[1]
});

document.body.appendChild(app.view);
const loader = new PIXI.Loader();

loader.add("img/road.png")
    .add("img/sky.jpg")
    .add("img/city.png")
    .add("img/wheel.png")
    .add("img/sound.png")
    .load(mainScene);
//.load(gameOverScene);

let stopFlag = false;
let car = new Car(app);
let sound = new Sound(app);
let ui = new UI(app);

function mainScene() {
    let container = new PIXI.Container();
    app.stage.addChild(container);
    container.sortableChildren = true;
    sound.music();

    let roadTexture = PIXI.Texture.from("img/road.png");
    let road = new PIXI.TilingSprite(roadTexture, size[0], size[1]);
    let skyTexture = PIXI.Texture.from("img/sky.jpg");
    let sky = new PIXI.TilingSprite(skyTexture, size[0], 207);
    let cityTexture = PIXI.Texture.from("img/city.png");
    let city = new PIXI.TilingSprite(cityTexture, size[0], 167);
    city.y = 120;
    let cityTexture2 = PIXI.Texture.from("img/city.png");
    let city2 = new PIXI.TilingSprite(cityTexture2, size[0], 167);
    city2.y = 70;

    container.addChild(sky);
    container.addChild(city2);
    container.addChild(city);
    container.addChild(road);
    car.init();
    ui.init(container);

    document.addEventListener('keydown', onKeyDown);

    function onKeyDown(key) {
        if (key.keyCode === 32 || key.keyCode === 13) {
            if (!car.isExploded) {
                if (stopFlag === false) {
                    stopFlag = true;
                    car.carSpeed = 0.02;
                    car.play();
                    sound.playMusic();
                    ui.showStartStopText(true);

                } else {
                    stopFlag = false;
                    car.carSpeed = 0;
                    car.stop();
                    sound.pauseMusic();
                    ui.showStartStopText(false);
                }
            }
        }
    }

    let bombDroped = [];
    let bonusDroped = [];

    //реализует движение сцены
    app.ticker.add(() => {
        ui.setSpeed(car.carSpeed);
        let speed = getSpeedInKmh(car.carSpeed);
        let roadSpeed = Math.PI * 56 * car.carSpeed / 4.1; //56 - is wheel width
        road.tilePosition.x -= roadSpeed;
        sky.tilePosition.x -= roadSpeed * .2;
        city.tilePosition.x -= roadSpeed * .6;
        city2.tilePosition.x -= roadSpeed * .4;
        let S = -Math.ceil(road.tilePosition.x / 80);
        if (speed) {
            let i = parseInt(bombDroped.length);
            if (S >= 10 * i && S < 10 + (10 * i) && bombDroped.indexOf(S) === -1 && S !== 0) {
                bombDroped.push(S);
                dropBomb();
            }
            i = parseInt(bonusDroped.length);
            if (S >= 10 * i + 5 && S < 10 + (10 * i) + 5 && bonusDroped.indexOf(S) === -1) {
                bonusDroped.push(S);
                dropBonus();
            }
            if (speed > CONFIG_MINSPEEDBONUS) {
                ui.addPoint(speed / 100);
            }
        }
    });

    function dropBomb() {
        let bomb = new Device(app, 'bomb');
        let b = bomb.init();
        container.addChild(b);
        let blisten = function () {
            let roadSpeed = Math.PI * 56 * car.carSpeed / 4.1;
            b.x -= roadSpeed;
            var objCar = {x: car.car.x, y: car.car.y + 70, width: 310, height: 10};
            var objBomb = {x: b.x, y: b.y, width: 50, height: 50};
            if (MacroCollision(objBomb, objCar)) {
                b.y = -15200;
                car.explosion(sound.audio.volume + 0.1);
                ui.removeOneHealth();
                if (ui.getHealth() === 0) {
                    gameOver();
                }
            }
        };
        app.ticker.add(blisten);
        return b;
    }

    function gameOver() {
        document.removeEventListener('keydown', onKeyDown);
        setTimeout(function () {
            app.stage.removeChild(container);
            sound.destroy();
            car.destroy();
            gameOverScene();
        }, 1500);
    }

    function dropBonus() {
        let device = new Device(app, 'bonus_' + getRandomInt(1, 4));
        let b = device.init();
        container.addChild(b);

        let effect = PIXI.Sprite.from('img/effect.png');
        effect.anchor.set(0.5, 0.5);
        effect.alpha = 0.1;
        effect.width = effect.height = 70;
        effect.y = b.y + 32;
        effect.x = b.x + 32;
        container.addChild(effect);

        let blisten = function () {
            let roadSpeed = Math.PI * 56 * car.carSpeed / 4.1;
            b.x -= roadSpeed;
            effect.x = b.x + 32;
            effect.rotation -= 0.08;
            let objCar = {x: car.car.x, y: car.car.y + 70, width: 310, height: 10};
            let objBomb = {x: b.x, y: b.y, width: 50, height: 50};
            if (MacroCollision(objBomb, objCar)) {
                effect.y = b.y = -15200;
                ui.addPoint(device.points);
            }
        };
        app.ticker.add(blisten);
        return b;
    }
}

function gameOverScene() {


    let container = new PIXI.Container();
    app.stage.addChild(container);

    let bgTexture = PIXI.Texture.from("img/gameover.jpg");
    let bg = new PIXI.TilingSprite(bgTexture, size[0], size[1]);
    bg.alpha = 0;
    container.addChild(bg);

    const goText = new PIXI.Text('Game Over', new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 68,
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
    goText.x = 450;
    goText.y = 134;
    container.addChild(goText);

    const subText = new PIXI.Text('press ENTER or SPACE for restart game.', new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 18,
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
    subText.x = 460;
    subText.y = 214;
    container.addChild(subText);

    app.ticker.add(() => {
        if (bg.alpha < 0.6) {
            bg.alpha += 0.001
        }
    });

    document.addEventListener('keydown', onKey);

    function onKey(key) {
        if (key.keyCode === 32 || key.keyCode === 13) {
            location.href=location.href;
        }
    }
}

function resize() {
    let ratio = size[0] / size[1];
    let w, h;
    if (window.innerWidth / window.innerHeight >= ratio) {
        w = window.innerHeight * ratio;
        h = window.innerHeight;
    } else {
        w = window.innerWidth;
        h = window.innerWidth / ratio;
    }
    if (w > h) {
        let add = innerHeight - h;
        app.view.style.width = w + add + 'px';
        app.view.style.height = h + add + 'px';
    } else {
        let add = innerWidth - w;
        app.view.style.width = w + add + 'px';
        app.view.style.height = h + add + 'px';
    }
}

resize();
window.onresize = resize;