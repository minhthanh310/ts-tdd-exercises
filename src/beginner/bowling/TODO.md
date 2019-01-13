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

(number on the right side = the order I resolve test cases)

- 1. Should record score = pins knocked down (2)
- 2. Frame should have 2 balls (1)
- 3. Score should accumulated accross frames (9)
- 4. Score should not record if play more than 2 balls per frame (3) (replaced by 5, 6)
- 5. If ball 1 knock down 10 pins, frame should end (4)
- 6. If 2 balls played, frame should end (5)
- 7. Score should not be recorded if frame ended (6)
- 8. Score should be accumulated in the frame (8)
- 9. If pins knocked down surpass 10, should not count score and ball played (7)
- 10. Game should add new frame if current frame ended (14)
- 11. Game should start with a new frame (10)
- 12. Game should not add new frame if game not started (11)
- 13. Game should not add new frame if current frame is not ended yet (13)
- 14. No ball should be recorded if game not started yet (12)
- 15. Game should end with 10 frames if 10th frame not performs Strike or Spare (15)
- 16. Game should end with 10 frames and 1 balls if 10th frame performs Spare (17)
- 17. Game should end with 10 frames and 11th frame with 2 balls if 10th frame performs Strike and 11th frame not performs Strike (18)
- 18. Game should end with 10 frames and 11th frame with 1 ball, 12th frame with 1 ball if 10th frame performs Strike and 11th frame also performs Strike (19)
- 19. Record bonus point correctly if Spare happened (20)
- 20. Record bonus point correctly if Strike happened (21)
- 21. Second ball of the frame should not be recorded if the score exceed 10 (16)
- 22. Record bonus point correctly if Strike happened and Strike happened again (22)

## Test cases by uncle Bob:

- Gutter game scores zero - When you roll all misses, you get a total score of zero
- All ones scores 20 - When you knock down one pin with each ball, your total score is 20
- A spare in the first frame, followed by three pins, followed by all misses scores 16
- A strike in the first frame, followed by three and then four pins, followed by all misses, scores 24
- A perfect game (12 strikes) scores 300

## How was it?

- I feel good, very confident because test cases keep passing (even when they fail I know they are doing their job)
- However with the test cases I drew, I feel they are somewhat too focus on the details of the problem. I do not feel my algorithms is general enough
- I think test cases should be generalized too, to really touch the core of the problem
- I feel the progress I made on product code is a bit too fast too, not sure I missed some test cases or not...
- In the end, all my test cases passed, and 4 test cases by Uncle Bob passed too... except for the last case. And I feel I will have to remake the algorithms because I do not know where it start to fail :(
- Oh but surprisingly, after some minor refactor it works! I wrote a wrong test case before (provide it wrong expect value), so it was falsy passed (I remembered I was surprise how can it passed, but ignored it)
