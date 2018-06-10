registerAnimator('gradient', class {
  constructor(options) {
  }

  animate(currentTime, effect) {
    console.log(currentTime);
    effect.localTime = currentTime;
  }
});
