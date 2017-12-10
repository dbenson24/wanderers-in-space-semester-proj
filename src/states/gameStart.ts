import * as Assets from '../assets';
import { Physics, scaleModes, Time } from 'phaser-ce';
import {Point, GravityPhysics, GravityBody, BasicGravityBody} from "../physics";

let G = 6.67408*Math.pow(10, -11);

enum TimeScale {
    RealTime,
    Fast,
    Faster,
    Fastest
}

export default class gameStart extends Phaser.State {
    private backgroundTemplateSprite: Phaser.Sprite = null;
    private googleFontText: Phaser.Text = null;
    private localFontText: Phaser.Text = null;
    private pixelateShader: Phaser.Filter = null;
    private bitmapFontText: Phaser.BitmapText = null;
    private blurXFilter: Phaser.Filter.BlurX = null;
    private blurYFilter: Phaser.Filter.BlurY = null;
    private sfxAudiosprite: Phaser.AudioSprite = null;
    private moveableMummy: Phaser.Sprite = null;
    private planet: Phaser.Sprite = null;
    private ship: Phaser.Sprite = null;
    
    private mummyBody: Phaser.Physics.P2.Body;
    private planetBody: Phaser.Physics.P2.Body;

    private gravityPhysics: GravityPhysics;

    private statsTable: Phaser.Text = null;
    private hValue: Phaser.Text = null;
    private vValue: Phaser.Text = null;
    private locX: Phaser.Text = null;
    private locY: Phaser.Text = null;
    private text4: Phaser.Text = null;
    private dateText: Phaser.Text = null;

    private speed: TimeScale = TimeScale.RealTime;

    private engineSound: Phaser.Sound = null;

    private movingBody: BasicGravityBody;
    private shipBody: BasicGravityBody;

    public create(): void {

        let metersPerPixel = 1200000.0;
        let frameRate = 1.0/30.0;
        this.gravityPhysics = new GravityPhysics(metersPerPixel);


        this.engineSound = this.game.sound.add(Assets.Audio.AudioFire.getName());
        

        this.backgroundTemplateSprite = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, Assets.Images.ImagesSpaceBackground.getName());
        this.backgroundTemplateSprite.anchor.setTo(0.5);
        this.backgroundTemplateSprite.fixedToCamera = true;
        this.backgroundTemplateSprite.cameraOffset.set(this.game.world.centerX, this.game.world.centerY);
        this.game.world.setBounds(-3000, -3000, 6000, 6000);

        
        // PIXI.Sprite.defaultAnchor.x = 0.5;
        // PIXI.Sprite.defaultAnchor.y = 0.5;
        

        this.physics.startSystem(Phaser.Physics.P2JS);

        this.moveableMummy = this.game.add.sprite(0, 0, Assets.Images.SpritesheetsPlanet6.getName());
        this.planet = this.game.add.sprite(0, 0, Assets.Images.SpritesheetsPlanet18.getName());
        this.moveableMummy.anchor.setTo(0.5);
        this.moveableMummy.scale.setTo(0.1);
        this.planet.anchor.setTo(0.5);
        this.planet.name = "Earth";
        this.moveableMummy.name = "Moon";

        let ship = this.game.add.sprite(0, 0, Assets.Images.ImagesShip1.getName());
        ship.scale.setTo(0.2);
        ship.anchor.setTo(0.5);
        this.ship = ship;
        ship.name = "Ship";

        this.game.camera.follow(ship, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

        this.planet.scale.setTo(0.2);
        // moon
        this.movingBody = new BasicGravityBody(this.moveableMummy, 7.34767309 * Math.pow(10, 22), 0, -384400000.0, 1737000);
        // earth
        let stationaryBody = new BasicGravityBody(this.planet, 5.972 * Math.pow(10, 24), 0, 0, 6371000);

        this.shipBody = new BasicGravityBody(this.ship, 1000.0, 0, -35786000.0, 100.0, 100000.0);

        this.gravityPhysics.addBody(this.movingBody);
        this.gravityPhysics.addBody(stationaryBody);
        this.gravityPhysics.addBody(this.shipBody);

        this.movingBody.vx = Math.sqrt(G * stationaryBody.mass / this.gravityPhysics.distanceBetween(this.movingBody.loc, stationaryBody.loc));
        this.shipBody.vx = Math.sqrt(G * stationaryBody.mass / this.gravityPhysics.distanceBetween(this.shipBody.loc, stationaryBody.loc));

        this.gravityPhysics.updateBodyPositions(0);

        let fontStyle = { font: '13px Anonymous Pro', fill: '#aea' };

        let t = this.game.add.text(16, 16, 'Statistics Table', fontStyle);
        t.fixedToCamera = true;
        t.cameraOffset.set(16, 16);
        // this.game.add.text(16, 32, '', fontStyle)
        
        let sm = this.game.add.text(16, 48, "   Spaceship Mass   : " + this.movingBody.mass.toFixed(2), fontStyle);
        sm.fixedToCamera = true;
        sm.cameraOffset.set(16, 48);
        //this.game.add.text(16, 48+16, '', fontStyle)

        let pm = this.game.add.text(16, 48+16+16, "   Planet Mass         : " + stationaryBody.mass.toFixed(2), fontStyle);
        pm.fixedToCamera = true;
        pm.cameraOffset.set(16, 80);

        this.hValue = this.game.add.text(16, 64+16+16+16, '', fontStyle);
        this.hValue.fixedToCamera = true;
        this.hValue.cameraOffset.set(16, 112);

        this.game.add.text(16, 80+16+16+16, '', fontStyle);
        
        this.vValue = this.game.add.text(16, 96+16+16+16, '', fontStyle);
        this.vValue.fixedToCamera = true;
        this.vValue.cameraOffset.set(16, 96+16+16+16);
        //this.game.add.text(16, 112+16+16+16, '', fontStyle)
        
        this.locX = this.game.add.text(16, 128+16+16+16, '', fontStyle);
        this.locX.fixedToCamera = true;
        this.locX.cameraOffset.set(16, 128+16+16+16);
        //this.game.add.text(16, 144+16+16+16, '', fontStyle)
        
        this.text4 = this.game.add.text(16, 208, '', fontStyle);
        this.text4.fixedToCamera = true;
        this.text4.cameraOffset.set(16, 208);

        this.dateText = this.game.add.text(16, 240, '', fontStyle);
        this.dateText.fixedToCamera = true;
        this.dateText.cameraOffset.set(16, 240);

        let period = this.game.input.keyboard.addKey(Phaser.Keyboard.PERIOD);
        period.onDown.add(() => {
            if (this.speed !== TimeScale.Fastest) {
                this.speed++;
            }
        })

        let comma = this.game.input.keyboard.addKey(Phaser.Keyboard.COMMA);
        comma.onDown.add(() => {
            if (this.speed !== TimeScale.RealTime) {
                this.speed--;
            }
        })
    }
    public update(game: Phaser.Game) {
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.A)) {
            this.ship.rotation -= Math.PI / 180;
        }

        if (this.game.input.keyboard.isDown(Phaser.Keyboard.D)) {
            this.ship.rotation += Math.PI / 180;
        }

        if (this.game.input.keyboard.isDown(Phaser.Keyboard.W)) {
            this.shipBody.engineOn = true;
            console.log("Engine Fired");
            this.speed = TimeScale.RealTime;
            this.engineSound.play();

        }

        switch(this.speed) {
            case TimeScale.RealTime:
                this.gravityPhysics.updateBodyPositions(1/60.0);
                break;
            case TimeScale.Fast:
                this.gravityPhysics.updateBodyPositions(1);
                break;
            case TimeScale.Faster:
                for (let i = 0; i < 40; i++) {
                    this.gravityPhysics.updateBodyPositions(2.5);
                }
                break;
            case TimeScale.Fastest:
                for (let i = 0; i < 100; i++) {
                    this.gravityPhysics.updateBodyPositions(10);
                }
                break;
        }

        if (true) {
        }
        //{
        //    this.gravityPhysics.updateBodyPositions(1/30.0);
        //}
        this.shipBody.engineOn = false;
        this.hValue.setText("   Horizontal Value : " + this.movingBody.vx.toFixed(2));
        this.vValue.setText("   Vertical Value      : " + this.movingBody.vy.toFixed(2));
        this.locX.setText("   loc - X                 : " + this.movingBody.loc.x.toFixed(2));
        this.text4.setText("   loc - Y                 : " + this.movingBody.loc.y.toFixed(2));
        this.dateText.setText("   Date                    : " + this.gravityPhysics.date.toLocaleString());
        for (let i = 0; i < this.gravityPhysics.bodies.length; i++) {
            if (Object.is(this.shipBody, this.gravityPhysics.bodies[i])) {
                continue;
            }
            if (this.shipBody.collisionOccured(this.gravityPhysics.bodies[i])) { 
                if (this.shipBody.collisionSurvivable(this.gravityPhysics.bodies[i])) { 
                    // TODO: Change to win condition
                    this.goNext();

                }
                else { 
                    // TODO: Change to loss condition
                    this.goNext();
                }
            }
        } 
    }

    private fail(): void { 
        this.game.state.start('lose');
    } 
    private win(): void { 
        this.game.state.start('win');
    } 
    private goNext(): void {
        this.game.state.start('gameStart');
    }
}
