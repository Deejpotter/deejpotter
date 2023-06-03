import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import Phaser from 'phaser';

const aspectRatio = window.innerWidth / window.innerHeight;
const gameWidth = Math.min(800, window.innerWidth);
const gameHeight = Math.min(600, window.innerWidth / aspectRatio);

@Component({
  selector: 'app-mindscapes',
  templateUrl: './mindscapes.component.html',
  styleUrls: ['./mindscapes.component.scss']
})
export class MindscapesComponent implements AfterViewInit {
  @ViewChild('phaserCanvas', {static: false}) phaserCanvas!: ElementRef;
  private phaserGame!: Phaser.Game;

  ngAfterViewInit(): void {
    const phaserConfig: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: gameWidth,
      height: gameHeight,
      parent: this.phaserCanvas.nativeElement,
      scene: BrickBreakingScene,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: {y: 200},
        },
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      },
    };
    this.phaserGame = new Phaser.Game(phaserConfig);
    window.addEventListener('resize', this.onResize.bind(this));

  }

  onResize(): void {
    const width = this.phaserCanvas.nativeElement.clientWidth;
    const height = this.phaserCanvas.nativeElement.clientHeight;

    this.phaserGame.scale.resize(width, height);
  }

}

class BrickBreakingScene extends Phaser.Scene {
  private isGameOver = false;
  private paddle!: Phaser.Physics.Arcade.Image;
  private ball!: Phaser.Physics.Arcade.Image;

  preload() {
    this.load.image('ball', 'assets/mindscapes/ball.png');
    this.load.image('paddle', 'assets/mindscapes/paddle.png');
    this.load.image('brick', 'assets/mindscapes/brick.png');
  }

  create() {
    // Initialize game objects here
    this.cameras.main.setBackgroundColor('#FFFFFF');
    this.paddle = this.physics.add.image(this.scale.width / 2, this.scale.height * 0.9, 'paddle').setScale(0.5);
    this.paddle.setImmovable(true);
    this.paddle.setCollideWorldBounds(true);

    this.ball = this.physics.add.image(this.paddle.x, this.paddle.y - 50, 'ball');
    this.ball.setCollideWorldBounds(true);
    this.ball.setBounce(1);
    this.ball.setData('onPaddle', true);

    this.physics.add.collider(this.ball, this.paddle);
  }

  override update() {
    if (this.isGameOver) return;

    if (this.input.activePointer.isDown) {
      this.paddle.x = this.input.activePointer.x;
    }
    this.paddle.x = this.input.activePointer.x;

    if (this.ball.getData('onPaddle')) {
      this.ball.setX(this.paddle.x);

      if (this.input.activePointer.isDown) {
        this.ball.setVelocityY(-300);
        this.ball.setVelocityX(Phaser.Math.Between(-50, 50));
        this.ball.setData('onPaddle', false);
      }
    } else if (this.ball.y > this.paddle.y + 50) {
      this.isGameOver = true;
      // Game over, reset or show game over screen
    }
  }
}
