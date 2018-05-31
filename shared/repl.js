import Editor from '/shared/editor.js';

const replStyling = document.createElement('link');
replStyling.rel = 'stylesheet';
replStyling.type = 'text/css';
replStyling.href = '/shared/repl.css';
document.head.appendChild(replStyling);

const replSwitcherWorklet = `registerPaint('replswitcher', class {
  static get inputProperties() {
    return [
      '--switcher-bkg',
      'color',
    ];
  }
  paint(ctx, size, props) {
    const bkg = props.get('--switcher-bkg');
    const color = props.get('color');

    const x = size.width / 75.8333;
    const y = size.height / 20;

    // Background
    ctx.beginPath();
    ctx.moveTo(72.9 * x, 0.0 * y);
    ctx.lineTo(8.7 * x, 0.0 * y);
    ctx.bezierCurveTo(7.1 * x, 0.0 * y, 5.8 * x, 1.3 * y, 5.8 * x, 2.9 * y);
    ctx.lineTo(5.8 * x, 14.2 * y);
    ctx.bezierCurveTo(5.8 * x, 17.4 * y, 3.2 * x, 20.0 * y, 0.0 * x, 20.0 * y);
    ctx.lineTo(5.8 * x, 20.0 * y);
    ctx.lineTo(75.8 * x, 20.0 * y);
    ctx.lineTo(75.8 * x, 2.9 * y);
    ctx.bezierCurveTo(75.8 * x, 1.3 * y, 74.5 * x, 0.0 * y, 72.9 * x, 0.0 * y);
    ctx.closePath();
    ctx.fillStyle = bkg;
    ctx.fill();


    // Arrow
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(64.1 * x, 6.5 * y);
    ctx.lineTo(67.6 * x, 13.5 * y);
    ctx.lineTo(71.1 * x, 6.5 * y);
    ctx.lineTo(64.1 * x, 6.5 * y);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }
});`;

const workletBlob = new Blob([replSwitcherWorklet], {type: 'text/javascript'});
CSS.paintWorklet.addModule(URL.createObjectURL(workletBlob)).catch(e => {
  console.log(e);
})

export default class {
  constructor(target, options, type) {
    options.custom = {
      name: 'Custom Worklet',
      features: [],
      worklet: ``,
      js: ``,
      css: ``,
      html: ``,
    };
    const optkey = Object.keys(options);

    let key = '';
    const switcherOptions = ['worklet', 'js', 'css', 'html'];

    // Set up REPL and runner divs
    const menu = document.createElement('div');

    const replContainer = document.createElement('div');
    const replSwitcher = document.createElement('select');
    const replTitle = document.createElement('h4');
    const replFeatures = document.createElement('p');

    const workletEditor = document.createElement('div');
    const jsEditor = document.createElement('div');
    const cssEditor = document.createElement('div');
    const htmlEditor = document.createElement('div');

    let previousPreview = '';


    replContainer.classList.add('repl--container');
    replTitle.classList.add('repl--title');
    replFeatures.classList.add('repl--features');
    replSwitcher.classList.add('repl--switcher');
    workletEditor.classList.add('repl--editor');
    workletEditor.setAttribute('data-language', 'worklet');
    jsEditor.classList.add('repl--editor');
    jsEditor.setAttribute('data-language', 'js');
    cssEditor.classList.add('repl--editor');
    cssEditor.setAttribute('data-language', 'css');
    htmlEditor.classList.add('repl--editor');
    htmlEditor.setAttribute('data-language', 'markup');
    workletEditor.style.zIndex = 100;

    const menuItems = {};
    // Build Menu
    for (key of optkey) {
      menuItems[key] = document.createElement('button');
      menuItems[key].classList.add('repl--menu-item');
      menuItems[key].setAttribute('data-type', key);
      menuItems[key].textContent = key;
      menuItems[key].addEventListener('click', menuHandler);
      menu.appendChild(menuItems[key]);
    }

    // Build REPL switcher
    for (key of switcherOptions) {
      const so = document.createElement('option');
      so.value = key;
      so.text = key;
      replSwitcher.appendChild(so);
    }

    replSwitcher.addEventListener('change', swapEditors)

    const parent = document.querySelector(target);

    parent.classList.add('repl');
    parent.appendChild(menu);
    parent.appendChild(replContainer);
    replContainer.appendChild(replTitle);
    replContainer.appendChild(replFeatures);
    replContainer.appendChild(replSwitcher);
    replContainer.appendChild(workletEditor);
    replContainer.appendChild(jsEditor);
    replContainer.appendChild(cssEditor);
    replContainer.appendChild(htmlEditor);

    // Set up the editors
    const editor = new Editor;
    editor.run('.repl--editor', {
      live: false,
    });

    // Initiate the Editor Fields
    const inputEvent = new Event('input', {
      'bubbles': true,
      'cancelable': true,
    });

    const editors = {
      worklet: workletEditor.querySelector('.editor--textarea'),
      js: jsEditor.querySelector('.editor--textarea'),
      css: cssEditor.querySelector('.editor--textarea'),
      html: htmlEditor.querySelector('.editor--textarea'),
    };

    resetEditors(optkey[0]);

    function resetEditors(base) {
      const first = options[base];

      replTitle.textContent = first.name;
      replFeatures.textContent = first.features.join(', ');

      for (key in first) {
        if (editors[key]) {
          editors[key].value = first[key];
          editors[key].addEventListener('input', replPreview);
          editors[key].dispatchEvent(inputEvent);
        }
      }
    }

    function swapEditors(e) {
      const val = e.target.value;
      for (key in editors) {
        if (key === val) {
          editors[key].closest('.repl--editor').style.zIndex = 100;
        } else {
          editors[key].closest('.repl--editor').style.zIndex = 0;
        }
      }
    };

    function menuHandler(e) {
      const target = e.target;
      const switchType = target.getAttribute('data-type');

      resetEditors(switchType);
    }


    function replPreview() {
      const vals = {};

      for (const editor in editors) {
        vals[editor] = editors[editor].value;
      }

      let worklet = '';

      if (type === 'paint') {
        worklet = 'CSS.paintWorklet';
      }

      let html = `
      <head>
        <style>
          ${vals.css}
        </style>
        <script language="worklet">
          ${vals.worklet}
        </script>
        <script type="module">
        // In-page Worklet pattern from @DasSurma
        // https://glitch.com/edit/#!/aw-bug-hunt?path=delay.html:39:0
        function blobWorklet() {
          const src = document.querySelector('script[language="worklet"]').innerHTML;
          const blob = new Blob([src], {type: 'text/javascript'});
          return URL.createObjectURL(blob);
        }

        async function init() {
          await ${worklet}.addModule(blobWorklet());

          ${vals.js}
        }

        init();

        </script>
      </head>
      <body>
        ${vals.html}
      </body>`;

      window.requestAnimationFrame(() => {
        if (previousPreview) {
          previousPreview.remove();
        }
        const preview = document.createElement('iframe');
        preview.classList.add('repl--preview');
        parent.appendChild(preview);
        previousPreview = preview;
        preview.contentWindow.document.open();
        preview.contentWindow.document.write(html);
        preview.contentWindow.document.close();
      });
    }
  }
}

// <script language="aw">
//   registerAnimator('aw', class {
//     animate(currentTime, effect) {
//       // console.log(currentTime, effect);
//       effect.localTime = currentTime;
//     }
//   });
// </script>
