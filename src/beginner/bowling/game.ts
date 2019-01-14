import Frame from './frame';

class Game {
  static PLAY_FRAMES_COUNT: number = 10;
  static STRIKE_BALLS_REWARD: number = 2;
  static SPARE_BALLS_REWARD: number = 1;

  frames: Array<Frame>;
  isStarted: boolean;
  isEnded: boolean;
  extraBallsLeft: number;
  bonusFactors: Array<number>;

  constructor() {
    this.frames = [];
    this.isStarted = false;
    this.isEnded = false;
    this.extraBallsLeft = 0;

    let maxBonus = Game.STRIKE_BALLS_REWARD > Game.SPARE_BALLS_REWARD ? Game.STRIKE_BALLS_REWARD : Game.SPARE_BALLS_REWARD;
    this.bonusFactors = new Array<number>(maxBonus);
    for (let i: number = 0; i < maxBonus; i++) {
      this.bonusFactors[i] = 0;
    }
  }

  start() {
    this.isStarted = true;
    this.frames.push(new Frame());
  }

  addFrame(frame: Frame): void {
    if (this.isStarted) {
      this.frames.push(frame);
    }
  }

  playBall(pinKnocked: number): void {
    if (this.isStarted && this.frames.length > 0) {
      let currentFrame = this.frames[this.frames.length - 1];
      if (currentFrame) {
        if (currentFrame.playBall(pinKnocked, this.getCurrentBonusFactor())) {
          this.shiftBonusFactor();
          if (this.frames.length > Game.PLAY_FRAMES_COUNT && this.extraBallsLeft > 0) {
            this.extraBallsLeft--;
          }

          if (currentFrame.isEnded) {
            this.addBonusFactor(currentFrame);

            if (this.frames.length < Game.PLAY_FRAMES_COUNT) {
              this.addFrame(new Frame());
            } else if (this.frames.length === Game.PLAY_FRAMES_COUNT) {
              if (currentFrame.hasSpare) {
                this.extraBallsLeft = Game.SPARE_BALLS_REWARD;
                this.addFrame(new Frame(this.extraBallsLeft, true));
              } else if (currentFrame.hasStrike) {
                this.extraBallsLeft = Game.STRIKE_BALLS_REWARD;
                this.addFrame(new Frame(this.extraBallsLeft, true));
              } else {
                this.isEnded = true;
              }
            } else if (this.frames.length > Game.PLAY_FRAMES_COUNT && this.extraBallsLeft > 0) {
              this.addFrame(new Frame(this.extraBallsLeft, true));
            } else {
              this.isEnded = true;
            }
          }
        }
      }
    }
  }

  getCurrentBonusFactor(): number {
    return this.bonusFactors[0];
  }

  shiftBonusFactor(): void {
    for (let i: number = 0; i < this.bonusFactors.length - 1; i++) {
      this.bonusFactors[i] = this.bonusFactors[i + 1];
    }
    this.bonusFactors[this.bonusFactors.length - 1] = 0;
  }

  addBonusFactor(currentFrame: Frame): void {
    if (currentFrame.isEnded && !currentFrame.isExtra) {
      let rewardBalls = 0;
      if (currentFrame.hasStrike) {
        rewardBalls = Game.STRIKE_BALLS_REWARD;
      } else if (currentFrame.hasSpare) {
        rewardBalls = Game.SPARE_BALLS_REWARD;
      }

      for (let i: number = 0; i < rewardBalls; i++) {
        this.bonusFactors[i] += 1;
      }
    }
  }

  getFrames(): Array<Frame> {
    return this.frames;
  }

  getScore(): number {
    return this.frames.reduce((sum, frame) => sum + frame.getScore(), 0);
  }
}

export default Game;
