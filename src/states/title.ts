import * as Assets from '../assets';
import { Physics, scaleModes } from 'phaser-ce';

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

    // This is any[] not string[] due to a limitation in TypeScript at the moment;
    // despite string enums working just fine, they are not officially supported so we trick the compiler into letting us do it anyway.
    private sfxLaserSounds: any[] = null;

    public create(): void {

        this.backgroundTemplateSprite = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, Assets.Images.ImagesBackgroundTemplate.getName());
        this.backgroundTemplateSprite.anchor.setTo(0.5);

        this.game.physics.startSystem(Phaser.Physics.P2JS);

        this.moveableMummy = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY+200, Assets.Spritesheets.SpritesheetsMetalslugMummy374518.getName());
        this.planetMummy = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, Assets.Spritesheets.SpritesheetsMetalslugMummy374518.getName());
        

        let p2 = this.game.physics.p2;

        p2.enableBody(this.moveableMummy, true);
        p2.enableBody(this.planetMummy, false);

        this.mummyBody = this.moveableMummy.body;
        this.mummyBody.data.mass = 10;
        this.mummyBody.collides(2);

        this.planetBody = this.planetMummy.body;
        this.planetBody.dynamic = false;
        this.planetBody.data.mass = 10000;
        this.planetBody.collides(1);


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

        let rawForce = .01 * (this.mummyBody.data.mass * this.planetBody.data.mass) / this.distanceBetween(this.mummyBody, this.planetBody);
        let angle = this.getAngleTo(this.mummyBody, this.planetBody);
        
        let forceX = rawForce * Math.cos(angle);
        let forceY = rawForce * Math.sin(angle);

        this.mummyBody.thrustRight(forceX);
        this.mummyBody.thrust(-forceY);
    }

    private distanceBetween(b1: Phaser.Physics.P2.Body, b2: Phaser.Physics.P2.Body): number {
        let p2 = this.physics.p2;
        let dx = p2.pxm(b1.x) - p2.pxm(b2.x);
        let dy = p2.pxm(b1.y) - p2.pxm(b2.y);
        if (Math.abs(dx) < 0.001) {
            dx = 0;
        }
        if (Math.abs(dy) < 0.001) {
            dy = 0;
        }
        return Math.sqrt((dx * dx) + (dy * dy));
    }

    private getAngleTo(source: Phaser.Physics.P2.Body, target: Phaser.Physics.P2.Body): number {
        let p2 = this.physics.p2;
        return Math.atan2(p2.pxm(target.y) - p2.pxm(source.y), p2.pxm(target.x) - p2.pxm(source.x));
    }
}