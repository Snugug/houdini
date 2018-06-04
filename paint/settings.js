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
  face: {
    name: 'Face',
    features: [
      'basic',
      'input properties',
      'input arguments',
    ],
    worklet: `registerPaint('face', class {
    static get inputProperties() { return ['--head-color', '--face-color']; }
    static get inputArguments() { return ['*']; }
    paint(ctx, geom, properties, args) {
      // Change the fill color.
      const circle = properties.get('--head-color');
      const face = properties.get('--face-color').length ? properties.get('--face-color') : args[0];

      // Determine the center point and radius.
      const xCircle = geom.width / 2;
      const yCircle = geom.height / 2;
      const radiusCircle = Math.min(xCircle, yCircle) - 2.5;

      const xFace = geom.width / 20;
      const yFace = geom.height / 20;
      const radiusFace = Math.min(xFace, yFace);

      // Draw the circle \o/
      ctx.beginPath();
      ctx.arc(xCircle, yCircle, radiusCircle, 0, 2 * Math.PI);
      ctx.fillStyle = circle;
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = face;
      ctx.stroke();

      // Draw the eyes
      ctx.beginPath();
      const eyeY = yCircle - yFace * 2;

      let eyeX = xCircle - xFace;
      if (eyeX < xCircle - radiusCircle / 2) {
        eyeX = xCircle - radiusCircle / 2;
      }
      ctx.arc(eyeX, eyeY, radiusFace, 0, 2 * Math.PI);

      eyeX += xFace * 2;
      if (eyeX > xCircle + radiusCircle / 2) {
        eyeX = xCircle + radiusCircle / 2;
      }

      ctx.arc(eyeX, eyeY, radiusFace, 0, 2 * Math.PI);
      ctx.fillStyle = face;
      ctx.fill();

      // draw the mouth
      ctx.beginPath();
      ctx.arc(xCircle, yCircle, radiusCircle / 2, 0, Math.PI, false);
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = face;
      ctx.stroke();
    }
});`,
    js: `CSS.registerProperty({
  name: '--head-color',
  syntax: '<color>',
  inherits: true,
  initialValue: 'purple',
});

CSS.registerProperty({
  name: '--face-color',
  syntax: '<color>',
  inherits: true,
  initialValue: 'green',
});`,
    css: `.face {
  --head-color: blue;
  background-image: paint(face, orange);
  height: 50vh;
  width: 50vw;
}`,
    html: `<textarea class="face"></textarea>`,
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
    static get inputProperties() { return ['background-color', '--ripple-color', '--animation-tick', '--ripple-x', '--ripple-y']; }
    paint(ctx, geom, properties) {
      const bgColor = properties.get('background-color').toString();
      const rippleColor = properties.get('--ripple-color').toString();
      const x = parseFloat(properties.get('--ripple-x').toString());
      const y = parseFloat(properties.get('--ripple-y').toString());
      let tick = parseFloat(properties.get('--animation-tick').toString());
      if(tick < 0)
        tick = 0;
      if(tick > 1000)
        tick = 1000;

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
