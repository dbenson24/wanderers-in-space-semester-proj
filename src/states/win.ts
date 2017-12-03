import * as Assets from '../assets';

export default class Win extends Phaser.State {
  private backgroundTemplateSprite: Phaser.TileSprite = null
  private winStr: string = "YOU WIN!"
  private restartKey: Phaser.Key

  public create(): void { 
    this.game.stage.backgroundColor = '#071924'
    const bgImg = Assets.Images.ImagesSpaceBackground.getName()
    this.backgroundTemplateSprite = this.game.add.tileSprite(0,
      this.game.height - this.game.cache.getImage(bgImg).height,
      this.game.width,
      this.game.cache.getImage(bgImg).height,
      bgImg
    )

    const startY = (this.game.world.height - this.winStr.length * 10) - 20
    this.game.add.text(16, startY, this.winStr, { font: '13px Anonymous Pro', fill: '#aea' })

    this.restartKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)

    this.backgroundTemplateSprite.inputEnabled = true;

    this.game.add.button(this.game.world.centerX - 100, 
                         this.game.world.centerY + 50,
                         Assets.Images.SpritesheetsStartgame2.getName(),
                         this.goNext, this, 2, 1, 0);
  }

  public update(): void {
    if (this.restartKey.isDown) { 
      this.goNext();
    }
  }

  private goNext(): void { 
    this.game.state.start('gameStart');
  }
}
