registerAnimator('gradient', class {
  constructor(opts) {}

  animate(currentTime, effect) {
    console.log(currentTime);
    effect.localTime = currentTime;
  }
});
