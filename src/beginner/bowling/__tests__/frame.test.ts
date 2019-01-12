import Frame from '../frame';

test('Frame should have 2 balls', () => {
  expect(Frame.BALL_COUNT).toBe(2);
});

test('Should record score = pins knocked down', () => {
  let frame = new Frame();
  frame.playBall(3);
  expect(frame.getScore()).toBe(3);
});

test('If ball 1 knock down 10 pins, frame should end', () => {
  let frame = new Frame();
  frame.playBall(10);
  expect(frame.isEnded).toBe(true);
});

test('If 2 balls played, frame should end', () => {
  let frame = new Frame();
  frame.playBall(1);
  frame.playBall(3);
  expect(frame.isEnded).toBe(true);
});

test('Score should not be recorded if frame ended', () => {
  let frame1 = new Frame();
  frame1.playBall(10);
  expect(frame1.isEnded).toBe(true);
  frame1.playBall(8);
  expect(frame1.getScore()).toBe(10);

  let frame2 = new Frame();
  frame2.playBall(2);
  frame2.playBall(4);
  expect(frame1.isEnded).toBe(true);
  frame2.playBall(5);
  expect(frame2.getScore()).toBe(6);
});

test('If pins knocked down surpass 10, should not count score and ball played', () => {
  let frame = new Frame();
  frame.playBall(15);
  expect(frame.ballsPlayed).toBe(0);
  expect(frame.getScore()).toBe(0);

  frame.playBall(5);
  frame.playBall(20);
  expect(frame.ballsPlayed).toBe(1);
  expect(frame.getScore()).toBe(5);
});

test('Score should be accumulated in the frame', () => {
  let frame = new Frame();
  frame.playBall(2);
  frame.playBall(8);
  expect(frame.getScore()).toBe(10);
});

test('Second ball of the frame should not be recorded if the score exceed 10', () => {
  let frame = new Frame();
  frame.playBall(7);
  frame.playBall(8);
  expect(frame.getScore()).toBe(7);
});
