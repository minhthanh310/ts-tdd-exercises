class Frame {
  static BALL_COUNT: number = 2;
  static MAX_PINS: number = 10;

  score: number;
  ballsPlayed: number;
  isEnded: boolean;
  hasStrike: boolean;
  hasSpare: boolean;

  constructor() {
    this.score = 0;
    this.ballsPlayed = 0;
    this.isEnded = false;
    this.hasStrike = false;
    this.hasSpare = false;
  }

  playBall(pinKnocked: number): void {
    if (!this.isEnded && pinKnocked <= Frame.MAX_PINS && this.score + pinKnocked <= Frame.MAX_PINS) {
      this.score += pinKnocked;
      this.ballsPlayed++;
      this.isEnded = this.ballsPlayed === Frame.BALL_COUNT || (this.ballsPlayed === 1 && pinKnocked === Frame.MAX_PINS);
      this.hasStrike = pinKnocked === Frame.BALL_COUNT;
      this.hasSpare = this.score === Frame.BALL_COUNT;
    }
  }

  getScore(): number {
    return this.score;
  }
}

export default Frame;
