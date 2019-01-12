import Game from '../game';
import Frame from '../frame';

test('Score should accumulated accross frames', () => {
  let game = new Game();
  game.start();
  game.playBall(3);
  game.playBall(4);
  expect(game.getScore()).toBe(7);

  game.playBall(5);
  game.playBall(2);
  expect(game.getScore()).toBe(14);
});

test('Game should start with a new frame', () => {
  let game = new Game();
  game.start();

  expect(game.getFrames()).toHaveLength(1);
});

test('Game should not add new frame if game not started', () => {
  let game = new Game();
  game.addFrame(new Frame());

  expect(game.getFrames()).toHaveLength(0);
});

test('No ball should be recorded if game not started yet', () => {
  let game = new Game();
  game.playBall(3);
  expect(game.getScore()).toBe(0);
  game.playBall(4);
  expect(game.getScore()).toBe(0);
  expect(game.getFrames()).toHaveLength(0);
});

test('Game should not add new frame if current frame is not ended yet', () => {
  let game = new Game();
  game.start();

  game.playBall(3);
  expect(game.getFrames()).toHaveLength(1);
});

test('Game should add new frame if current frame ended', () => {
  let game = new Game();
  game.start();

  game.playBall(3);
  game.playBall(4);
  expect(game.getFrames()).toHaveLength(2);

  game.playBall(10);
  expect(game.getFrames()).toHaveLength(3);
});

test('Game should end with 10 frames if 10th frame not performs Strike or Spare', () => {
  let game1 = new Game();
  game1.start();
  for (let i = 0; i < Game.PLAY_FRAMES_COUNT - 1; i++) {
    game1.playBall(1);
    game1.playBall(1);
  }
  game1.playBall(3);
  game1.playBall(4);
  expect(game1.getFrames()).toHaveLength(10);
  expect(game1.isEnded).toBe(true);

  let game2 = new Game();
  game2.start();
  for (let i = 0; i < Game.PLAY_FRAMES_COUNT - 1; i++) {
    game2.playBall(10);
  }
  game2.playBall(3);
  game2.playBall(4);
  expect(game2.getFrames()).toHaveLength(10);
  expect(game2.isEnded).toBe(true);
});
