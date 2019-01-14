class Frame {
  static BALL_COUNT: number = 2;
  static MAX_PINS: number = 10;

  score: number;
  bonusScore: number;
  ballsPlayed: number;
  pinsLeft: number;
  isEnded: boolean;
  hasStrike: boolean;
  hasSpare: boolean;
  maxBalls: number;
  isExtra: boolean;

  constructor(maxBalls: number = Frame.BALL_COUNT, isExtra: boolean = false) {
    this.score = 0;
    this.bonusScore = 0;
    this.ballsPlayed = 0;
    this.isEnded = false;
    this.hasStrike = false;
    this.hasSpare = false;
    this.maxBalls = maxBalls < Frame.BALL_COUNT ? maxBalls : Frame.BALL_COUNT;
    this.isExtra = isExtra;
    this.pinsLeft = Frame.MAX_PINS;
  }

  playBall(pinsKnocked: number, bonusFactor = 0): boolean {
    if (!this.isEnded && pinsKnocked <= this.pinsLeft) {
      this.pinsLeft -= pinsKnocked;
      this.score += this.isExtra ? 0 : pinsKnocked;
      this.bonusScore += pinsKnocked * bonusFactor;

      this.ballsPlayed++;
      this.isEnded = this.ballsPlayed === this.maxBalls || this.pinsLeft === 0;
      this.hasStrike = pinsKnocked === Frame.MAX_PINS;
      this.hasSpare = this.ballsPlayed === this.maxBalls && this.pinsLeft === 0;
      return true;
    }

    return false;
  }

  getScore(): number {
    return this.score + this.bonusScore;
  }
}

export default Frame;
