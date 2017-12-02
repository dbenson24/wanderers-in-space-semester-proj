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
    private planetMummy: Phaser.Sprite = null;
    private ship: Phaser.Sprite = null;
    
    private mummyBody: Phaser.Physics.P2.Body;
    private planetBody: Phaser.Physics.P2.Body;
    private collGroup: Phaser.Physics.P2.CollisionGroup;

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

        this.backgroundTemplateSprite = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, Assets.Images.ImagesSpaceBackground.getName());
        this.backgroundTemplateSprite.anchor.setTo(0.5);
        this.game.world.setBounds(-3000, 3000, 6000, 6000);

        /*
        PIXI.Sprite.defaultAnchor.x = 0.5;
        PIXI.Sprite.defaultAnchor.y = 0.5;
        */

        this.physics.startSystem(Phaser.Physics.P2JS);
        this.collGroup = this.physics.p2.createCollisionGroup();

        this.moveableMummy = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY + 200, Assets.Spritesheets.SpritesheetsMetalslugMummy374518.getName());
        this.planetMummy = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, Assets.Images.SpritesheetsPlanet18.getName());
        this.moveableMummy.anchor.setTo(0.5);
        
        this.planetMummy.anchor.setTo(0.5);
        
        

        let ship = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY + 50, Assets.Images.ImagesShip1.getName());
        ship.scale.setTo(0.2);
        ship.anchor.setTo(0.5);
        this.ship = ship;

        this.game.camera.follow(ship, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

        this.planetMummy.scale.setTo(0.2);

        this.movingBody = new BasicGravityBody(this.moveableMummy, metersPerPixel,  10000000.0);
        let stationaryBody = new BasicGravityBody(this.planetMummy, metersPerPixel, 1000000000.0);

        this.shipBody = new BasicGravityBody(this.ship, metersPerPixel, 20.0, 5000.0);

        this.gravityPhysics.addBody(this.movingBody);
        this.gravityPhysics.addBody(stationaryBody);
        this.gravityPhysics.addBody(this.shipBody);

        this.movingBody.vx = Math.sqrt(stationaryBody.mass / this.gravityPhysics.distanceBetween(this.movingBody.loc, stationaryBody.loc));
        this.shipBody.vx = Math.sqrt(stationaryBody.mass / this.gravityPhysics.distanceBetween(this.shipBody.loc, stationaryBody.loc));

        let t = this.game.add.text(16, 16, 'Statistics Table', { font: '13px Anonymous Pro', fill: '#aea' })
        t.fixedToCamera = true;
        t.cameraOffset.set(16, 16);
        // this.game.add.text(16, 32, '', { font: '13px Anonymous Pro', fill: '#aea' })
        
        let sm = this.game.add.text(16, 48, "   Spaceship Mass   : " + this.movingBody.mass.toFixed(2), { font: '13px Anonymous Pro', fill: '#aea' })
        sm.fixedToCamera = true;
        sm.cameraOffset.set(16, 48);
        //this.game.add.text(16, 48+16, '', { font: '13px Anonymous Pro', fill: '#aea' })

        let pm = this.game.add.text(16, 48+16+16, "   Planet Mass         : " + stationaryBody.mass.toFixed(2), { font: '13px Anonymous Pro', fill: '#aea' })
        pm.fixedToCamera = true;
        pm.cameraOffset.set(16, 48+16+16);

        this.hValue = this.game.add.text(16, 64+16+16+16, '', { font: '13px Anonymous Pro', fill: '#aea' });
        this.hValue.fixedToCamera = true;
        this.hValue.cameraOffset.set(16, 64+16+16+16);

        this.game.add.text(16, 80+16+16+16, '', { font: '13px Anonymous Pro', fill: '#aea' });
        
        this.vValue = this.game.add.text(16, 96+16+16+16, '', { font: '13px Anonymous Pro', fill: '#aea' });
        this.vValue.fixedToCamera = true;
        this.vValue.cameraOffset.set(16, 96+16+16+16);
        //this.game.add.text(16, 112+16+16+16, '', { font: '13px Anonymous Pro', fill: '#aea' })
        
        this.locX = this.game.add.text(16, 128+16+16+16, '', { font: '13px Anonymous Pro', fill: '#aea' });
        this.locX.fixedToCamera = true;
        this.locX.cameraOffset.set(16, 128+16+16+16);
        //this.game.add.text(16, 144+16+16+16, '', { font: '13px Anonymous Pro', fill: '#aea' })
        
        this.text4 = this.game.add.text(16, 160+16+16+16, '', { font: '13px Anonymous Pro', fill: '#aea' });
        this.text4.fixedToCamera = true;
        this.text4.cameraOffset.set(16, 160+16+16+16);

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
        }
        this.gravityPhysics.updateBodyPositions();
        this.shipBody.engineOn = false;
        this.hValue.setText("   Horizontal Value : " + this.movingBody.vx.toFixed(2));
        this.vValue.setText("   Vertical Value      : " + this.movingBody.vy.toFixed(2));
        this.locX.setText("   loc - X                 : " + this.movingBody.loc.x.toFixed(2));
        this.text4.setText("   loc - Y                 : " + this.movingBody.loc.y.toFixed(2));



    }

    private goNext(): void {
        this.game.state.start('intro')
    }


}


/********************************   Commented Out Code   *******************************/

/*
let p2 = this.game.physics.p2;

p2.enableBody(this.moveableMummy, true);
p2.enableBody(this.planetMummy, false);

this.mummyBody = this.moveableMummy.body;
this.mummyBody.data.mass = 0.1;
this.mummyBody.setCollisionGroup(this.collGroup);

this.planetBody = this.planetMummy.body;
this.planetBody.dynamic = false;
this.planetBody.data.mass = 10000;
this.planetBody.setCollisionGroup(this.collGroup);

let push = (Math.sqrt(this.planetBody.data.mass) / Math.sqrt(p2.pxm(200))) / this.mummyBody.data.mass;

this.mummyBody.thrustRight(p2.mpx(push));
*/





/*
this.googleFontText = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 100, 'Google Web Fonts', {
    font: '50px ' + Assets.GoogleWebFonts.Barrio
});
this.googleFontText.anchor.setTo(0.5);

this.localFontText = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'Local Fonts + Shaders .frag (Pixelate here)!', {
    font: '30px ' + Assets.CustomWebFonts.Fonts2DumbWebfont.getFamily()
});
this.localFontText.anchor.setTo(0.5);

this.pixelateShader = new Phaser.Filter(this.game, null, this.game.cache.getShader(Assets.Shaders.ShadersPixelate.getName()));
this.localFontText.filters = [this.pixelateShader];

this.bitmapFontText = this.game.add.bitmapText(this.game.world.centerX, this.game.world.centerY + 100, Assets.BitmapFonts.FontsFontFnt.getName(), 'Bitmap Fonts + Filters .js (Blur here)!', 40);
this.bitmapFontText.anchor.setTo(0.5);

this.blurXFilter = this.game.add.filter(Assets.Scripts.ScriptsBlurX.getName()) as Phaser.Filter.BlurX;
this.blurXFilter.blur = 8;
this.blurYFilter = this.game.add.filter(Assets.Scripts.ScriptsBlurY.getName()) as Phaser.Filter.BlurY;
this.blurYFilter.blur = 2;

this.bitmapFontText.filters = [this.blurXFilter, this.blurYFilter];

this.mummySpritesheet = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY + 175, Assets.Spritesheets.SpritesheetsMetalslugMummy374518.getName());
this.mummySpritesheet.animations.add('walk');
this.mummySpritesheet.animations.play('walk', 30, true);

this.sfxAudiosprite = this.game.add.audioSprite(Assets.Audiosprites.AudiospritesSfx.getName());

// This is an example of how you can lessen the verbosity
let availableSFX = Assets.Audiosprites.AudiospritesSfx.Sprites;
this.sfxLaserSounds = [
    availableSFX.Laser1,
    availableSFX.Laser2,
    availableSFX.Laser3,
    availableSFX.Laser4,
    availableSFX.Laser5,
    availableSFX.Laser6,
    availableSFX.Laser7,
    availableSFX.Laser8,
    availableSFX.Laser9
];

this.game.sound.play(Assets.Audio.AudioMusic.getName(), 0.2, true);

this.backgroundTemplateSprite.inputEnabled = true;
this.backgroundTemplateSprite.events.onInputDown.add(() => {
    this.sfxAudiosprite.play(Phaser.ArrayUtils.getRandomItem(this.sfxLaserSounds));
});

this.game.camera.flash(0x000000, 1000);
*/
