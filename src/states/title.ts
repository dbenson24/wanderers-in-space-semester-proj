import * as Assets from '../assets';
import { Physics, scaleModes } from 'phaser-ce';

import {Point, GravityPhysics, GravityBody, BasicGravityBody} from "../physics";


export default class Title extends Phaser.State {
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
    
    private mummyBody: Phaser.Physics.P2.Body;
    private planetBody: Phaser.Physics.P2.Body;
    private collGroup: Phaser.Physics.P2.CollisionGroup;

    private gravityPhysics: GravityPhysics;

    // This is any[] not string[] due to a limitation in TypeScript at the moment;
    // despite string enums working just fine, they are not officially supported so we trick the compiler into letting us do it anyway.
    private sfxLaserSounds: any[] = null;

    public create(): void {

        let metersPerPixel = 20.0;
        let frameRate = 1.0/60.0;
        this.gravityPhysics = new GravityPhysics(metersPerPixel, frameRate);

        this.backgroundTemplateSprite = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, Assets.Images.ImagesBackgroundTemplate.getName());
        this.backgroundTemplateSprite.anchor.setTo(0.5);

        this.physics.startSystem(Phaser.Physics.P2JS);
        this.collGroup = this.physics.p2.createCollisionGroup();

        this.moveableMummy = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY + 200, Assets.Spritesheets.SpritesheetsMetalslugMummy374518.getName());
        this.planetMummy = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, Assets.Spritesheets.SpritesheetsMetalslugMummy374518.getName());
        
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

        let movingBody = new BasicGravityBody(this.moveableMummy, metersPerPixel, 0.1);
        let stationaryBody = new BasicGravityBody(this.planetMummy, metersPerPixel, 10000.0);

        this.gravityPhysics.addBody(movingBody);
        this.gravityPhysics.addBody(stationaryBody);

        movingBody.vx = Math.sqrt(stationaryBody.mass / this.gravityPhysics.distanceBetween(movingBody.loc, stationaryBody.loc));

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
    }
    public update(game: Phaser.Game) {
        this.gravityPhysics.updateBodyPositions();
    }



}
