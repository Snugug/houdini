import Editor from '/shared/editor.js';

const replStyling = document.createElement('link');
replStyling.rel = 'stylesheet';
replStyling.type = 'text/css';
replStyling.href = '/shared/repl.css';
document.head.appendChild(replStyling);

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

    // Set up REPL and runner divs
    const menu = document.createElement('div');
    const workletEditor = document.createElement('div');
    const jsEditor = document.createElement('div');
    const cssEditor = document.createElement('div');
    const htmlEditor = document.createElement('div');
    let previousPreview = '';


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

    const parent = document.querySelector(target);

    parent.classList.add('repl');
    parent.appendChild(menu);
    parent.appendChild(workletEditor);
    parent.appendChild(jsEditor);
    parent.appendChild(cssEditor);
    parent.appendChild(htmlEditor);

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

      for (key in first) {
        if (editors[key]) {
          editors[key].value = first[key];
          editors[key].addEventListener('input', replPreview);
          editors[key].dispatchEvent(inputEvent);
        }
      }
    }

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
