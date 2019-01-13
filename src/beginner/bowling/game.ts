import Frame from './frame';

class Game {
  static PLAY_FRAMES_COUNT = 10;

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
    this.bonusFactors = [0, 0];
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
        currentFrame.playBall(pinKnocked, this.bonusFactors[0]);

        this.bonusFactors[0] = this.bonusFactors[1];
        this.bonusFactors[1] = 0;

        if (this.extraBallsLeft > 0) {
          this.extraBallsLeft--;
        }
        if (currentFrame.isEnded) {
          if (currentFrame.hasStrike) {
            this.bonusFactors[0] += 1;
            this.bonusFactors[1] += 1;
          } else if (currentFrame.hasSpare) {
            this.bonusFactors[0] += 1;
          }
          if (this.frames.length < Game.PLAY_FRAMES_COUNT) {
            this.addFrame(new Frame(2));
          } else if (this.frames.length === Game.PLAY_FRAMES_COUNT) {
            if (currentFrame.hasSpare) {
              this.addFrame(new Frame(1));
              this.extraBallsLeft = 1;
              this.bonusFactors = [0, 0];
            } else if (currentFrame.hasStrike) {
              this.addFrame(new Frame(2));
              this.extraBallsLeft = 2;
              this.bonusFactors = [0, 0];
            } else {
              this.isEnded = true;
            }
          } else if (this.frames.length > Game.PLAY_FRAMES_COUNT && this.extraBallsLeft > 0) {
            let ballsCount = this.extraBallsLeft > Frame.BALL_COUNT ? Frame.BALL_COUNT : this.extraBallsLeft;
            this.addFrame(new Frame(ballsCount));
          } else {
            this.isEnded = true;
          }
        }
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
