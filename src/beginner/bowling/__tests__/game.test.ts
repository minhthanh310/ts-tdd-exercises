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

test('Game should end with 10 frames and 1 balls if 10th frame performs Spare', () => {
  let game = new Game();
  game.start();
  for (let i = 0; i < Game.PLAY_FRAMES_COUNT - 1; i++) {
    game.playBall(1);
    game.playBall(1);
  }
  game.playBall(4);
  game.playBall(6);
  expect(game.getFrames()).toHaveLength(11);
  expect(game.isEnded).toBe(false);
  game.playBall(5);
  expect(game.isEnded).toBe(true);
});

test('Game should end with 10 frames and 11th frame with 2 balls if 10th frame performs Strike and 11th frame not performs Strike', () => {
  let game = new Game();
  game.start();
  for (let i = 0; i < Game.PLAY_FRAMES_COUNT - 1; i++) {
    game.playBall(1);
    game.playBall(1);
  }
  game.playBall(10);
  expect(game.getFrames()).toHaveLength(11);
  expect(game.isEnded).toBe(false);
  game.playBall(7);
  expect(game.isEnded).toBe(false);
  game.playBall(2);
  expect(game.getFrames()).toHaveLength(11);
  expect(game.isEnded).toBe(true);
});

test('Game should end with 10 frames and 11th frame with 1 ball, 12th frame with 1 ball if 10th frame performs Strike and 11th frame also performs Strike', () => {
  let game = new Game();
  game.start();
  for (let i = 0; i < Game.PLAY_FRAMES_COUNT - 1; i++) {
    game.playBall(1);
    game.playBall(1);
  }
  game.playBall(10);
  expect(game.getFrames()).toHaveLength(11);
  expect(game.isEnded).toBe(false);
  game.playBall(10);
  expect(game.getFrames()).toHaveLength(12);
  expect(game.isEnded).toBe(false);
  game.playBall(10);
  expect(game.getFrames()).toHaveLength(12);
  expect(game.isEnded).toBe(true);
});

test('Record bonus point correctly if Spare happened', () => {
  let game = new Game();
  game.start();
  game.playBall(3);
  game.playBall(7);
  game.playBall(6);
  expect(game.getScore()).toBe(22);
});

test('Record bonus point correctly if Strike happened', () => {
  let game = new Game();
  game.start();
  game.playBall(10);
  game.playBall(7);
  game.playBall(2);
  expect(game.getScore()).toBe(28);
});

test('Record bonus point correctly if Strike happened and Strike happened again', () => {
  let game = new Game();
  game.start();
  game.playBall(10);
  game.playBall(10);
  game.playBall(5);
  game.playBall(3);
  expect(game.getScore()).toBe(51);
});

////////////////////////////
// Uncle Bob's test cases //
////////////////////////////

test('Gutter game scores zero - When you roll all misses, you get a total score of zero', () => {
  let game = new Game();
  game.start();
  for (let i = 0; i < Game.PLAY_FRAMES_COUNT; i++) {
    game.playBall(0);
    game.playBall(0);
  }
  expect(game.getScore()).toBe(0);
  expect(game.isEnded).toBe(true);
  expect(game.getFrames()).toHaveLength(10);
});

test('All ones scores 20 - When you knock down one pin with each ball, your total score is 20', () => {
  let game = new Game();
  game.start();
  for (let i = 0; i < Game.PLAY_FRAMES_COUNT; i++) {
    game.playBall(1);
    game.playBall(1);
  }
  expect(game.getScore()).toBe(20);
  expect(game.isEnded).toBe(true);
  expect(game.getFrames()).toHaveLength(10);
});

test('A spare in the first frame, followed by three pins, followed by all misses scores 16', () => {
  let game = new Game();
  game.start();
  game.playBall(3);
  game.playBall(7);
  game.playBall(3);
  game.playBall(0);
  expect(game.getScore()).toBe(16);
});

test('A strike in the first frame, followed by three and then four pins, followed by all misses, scores 24', () => {
  let game = new Game();
  game.start();
  game.playBall(10);
  game.playBall(3);
  game.playBall(4);
  game.playBall(0);
  expect(game.getScore()).toBe(24);
});

test('A perfect game (12 strikes) scores 300', () => {
  let game = new Game();
  game.start();
  for (let i = 0; i < Game.PLAY_FRAMES_COUNT; i++) {
    game.playBall(10);
  }
  game.playBall(10);
  game.playBall(10);
  expect(game.getScore()).toBe(300);
  expect(game.isEnded).toBe(true);
  expect(game.getFrames()).toHaveLength(12);
});
