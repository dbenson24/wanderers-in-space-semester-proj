import * as Assets from '../assets';
import { Physics, scaleModes } from 'phaser-ce';
import {Point, GravityPhysics, GravityBody, BasicGravityBody} from "../physics";


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


    // This is any[] not string[] due to a limitation in TypeScript at the moment;
    // despite string enums working just fine, they are not officially supported so we trick the compiler into letting us do it anyway.
    private sfxLaserSounds: any[] = null;

    private movingBody: BasicGravityBody;
    private shipBody: BasicGravityBody;

    public create(): void {

        let metersPerPixel = 20.0;
        let frameRate = 1.0/60.0;
        this.gravityPhysics = new GravityPhysics(metersPerPixel, frameRate);

        console.log("Starting Game!!!")

        console.log('this.game.world.centerX: ' + this.game.world.centerX);
        

        this.backgroundTemplateSprite = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, Assets.Images.ImagesSpaceBackground.getName());
        this.backgroundTemplateSprite.anchor.setTo(0.5);
        this.backgroundTemplateSprite.fixedToCamera = true;
        this.backgroundTemplateSprite.cameraOffset.set(this.game.world.centerX, this.game.world.centerY);
        this.game.world.setBounds(-3000, 3000, 6000, 6000);

        
        // PIXI.Sprite.defaultAnchor.x = 0.5;
        // PIXI.Sprite.defaultAnchor.y = 0.5;
        

        this.physics.startSystem(Phaser.Physics.P2JS);

        this.moveableMummy = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY + 150, Assets.Images.SpritesheetsPlanet6.getName());
        this.planet = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, Assets.Images.SpritesheetsPlanet18.getName());
        this.moveableMummy.anchor.setTo(0.5);
        this.moveableMummy.scale.setTo(0.1);
        this.planet.anchor.setTo(0.5);

        let ship = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY + 80, Assets.Images.ImagesShip1.getName());
        ship.scale.setTo(0.2);
        ship.anchor.setTo(0.5);
        this.ship = ship;

        this.game.camera.follow(ship, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

        this.planet.scale.setTo(0.2);

        this.movingBody = new BasicGravityBody(this.moveableMummy, metersPerPixel,  10000000.0);
        let stationaryBody = new BasicGravityBody(this.planet, metersPerPixel, 1000000000.0);

        this.shipBody = new BasicGravityBody(this.ship, metersPerPixel, 20.0, 5000.0);

        this.gravityPhysics.addBody(this.movingBody);
        this.gravityPhysics.addBody(stationaryBody);
        this.gravityPhysics.addBody(this.shipBody);

        this.movingBody.vx = Math.sqrt(stationaryBody.mass / this.gravityPhysics.distanceBetween(this.movingBody.loc, stationaryBody.loc));
        this.shipBody.vx = Math.sqrt(stationaryBody.mass / this.gravityPhysics.distanceBetween(this.shipBody.loc, stationaryBody.loc));

        let t = this.game.add.text(16, 16, 'Statistics Table', { font: '13px Anonymous Pro', fill: '#aea' })
        t.fixedToCamera = true;
        t.cameraOffset.set(16, 16);
        
        let sm = this.game.add.text(16, 48, "   Spaceship Mass   : " + this.movingBody.mass.toFixed(2), { font: '13px Anonymous Pro', fill: '#aea' })
        sm.fixedToCamera = true;
        sm.cameraOffset.set(16, 48);

        let pm = this.game.add.text(16, 80, "   Planet Mass         : " + stationaryBody.mass.toFixed(2), { font: '13px Anonymous Pro', fill: '#aea' })
        pm.fixedToCamera = true;
        pm.cameraOffset.set(16, 80);

        this.hValue = this.game.add.text(16, 112, '', { font: '13px Anonymous Pro', fill: '#aea' });
        this.hValue.fixedToCamera = true;
        this.hValue.cameraOffset.set(16, 112);

        this.game.add.text(16, 128, '', { font: '13px Anonymous Pro', fill: '#aea' });
        
        this.vValue = this.game.add.text(16, 144, '', { font: '13px Anonymous Pro', fill: '#aea' });
        this.vValue.fixedToCamera = true;
        this.vValue.cameraOffset.set(16, 144);
        
        this.locX = this.game.add.text(16, 176, '', { font: '13px Anonymous Pro', fill: '#aea' });
        this.locX.fixedToCamera = true;
        this.locX.cameraOffset.set(16, 176);
        
        this.text4 = this.game.add.text(16, 208, '', { font: '13px Anonymous Pro', fill: '#aea' });
        this.text4.fixedToCamera = true;
        this.text4.cameraOffset.set(16, 208);

        console.log("rotation: " + ship.rotation);

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
            console.log("Engine Fired !!!!!!");
        }

        this.gravityPhysics.updateBodyPositions();
        this.shipBody.engineOn = false;
        this.hValue.setText("   Horizontal Value : " + this.movingBody.vx.toFixed(2));
        this.vValue.setText("   Vertical Value      : " + this.movingBody.vy.toFixed(2));
        this.locX.setText("   loc - X                 : " + this.movingBody.loc.x.toFixed(2));
        this.text4.setText("   loc - Y                 : " + this.movingBody.loc.y.toFixed(2));
        for (let i = 0; i < this.gravityPhysics.bodies.length; i++) {
            if (Object.is(this.shipBody, this.gravityPhysics.bodies[i])) {
                continue;
            }
            if (this.shipBody.collisionOccured(this.gravityPhysics.bodies[i])) { 
                if (this.shipBody.collisionSurvivable(this.gravityPhysics.bodies[i])) { 
                    // TODO: Change to win condition
                    console.log('WIN!!!!')
                    this.goNext();

                }
                else { 
                    console.log('LOST!!!!')
                    // TODO: Change to loss condition
                    this.goNext();
                }
            }
        } 
    }

    private goNext(): void {
        this.game.state.start('gameStart');
    }

    private fail(): void { 
        this.game.state.start('lose');
    } 

    private win(): void { 
        this.game.state.start('win');
    } 
}
