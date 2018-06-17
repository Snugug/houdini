export default {
  circle: {
    name: 'Circle',
    features: [
      'basic',
      'input properties',
    ],
    worklet: `registerPaint('circle', class {
  static get inputProperties() { return ['--circle-color']; }
  paint(ctx, size, properties) {
    // Get fill color from property
    const color = properties.get('--circle-color');

    // Determine the center point and radius.
    const xCircle = size.width / 2;
    const yCircle = size.height / 2;
    const radiusCircle = Math.min(xCircle, yCircle) - 2.5;

    // Draw the circle \o/
    ctx.beginPath();
    ctx.arc(xCircle, yCircle, radiusCircle, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  }
});`,
    js: `CSS.registerProperty({
  name: '--circle-color',
  syntax: '<color>',
  inherits: true,
  initialValue: 'red',
});`,
    css: `.circle {
  --circle-color: green;
  background-image: paint(circle);
  height: 80vh;
  width: 100vw;
}`,
    html: `<div class="circle"></div>`,
  },
  tabs: {
    name: 'Tabs',
    features: [
      'basic',
      'input properties',
      'input arguments',
      'component system',
    ],
    worklet: `registerPaint('tab', class {
  static get inputProperties() {
    return [
      'background-color',
      'border-image-outset',
      '--tab-multiplier',
    ];
  }

  static get inputArguments() {
    return ['*'];
  }

  paint(ctx, size, props, args) {
    const bkg = props.get('background-color');
    const offset = parseInt(props.get('border-image-outset').toString());
    const m = props.get('--tab-multiplier').value;
    const sides = args[0].toString();

    const x = 10 * m;
    const y = 5.6 * m;

    if (sides === 'right' || sides === 'middle') {
      const yoff = size.height - offset - x;
      const xoff = offset - x;

      ctx.beginPath();
      ctx.moveTo(0.0 + xoff, x + yoff);
      ctx.lineTo(x + xoff, x + yoff);
      ctx.lineTo(x + xoff, 0.0 + yoff);
      ctx.bezierCurveTo(x + xoff, y + yoff, y + xoff, x + yoff, 0.0 + xoff, x + yoff);
      ctx.closePath();
      ctx.fillStyle = bkg;
      ctx.fill();
    }

    if (sides === 'left' || sides === 'middle') {
      const yoff = size.height - offset - x;
      const xoff = size.width - offset;

      ctx.beginPath();
      ctx.moveTo(x + xoff, x + yoff);
      ctx.lineTo(0.0 + xoff, x + yoff);
      ctx.lineTo(0.0 + xoff, 0.0 + yoff);
      ctx.bezierCurveTo(0.0 + xoff, y + yoff, y + xoff, x + yoff, x + xoff, x + yoff);
      ctx.closePath();
      ctx.fillStyle = bkg;
      ctx.fill();
    }
  }
});`,
    js: `CSS.registerProperty({
  name: '--tab-multiplier',
  syntax: '<number>',
  inherits: true,
  initialValue: 1,
});

const buttons = document.querySelectorAll('.tabs--tab button');
const sections = document.querySelectorAll('.tabs--section');

for (const button of buttons) {
  button.addEventListener('click', swap);
}

function swap(e) {
  const target = e.target;
  const targetFor = target.getAttribute('for');

  // Set Active attribute on section
  for (const section of sections) {
    if (section.id === targetFor) {
      section.setAttribute('data-active', true);
    } else {
      section.removeAttribute('data-active');
    }
  }

  // Set Active attribute on tab
  for (const button of buttons) {
    if (button === target) {
      button.closest('.tabs--tab').setAttribute('data-active', true);
    } else {
      button.closest('.tabs--tab').removeAttribute('data-active');
    }
  }
};`,
    css: `.tabs {
  --tab-multiplier: 1;
  --tab-margin: 1px;
  padding-left: 0;
  margin-bottom: 0;
}

.tabs--tab {
  background: red;
  border-image-outset: 30px;
  border-image-slice: 0 fill;
  border-image-source: paint(tab, middle);
  border-radius: 5px 5px 0 0;
  border-radius: 5px 5px 0 0;
  display: inline-block;
  font-size: 1em;
  padding: .15em .25em;
  position: relative;
  margin: 0
  padding: 0;
}

.tabs--tab:first-of-type {
  border-image-source: paint(tab, left);
  margin-right: var(--tab-margin);
}

.tabs--tab:last-of-type {
  border-image-source: paint(tab, right);
  margin-left: var(--tab-margin);
}

.tabs--tab:not(:first-of-type):not(:last-of-type) {
  margin-left: var(--tab-margin);
  margin-right: var(--tab-margin);
}

.tabs--tab:nth-of-type(2) {
  background: orange;
}

.tabs--tab:nth-of-type(3) {
  background: green;
  color: white;
}

.tabs--tab:nth-of-type(4) {
  background: blue;
  color: white;
}

.tabs--tab button {
  color: inherit;
  text-decoration: none;
  padding: inherit;
  background: none;
  border: none;
  font-family: inherit;
  font-size: inherit;
}

.tabs--tab[data-active='true'] {
  z-index: 2;
}

.tabs--container {
  position: relative;
}

.tabs--section {
  height: 25vh;
  position: absolute;
  width: 100vw;
  z-index: -1;
  padding: .25em 1em;
  box-sizing: border-box;
}

.tabs--section[data-active='true'] {
  z-index: 0;
}

#first {
  background: red;
}

#second {
  background: orange;
}

#third {
  background: green;
  color: white;
}

#fourth {
  background: blue;
  color: white;
}`,
    html: `<ul class="tabs">
  <li class="tabs--tab" data-active="true"><button for="first">First</button></li>
  <li class="tabs--tab"><button for="second">Second</button></li>
  <li class="tabs--tab"><button for="third">Third</button></li>
  <li class="tabs--tab"><button for="fourth">Fourth</button></li>
</ul>
<div class="tabs--container">
  <section class="tabs--section" data-active="true" id="first">
    <p>The first section! Isn't this cool?</p>
  </section>
  <section class="tabs--section" id="second">
    <p>The second section! Isn't this cool?</p>
  </section>
  <section class="tabs--section" id="third">
    <p>The third section! Isn't this cool?</p>
  </section>
  <section class="tabs--section" id="fourth">
    <p>The fourth section! Isn't this cool?</p>
  </section>
</div>`,
  },
  'generative art': {
    name: 'Generative Art',
    features: [
      'complex',
      'input properties',
    ],
    worklet: `// Based on the amazing work by Tim Holman (@twholman)
// https://www.youtube.com/watch?v=4Se0_w0ISYk&list=PLZriQCloF6GDuXF8RRPd1mIl9W2QXF-sQ&index=11

registerPaint('art', class {
  static get inputProperties() {
    return [
      '--art-color',
      '--art-steps',
      '--art-alpha'
    ];
  }


  draw(ctx, x, y, width, height) {
    const leftToRight = Math.random() >= 0.5;

    if( leftToRight ) {
      ctx.moveTo(x, y);
      ctx.lineTo(x + width, y + height);
    } else {
      ctx.moveTo(x + width, y);
      ctx.lineTo(x, y + height);
    }

    ctx.stroke();
  }

  paint(ctx, size, props) {
    const color = props.get('--art-color');
    const step = props.get('--art-steps');
    const alpha = props.get('--art-alpha');

    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;

    for( let x = 0; x < size.width; x += step.value) {
      for( let y = 0; y < size.width; y+= step.value) {
        this.draw(ctx, x, y, step.value, step.value);
      }
    }
  }
});`,
    js: `CSS.registerProperty({
  name: '--art-color',
  syntax: '<color>',
  inherits: false,
  initialValue: 'white',
});

CSS.registerProperty({
  name: '--art-steps',
  syntax: '<number>',
  inherits: false,
  initialValue: 40,
});

CSS.registerProperty({
  name: '--art-alpha',
  syntax: '<number>',
  inherits: false,
  initialValue: 1,
});`,
    css: `h1 {
  --art-alpha: .05;
  --art-color: rgba(255, 255, 255, .25);
  /* Setting --art-steps below 40 will slow this to a crawl */
  --art-steps: 50;
  background-image: paint(art), linear-gradient(to right, blue, black);

  align-items: flex-end;
  box-sizing: border-box;
  color: white;
  display: flex;
  flex-direction: row-reverse;
  font-family: sans-serif;
  font-size: 3em;
  height: 80vh;
  line-height: 1;
  margin: 0;
  padding: .25em .5em;
  text-align: right;
  text-shadow: 1px 1px black, -1px 1px black;
}`,
    html: `<h1><span>Hello World</span></h1>`,
  },
  animation: {
    name: 'Ripple Effect',
    features: [
      'complex',
      'animation',
      'input properties',
      'user input',
    ],
    worklet: `/* Example from https://github.com/GoogleChromeLabs/houdini-samples/tree/master/paint-worklet/ripple */

registerPaint('ripple', class {
    static get inputProperties() {
      return [
        'background-color',
        '--ripple-color',
        '--animation-tick',
        '--ripple-x',
        '--ripple-y'
      ];
    }

    paint(ctx, geom, properties) {
      const bgColor = properties.get('background-color');
      const rippleColor = properties.get('--ripple-color');
      const x = properties.get('--ripple-x');
      const y = properties.get('--ripple-y');
      let tick = properties.get('--animation-tick');

      if (tick < 0) {
        tick = 0;
      } else if (tick > 1000) {
        tick = 1000;
      }

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, geom.width, geom.height);
      ctx.fillRect(0, 0, geom.width, geom.height);

      ctx.fillStyle = rippleColor;
      ctx.globalAlpha = 1 - tick/1000;
      ctx.arc(
        x, y, // center
        geom.width * tick/1000, // radius
        0, // startAngle
        2 * Math.PI //endAngle
      );
      ctx.fill();
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
    js: `CSS.registerProperty({
  name: '--ripple-color',
  syntax: '<color>',
  inherits: true,
  initialValue: 'purple',
});

CSS.registerProperty({
  name: '--ripple-y',
  syntax: '<number>',
  inherits: true,
  initialValue: 0,
});

CSS.registerProperty({
  name: '--ripple-x',
  syntax: '<number>',
  inherits: true,
  initialValue: 0,
});

CSS.registerProperty({
  name: '--animation-tick',
  syntax: '<number>',
  inherits: true,
  initialValue: 0,
});

const button = document.querySelector('#ripple');
button.addEventListener('click', evt => {
  button.classList.add('animating');
  const [x, y] = [evt.clientX, evt.clientY];
  const start = performance.now();
  requestAnimationFrame(function raf(now) {
    const count = Math.floor(now - start);
    button.style.cssText = \`--ripple-x: \${x}; --ripple-y: \${y}; --animation-tick: \${count};\`;
    if(count > 1000) {
      button.classList.remove('animating');
      button.style.cssText = \`--animation-tick: 0\`;
      return;
    }
    requestAnimationFrame(raf);
  })
})`,
    css: `#ripple {
  width: 300px;
  height: 300px;
  border-radius: 150px;
  font-size: 5em;
  background-color: rgb(255,64,129);
  border: 0;
  box-shadow: 0 1px 1.5px 0 rgba(0,0,0,.12),0 1px 1px 0 rgba(0,0,0,.24);
  color: white;
  --ripple-x: 0;
  --ripple-y: 0;
  --ripple-color: rgba(255,255,255,0.54);
  --animation-tick: 0;
}
#ripple:focus {
  outline: none;
}
#ripple.animating {
  background-image: paint(ripple);
}`,
    html: `<button id="ripple">
  Click me!
</button>`,
  },
  custom: {
    name: 'Custom Worklet',
    features: ['custom'],
    worklet: `registerPaint('sample-paint', class {
  // Custom properties from element's style to look for
  static get inputProperties() { return ['--foo']; }
  // Input arguments that can be passed to the \`paint\` function
  static get inputArguments() { return ['<color>']; }
  // Whether Alpha is allowed?
  static get contextOptions() { return {alpha: true}; }

  paint(ctx, size, props, args) {
    // ctx - drawing context
    // size - size of the box being painted
    // props - inputProperties
    // args - array of passed-in arguments

    // Paint code goes here.
  }
});`,
    js: ``,
    css: ``,
    html: ``,
  }
};
