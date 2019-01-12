# Bowling Game Rule:

- 10 frames
- Each frame offers 2 balls
- For each frame, points gained = number of pins knocked down
- If first ball performs a Strike, ignore the second ball
- Strike: knock down all 10 pins in a single ball. Get bonus points reward equal points gained in the next 2 balls
- Spare: knock down all 10 pins in 2 balls. Get bonus points reward equal points gained in the next ball
- At 10th frame, if performs a Strike got bonus 2 balls, if performs a Spare got bonus 1 ball (only count bonus point)

# Example:

- Frame 1, ball 1: 10 pins (strike)
  Frame 2, ball 1: 3 pins
  Frame 2, ball 2: 6 pins
  The total score from these throws is:
  Frame one: 10 + (3 + 6) = 19
  Frame two: 3 + 6 = 9
  TOTAL = 28

- Frame 1, ball 1: 7 pins
  Frame 1, ball 2: 3 pins (spare)
  Frame 2, ball 1: 4 pins
  Frame 2, ball 2: 2 pins
  The total score from these throws is:
  Frame one: 7 + 3 + 4 (bonus) = 14
  Frame two: 4 + 2 = 6
  TOTAL = 20

# TODO:
