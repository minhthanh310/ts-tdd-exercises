import Frame from './frame';

class Game {
  static PLAY_FRAMES_COUNT = 10;

  frames: Array<Frame>;
  isStarted: boolean;
  isEnded: boolean;

  constructor() {
    this.frames = [];
    this.isStarted = false;
    this.isEnded = false;
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
        currentFrame.playBall(pinKnocked);
        if (currentFrame.isEnded) {
          if (this.frames.length < Game.PLAY_FRAMES_COUNT || currentFrame.hasSpare || currentFrame.hasStrike) {
            this.addFrame(new Frame());
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
