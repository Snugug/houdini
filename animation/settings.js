export default {
  parallax: {
    name: 'Parallax',
    features: [
      'basic',
      'options'
    ],
    worklet: `registerAnimator('parallax', class {
  constructor(options) {
    this._rate = options.rate;
  }

  animate(currentTime, effect) {
    effect.localTime = currentTime * this._rate;
  }
});`,
    js: `const scrollSource = document.scrollingElement;
const timeRange = 1000;
const scrollTimeline = new ScrollTimeline({scrollSource, timeRange});

const one = document.querySelector('#one');
const two = document.querySelector('#two');
const three = document.querySelector('#three');
const four = document.querySelector('#four');
const bunny = document.querySelector('#bunny');

new WorkletAnimation('parallax', new KeyframeEffect(
  one,
  [ {transform: 'translateY(0)'}, {transform: 'translateY(-200vh)'} ],
  { duration: timeRange }
), scrollTimeline, { rate: .25 }).play();

new WorkletAnimation('parallax', new KeyframeEffect(
  two,
  [ {transform: 'translateY(0)'}, {transform: 'translateY(-200vh)'} ],
  { duration: timeRange }
), scrollTimeline, { rate: 1 }).play();

new WorkletAnimation('parallax', new KeyframeEffect(
  three,
  [ {transform: 'translateY(0)', opacity: 1}, {transform: 'translateY(-200vh)', opacity: 0} ],
  { duration: timeRange }
), scrollTimeline, { rate: 2 }).play();

new WorkletAnimation('parallax', new KeyframeEffect(
  four,
  [ {transform: 'translateY(0)'}, {transform: 'translateY(-200vh)'} ],
  { duration: timeRange }
), scrollTimeline, { rate: 4 }).play();

new WorkletAnimation('parallax', new KeyframeEffect(
  bunny,
  [ {transform: 'translateY(0) scale(.25)', opacity: 0}, {transform: 'translateY(-200vh) scale(1)', opacity: 1} ],
  { duration: timeRange }
), scrollTimeline, { rate: 4 }).play();`,
    css: `div {
  height: 33vh;
  width: 33vw;
  margin-top: 25vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3em;
  color: white;
  text-shadow: 2px 2px black, -2px -2px black, -2px 2px black, 2px -2px black;
}

#one {
  background: rgba(255, 0, 0, .75);
  margin-left: 50vw;
}

#two {
  background: rgba(0, 255, 0, .75);
  margin-left: 33vw;
}

#three {
  background: rgba(0, 0, 255, .75);
  margin-left: 60vw;
}

#four {
  background: rgba(255, 0, 255, .75);
  margin-left: 10vw;
}`,
    html: `<div id="one">One</div>
<div id="two">Two</div>
<div id="three">Three</div>
<div id="four">Four</div>
<img src="bunny.svg" alt="Cute Bunny" id="bunny" />`,
  },
  twitter: {
    name: 'Twitter Header',
    features: [
      'complex',
      'properties',
    ],
    worklet: ``,
    js: ``,
    css: ``,
    html: ``,
  },
  custom: {
    name: 'Custom',
    features: [
      'custom',
    ],
    worklet: `registerAnimator('sample-animator', class {
  constructor(options) {
    // Called when a new animator is instantiated
    // Used to set stuff up for each use of an animator
  }
  animate(currentTime, effect) {
    // currentTime - The current time from the defined timeline
    // effect - Group of effects that this animation is working on

    // Animation frame logic goes here.
    // Usually something to the effect of setting the time of an effect
    effect.localTime = currentTime;
  }
});`,
    js: `// Element we want to animate
const elem = document.querySelector('#my-elem');
const scrollSource = document.scrollingElement;
const timeRange = 1000;
const scrollTimeline = new ScrollTimeline({
  scrollSource,
  timeRange,
});

const effectKeyframes = new KeyframeEffect(
  elem,
  [
    {transform: 'scale(1)'},
    {transform: 'scale(.25)'},
    {transform: 'scale(1)'}
  ],
  {
    duration: timeRange,
  },
);

new WorkletAnimation(
  'sample-animator',
  effectKeyframes,
  scrollTimeline,
  {},
).play();`,
    css: ``,
    html: `<div id="my-elem">Hello World</div>`,
  },
}
