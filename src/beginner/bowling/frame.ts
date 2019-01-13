class Frame {
  static BALL_COUNT: number = 2;
  static MAX_PINS: number = 10;

  score: number;
  bonusScore: number;
  ballsPlayed: number;
  isEnded: boolean;
  hasStrike: boolean;
  hasSpare: boolean;
  maxBalls: number;

  constructor(maxBalls: number = Frame.BALL_COUNT) {
    this.score = 0;
    this.bonusScore = 0;
    this.ballsPlayed = 0;
    this.isEnded = false;
    this.hasStrike = false;
    this.hasSpare = false;
    this.maxBalls = maxBalls;
  }

  playBall(pinKnocked: number, bonusFactor = 0): void {
    if (!this.isEnded && pinKnocked <= Frame.MAX_PINS && this.score + pinKnocked <= Frame.MAX_PINS) {
      this.score += pinKnocked;
      this.bonusScore += pinKnocked * bonusFactor;

      this.ballsPlayed++;
      this.isEnded = this.ballsPlayed === this.maxBalls || (this.ballsPlayed === 1 && pinKnocked === Frame.MAX_PINS);
      this.hasStrike = pinKnocked === Frame.MAX_PINS;
      this.hasSpare = this.ballsPlayed === this.maxBalls && this.score === Frame.MAX_PINS;
    }
  }

  getScore(): number {
    return this.score + this.bonusScore;
  }
}

export default Frame;
