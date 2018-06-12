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
<img src="/animation/bunny.svg" alt="Cute Bunny" id="bunny" />`,
  },
  twitter: {
    name: 'Twitter Header',
    features: [
      'complex',
      'properties',
    ],
    worklet: `registerAnimator('twitter-header', class {
  constructor(options) {
  }

  animate(currentTime, effect) {
    effect.localTime = currentTime;
  }
});

/*
Copyright 2016 Google, Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/`,
    js: `const scrollSource = document.body;
const bar = document.querySelector('.bar');
const avatar = document.querySelector('.profile .avatar');
const follow = document.querySelector('.profile .follow');
const name = document.querySelector('.profile .name');
const timeRange = 1000;
const scrollTimeline = new ScrollTimeline({scrollSource, timeRange});

[ '--avatar-size',
  '--avatar-border',
  '--header-height',
  '--font-base',
  '--bar-height',
  '--spacer',
].forEach(name => {
  CSS.registerProperty({
    name,
    syntax: '<length>',
    initialValue: '0px',
    inherits: true
  });
});

const barEffect = new KeyframeEffect(
  bar,
  [
    {opacity: 0},
    {opacity: 1},
  ],
  {
    duration: 0,
    fill: 'both',
  }
);

const avatarEffect = new KeyframeEffect(
  avatar,
  [
    {transform: 'translateY(0) scale(1)'},
    {transform: 'translateY(0px) scale(0)', offset: 0},
    {transform: 'translateY(0px) scale(0)'},
  ],
  {
    duration: timeRange,
    fill: 'both',
  }
);
new WorkletAnimation(
  'twitter-header',
  avatarEffect,
  scrollTimeline,
  []
).play();

const followEffect = new KeyframeEffect(
  follow,
  [
    {transform: 'translateY(0)'},
    {transform: 'translateY(0)', offset: 0},
    {transform: 'translateY(0px)'},
  ],
  {
    duration: timeRange,
    fill: 'both',
  }
);
new WorkletAnimation(
  'twitter-header',
  followEffect,
  scrollTimeline,
  []
).play();

const nameEffect = new KeyframeEffect(
  name,
  [
    {transform: 'translateY(0)'},
    {transform: 'translateY(0)', offset: 0},
    {transform: 'translateY(0) translateX(0px)', offset: 0},
    {transform: 'translateY(0px) translateX(0px)'},
  ],
  {
    duration: timeRange,
    fill: 'both',
  }
);
new WorkletAnimation(
  'twitter-header',
  nameEffect,
  scrollTimeline,
  []
).play();

function updateTimings() {
  const scrollSourceStyles = document.body.computedStyleMap();
  const viewportHeight = scrollSource.clientHeight;
  const maxScroll = scrollSource.scrollHeight - viewportHeight;

  const avatarDistanceFromTop = scrollSourceStyles.get('--header-height').value / 2 - scrollSourceStyles.get('--avatar-size').value / 2 - scrollSourceStyles.get('--avatar-border').value;
  const timeWhenAvatarTouchesTop = avatarDistanceFromTop / maxScroll * timeRange;
  const maxAvatarOffset = maxScroll - avatarDistanceFromTop;
  const targetAvatarScale = scrollSourceStyles.get('--bar-height').value / (scrollSourceStyles.get('--avatar-size').value + scrollSourceStyles.get('--avatar-border').value * 2);

  const avatarEffectKeyFrames = avatarEffect.getKeyframes();
  avatarEffectKeyFrames[1].transform = \`translateY(0px) scale(\${targetAvatarScale})\`;
  avatarEffectKeyFrames[1].offset = timeWhenAvatarTouchesTop/timeRange;
  avatarEffectKeyFrames[2].transform = \`translateY(\${maxAvatarOffset}px) scale(\${targetAvatarScale})\`;
  avatarEffect.setKeyframes(avatarEffectKeyFrames);

  console.log(timeWhenAvatarTouchesTop);
  barEffect.duration = timeWhenAvatarTouchesTop;

  const followDistanceFromTop = scrollSourceStyles.get('--header-height').value / 2 + scrollSourceStyles.get('--spacer').value/2;
  const timeWhenFollowTouchesTop = followDistanceFromTop / maxScroll * timeRange;
  const maxFollowOffset = maxScroll - followDistanceFromTop;
  const followEffectKeyFrames = followEffect.getKeyframes();
  followEffectKeyFrames[1].offset = timeWhenFollowTouchesTop/timeRange;
  followEffectKeyFrames[2].transform = \`translateY(\${maxFollowOffset}px)\`;
  followEffect.setKeyframes(followEffectKeyFrames);

  const nameDistanceFromTop = name.offsetTop - scrollSourceStyles.get('--spacer').value;
  const timeWhenNameTouchesTop = nameDistanceFromTop / maxScroll * timeRange;
  const maxNameOffset = maxScroll - nameDistanceFromTop;
  const nameEffectKeyFrames = nameEffect.getKeyframes();
  const nameLeftOffset = scrollSourceStyles.get('--bar-height').value + scrollSourceStyles.get('--spacer').value/2;
  nameEffectKeyFrames[1].offset = timeWhenAvatarTouchesTop/timeRange;
  nameEffectKeyFrames[2].transform = \`translateY(0) translateX(\${nameLeftOffset}px)\`;
  nameEffectKeyFrames[2].offset = timeWhenNameTouchesTop/timeRange;
  nameEffectKeyFrames[3].transform = \`translateY(\${maxNameOffset}px) translateX(\${nameLeftOffset}px)\`;
  nameEffect.setKeyframes(nameEffectKeyFrames);
}
updateTimings();
window.addEventListener('resize', _ => updateTimings());`,
    css: `* {
  box-sizing: border-box;
}
/* Colors */
:root {
  --light-blue: rgb(230, 236, 240);
  --white: white;
  --grey: rgb(101, 119, 134);
  --light-grey: rgb(204, 214, 221);
  --blue: rgb(27, 149, 224);
  --black: rgb(20, 23, 26);
}

/* Dimensions */
:root {
  --avatar-size: 140px;
  --avatar-border: 4px;
  --header-height: 500px;
  --font-base: 15px;
  --bar-height: 50px;
  --spacer: 10px;
  --author-size: 50px;
}

html, body {
  margin: 0;
  border: 0;
  padding: 0;
  min-height: 100vh;
  overflow-x: hidden;
  background-color: var(--light-blue);

  font-family: Helvetica;
  color: var(--black);
  font-size: var(--font-base);
}

body {
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  height: 100vh;
  overflow-y: auto;
  backface-visibility: hidden;
}

a {
  text-decoration: none;
  color: var(--blue);
}

.bar {
  background-color: var(--white);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--bar-height);
  box-shadow: var(--grey) 0px 0px 4px;
  z-index: 2;
}

.profile, .tweets {
  background-color: var(--white);
  margin-bottom: calc(2 * var(--spacer));
}

.profile {
  position: relative;
  min-height: var(--header-height);
  background-image: url('/animation/landscape.svg');
  background-size: auto calc(var(--header-height) / 2);
  background-position: 50% 0%;
  background-repeat: no-repeat;
  padding: var(--spacer);
  padding-top: 0;

  display: flex;
  flex-direction: column;
}

.profile > * {
  margin: 0;
}

.profile .avatar {
  box-sizing: content-box;
  width: var(--avatar-size);
  height: var(--avatar-size);
  border-radius: 50%;
  border: var(--avatar-border) solid var(--white);
  margin-left: calc(var(--avatar-border) * -1);
  margin-top: calc(var(--header-height) / 2 - var(--avatar-size) / 2 - var(--avatar-border));
  margin-bottom: var(--spacer);
  transform-origin: var(--avatar-border) 0%;
  z-index: 3;
  background-color: var(--light-grey);
}

.profile .name {
  font-size: calc(var(--font-base) * 4/3);
  position: relative;
  z-index: 3;
}

.profile .handle {
  font-size: var(--font-base);
  color: var(--grey);
  margin-bottom: var(--font-base);
  font-weight: normal;
}

.profile .description {
  flex-grow: 1;
}

.profile .stats, .profile .meta {
  color: var(--grey);
  display: flex;
  flex-direction: row;
}

.profile .meta {
  margin: calc(1.5 * var(--spacer)) 0;
}

.profile .location, .profile .homepage {
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
}

.profile .location:before, .profile .homepage:before {
  display: inline-block;
  content: '';
  width: 1.3em;
  height: 1.3em;
  margin-right: 0.2em;
}

// .profile .homepage:before {
//   margin-left: calc(2* var(--spacer));
//   background-image: url('/animation/homepage.svg');
// }

.profile .stats > * {
  font-weight: bold;
  color: var(--black);
  margin-right: 0.2em;
}

.profile .followers {
  margin-left: calc(2 * var(--spacer));
}

.profile .follow {
  position: absolute;
  z-index: 3;
  color: var(--blue);
  border: 1px solid var(--blue);
  border-radius: calc(1em + var(--spacer));
  font-weight: bold;
  font-size: calc(var(--font-base) * 3/3);
  padding: var(--spacer) calc(2 * var(--spacer));
  top: calc(var(--header-height) / 2 + var(--spacer));
  right: var(--spacer);
}

.tweet {
  border-bottom: 1px solid var(--light-grey);
  padding: var(--spacer);
  padding-left: calc(var(--author-size) + 2 * var(--spacer));
}

.tweet .meta {
  color: var(--grey);
}

.tweet .meta .name {
  font-weight: bold;
  color: var(--black);
}

.tweet .meta .handle:after {
  content: '•';
  margin-left: 0.2em;
}

.tweet .avatar {
  width: var(--author-size);
  height: var(--author-size);
  margin: 0;
  margin-left: calc((var(--author-size) + var(--spacer)) * -1);
  float: left;
  border-radius: 50%;
  background-color: var(--light-grey);
}

.tweet .media {
  margin: var(--spacer) 0;
  border: 1px solid var(--light-grey);
  border-radius: 12px; /* FIXME */
  overflow: hidden;
  padding: var(--spacer);
}

.tweet .media .domain {
  color: var(--grey);
}

.tweet .media img {
  margin-top: calc(-1 * var(--spacer));
  margin-left: calc(-1 * var(--spacer));
  margin-bottom: var(--spacer);
  width: 100%;
  border-bottom: 1px solid var(--light-grey);
}

.tweet .media p {
  margin: 0;
}

.tweet .media p + p{
  margin-top: var(--spacer);
}

/*
Copyright 2016 Google, Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/`,
    html: `<div class="bar">
</div>
<header class="profile">
  <img src="/animation/bunny.svg" class="avatar">
  <h1 class="name">Houdini Bunny</h1>
  <h2 class="handle">@HoudiniBunny</h2>
  <section class="description">
    Makes cute web technology awesome
    <br/>
    <br/>
    <a href="#">houdini.glitch.me</a>
  </section>
  <section class="meta">
    <span class="location">🎩</span>
    <a class="homepage" href="https://snugug.com">snugug.com</a>
  </section>
  <section class="stats">
    <span class="following">1,337</span> Following
    <span class="followers">9,659</span> Followers
  </section>
  <button class="follow">Follow</button>
</header>
<section class="tweets">
  <section class="tweet">
    <img src="/animation/bunny.svg" class="avatar">
    <section class="meta"> <span class="name">Houdini Bunny</span>
      <span class="handle">@HoudiniBunny</span>
      <span class="date">Dec 27</span>
    </section>
    🐰 New Carrot-🥕 Carrots are yummy! You should eat some
  </section>
  <section class="tweet">
    <img src="/animation/bunny.svg" class="avatar">
    <section class="meta">
      <span class="name">Surma</span>
      <span class="handle">@DasSurma</span>
      <span class="date">Dec 27</span>
    </section>
    🐰 New post-🎩 I'm making magic now!
  </section>
  <section class="tweet">
    <img src="/animation/bunny.svg" class="avatar">
    <section class="meta"> <span class="name">Houdini Bunny</span>
      <span class="handle">@HoudiniBunny</span>
      <span class="date">Dec 27</span>
    </section>
    🐰 New Carrot-🥕 Carrots are yummy! You should eat some
  </section>
  <section class="tweet">
    <img src="/animation/bunny.svg" class="avatar">
    <section class="meta">
      <span class="name">Surma</span>
      <span class="handle">@DasSurma</span>
      <span class="date">Dec 27</span>
    </section>
    🐰 New post-🎩 I'm making magic now!
  </section>
  <section class="tweet">
    <img src="/animation/bunny.svg" class="avatar">
    <section class="meta"> <span class="name">Houdini Bunny</span>
      <span class="handle">@HoudiniBunny</span>
      <span class="date">Dec 27</span>
    </section>
    🐰 New Carrot-🥕 Carrots are yummy! You should eat some
  </section>
  <section class="tweet">
    <img src="/animation/bunny.svg" class="avatar">
    <section class="meta">
      <span class="name">Surma</span>
      <span class="handle">@DasSurma</span>
      <span class="date">Dec 27</span>
    </section>
    🐰 New post-🎩 I'm making magic now!
  </section>
  <section class="tweet">
    <img src="/animation/bunny.svg" class="avatar">
    <section class="meta"> <span class="name">Houdini Bunny</span>
      <span class="handle">@HoudiniBunny</span>
      <span class="date">Dec 27</span>
    </section>
    🐰 New Carrot-🥕 Carrots are yummy! You should eat some
  </section>
  <section class="tweet">
    <img src="/animation/bunny.svg" class="avatar">
    <section class="meta">
      <span class="name">Surma</span>
      <span class="handle">@DasSurma</span>
      <span class="date">Dec 27</span>
    </section>
    🐰 New post-🎩 I'm making magic now!
  </section>
</section>`,
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
