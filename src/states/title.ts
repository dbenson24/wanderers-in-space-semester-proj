import * as Assets from '../assets';

export default class Title extends Phaser.State {
  private backgroundTemplateSprite: Phaser.TileSprite = null
  private startKey: Phaser.Key
  private aboutInfo: string[]

  // This is any[] not string[] due to a limitation in TypeScript at the moment;
  // despite string enums working just fine, they are not officially supported so we trick the compiler into letting us do it anyway.

  public create(): void {
    this.game.stage.backgroundColor = '#071924'
    const bgImg = Assets.Images.ImagesSpaceBackground.getName()
    this.backgroundTemplateSprite = this.game.add.tileSprite(0,
      this.game.height - this.game.cache.getImage(bgImg).height,
      this.game.width,
      this.game.cache.getImage(bgImg).height,
      bgImg
    )

    // About text
    this.aboutInfo = [
      '\"Orbital Simulation\"',
      '',
      ' By: Derek Benson, Ge Gao, Robert Goodfellow',
      '',
      ' Developed with Phaser CE'
    ]

    const startY = (this.game.world.height - this.aboutInfo.length * 10) - 20
    for (let i = 0; i < this.aboutInfo.length; i++) {
      const offset: number = i * 10
      this.game.add.text(16, startY + offset, this.aboutInfo[i], { font: '13px Anonymous Pro', fill: '#aea' })
    }


    this.startKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)

    this.backgroundTemplateSprite.inputEnabled = true;

    this.game.add.button(this.game.world.centerX - 100, this.game.world.centerY + 50, Assets.Images.SpritesheetsStartgame2.getName(), this.goNext, this, 2, 1, 0)
    this.game.camera.flash(0x000000, 1000)
  }

  public update(): void {
    if (this.startKey.isDown) {
      this.goNext()
    }
  }

  private goNext(): void {
    this.game.state.start('intro')
  }
}



