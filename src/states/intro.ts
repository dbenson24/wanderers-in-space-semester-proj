import {Images} from '../assets'

import GameAdapter from '../globals/GameAdapter'

export default class Intro extends Phaser.State {
  private bgBack: any
  private bgMid: any
  private textContent: string[]
  private textObject: any
  private gameAdapter: GameAdapter
  private countdownNumber: number = 3
  private startLevelCounter: any
  private skipKey: Phaser.Key

  private line: string[] = [];
  private wordIndex: number = 0;
  private lineIndex: number = 0;
  readonly WORD_DELAY: number = 150;
  readonly LINE_DELAY: number = 600;


  public create(): void {
    this.gameAdapter = new GameAdapter()
    this.lineIndex = 0
    this.wordIndex = 0

    this.textContent = [
      'This is a Kerbal Space Program simulation where players are able to assemble',
      'their own spaceship and launch it into the space. The program is mainly',
      'divided into two phases: assembling phase, and launching phase.',
      'In the assembling phase, the user has the options of configuring several different',
      'rocket models that we built into the program, each with a different',
      'number of mass/fuel ratios.',
      'In the launching phase, the user is able to launch the rocket and guide it to orbit.',
      'Orbits will be dynamically calculated using Kepler’s laws/orbital mechanics.',
      'Have fun!'
    ]

    const backImg = Images.ImagesCyberpunkFarEdit3.getName()
    const midImg = Images.ImagesCyberpunkMid.getName()

    this.bgBack = this.game.add.tileSprite(0,
      this.game.height - this.game.cache.getImage(backImg).height,
      this.game.width,
      this.game.cache.getImage(backImg).height,
      backImg
    )

    this.bgMid = this.game.add.tileSprite(0,
      this.game.height - this.game.cache.getImage(midImg).height,
      this.game.width,
      this.game.cache.getImage(midImg).height,
      midImg
    )

    this.game.add.button(this.game.world.width - 150, this.game.world.height - 85, Images.SpritesheetsSkip.getName(), this.goNext, this, 2, 1, 0)
    this.skipKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)

    this.textObject = this.game.add.text(110, 32, '', { font: '13px Anonymous Pro', fill: '#19de65' })
    this.nextLine()
  }

  public update(): void {
    if (this.skipKey.isDown) {
      this.goNext()
    }
  }
  private goNext(): void {
    this.game.state.start('gameStart')
  }

  private nextLine() {
    if (this.lineIndex === this.textContent.length) {
      return this.countdownToStart()
    }

    this.line = this.textContent[this.lineIndex].split(' ')
    this.wordIndex = 0
    this.game.time.events.repeat(this.WORD_DELAY, this.line.length, this.nextWord, this)
    this.lineIndex++
  }

  private nextWord(): void {
    this.textObject.text = this.textObject.text.concat(this.line[this.wordIndex] + ' ')
    this.wordIndex++

    if (this.wordIndex === this.line.length) {
      this.textObject.text = this.textObject.text.concat('\n')
      this.game.time.events.add(this.LINE_DELAY, this.nextLine, this)
    }
  }


  private countdownToStart(): void {
    this.startLevelCounter = this.game.add.text(this.game.world.centerX, this.game.world.centerY, this.countdownNumber.toString(), { font: '82px Anonymous Pro', fill: '#fff' })

    const tween = this.game.add.tween(this.startLevelCounter).to(
      {alpha: 0}, 1000, Phaser.Easing.Linear.None, true, 0, 0, false
    )
    tween.onComplete.add(() => {
      this.countdownNumber--

      if (this.countdownNumber === 0)
        this.goNext()
      else
        this.countdownToStart()
    })
  }
}