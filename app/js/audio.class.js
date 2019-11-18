"use strict";
class Sound {
    audio;
    container;
    constructor (app){
        this.app = app;
    }
    music(){
        let container = this.container = new PIXI.Container();
        this.app.stage.addChild(container);

        this.audio = new Audio();
        this.audio.src = 'audio/bg.wav'; // Указываем путь к звуку "клика"
        this.audio.loop = true;
        this.audio.volume = 0.20;

        const soundGraphics = new PIXI.Graphics();
        soundGraphics.beginFill(0xDE3249);
        soundGraphics.drawRect(55, 60, 315, 2);
        soundGraphics.endFill();
        container.addChild(soundGraphics);

        const styleTextSound = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 14,
            fontStyle: 'italic',
            fontWeight: 'bold',
            fill: ['#ffffff', '#ff0000'], // gradient
            strokeThickness: 3,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 1,
            wordWrap: true,
            wordWrapWidth: 440,
        });
        const soundTextPluse = new PIXI.Text('+', styleTextSound);
        soundTextPluse.x = 345;
        const soundTextMinus = new PIXI.Text('-', styleTextSound);
        soundTextMinus.x = 55;
        soundTextPluse.y = soundTextMinus.y = 38;
        const soundText = new PIXI.Text('sound control. press "A" or "Q"', styleTextSound);
        soundText.x = 95;
        soundText.y = 70;
        let soundPic = PIXI.Sprite.from('img/sound.png');
        soundPic.x = 50 + this.audio.volume * 3.15 * 100;
        soundPic.y = 49;
        container.addChild(soundTextPluse);
        container.addChild(soundTextMinus);
        container.addChild(soundPic);
        container.addChild(soundText);

        document.addEventListener('keydown', soundControl);
        let audio = this.audio;
        function soundControl(key) {
            if (key.keyCode === 65) {
                if (audio.volume > 0.01) {
                    audio.volume = audio.volume - 0.01;
                    soundPic.x -= 3.15;
                }
            } else if (key.keyCode === 81) {
                if (audio.volume < 0.99) {
                    audio.volume = audio.volume + 0.01;
                    soundPic.x += 3.15;
                }
            }
        }
    }

    playMusic(){
        this.audio.play();
    }
    pauseMusic(){
        this.audio.pause();
    }

    destroy(){
        this.pauseMusic();
        this.app.stage.removeChild(this.container);
    }
}