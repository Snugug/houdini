import '/shared/prism.js';

const editorStyling = document.createElement('link');
editorStyling.rel = 'stylesheet';
editorStyling.type = 'text/css';
editorStyling.href = '/shared/editor.css';
document.head.appendChild(editorStyling);

export default class {
  constructor(indent = '  ') {
    this.indent = indent;

    this._isString = x => {
      return Object.prototype.toString.call(x) === '[object String]';
    }

    this._run = (selector, opts = {}) => {
      const target = this._isString(selector) ? document.querySelectorAll(selector) : selector;

      for (let i = 0; i < target.length; i++) {
        this._scaffold(target[i], true, opts);
      }
    }

    this._scaffold = (target, isMultiple, opts = {}) => {
      const textarea = document.createElement('textarea');
      const pre = document.createElement('pre');
      const code = document.createElement('code');
      const liveCSS = document.createElement('style');
      const liveHTML = document.createElement('div');

      const language = target.dataset.language || opts.language || 'markup';

      const initialCode = target.textContent;
      const lang = this._language(language);

      // Disable autocorrect and spellcheck features
      if (!opts.enableAutocorrect) {
        textarea.setAttribute('spellcheck', false);
        textarea.setAttribute('autocapitalize', 'off');
        textarea.setAttribute('autocomplete', 'off');
        textarea.setAttribute('autocorrect', 'off');
      }

      target.classList.add('editor');
      textarea.classList.add('editor--textarea');
      pre.classList.add('editor--pre');
      code.classList.add('editor--code', `language-${language}`);
      liveCSS.classList.add('editor--live');
      liveHTML.classList.add('editor--live');
      liveHTML.setAttribute('markup', true);


      // Fix iOS "drunk-text" issue
      if (/iPad|iPhone|iPod/.test(navigator.platform)) {
        code.style.paddingLeft = '3px';
      }

      // If RTL add the text-align attribute
      if (opts.rtl) {
        textarea.setAttribute('dir', 'rtl');
        pre.setAttribute('dir', 'rtl');
      }

      // Add line numbers
      if (opts.lineNumbers) {
        pre.classList.add('line-numbers', 'editor--numbered-pre');
        pre.classList.remove('editor--pre');
        textarea.classList.add('editor--numbered-textarea');
        textarea.classList.remove('editor--textarea');
      }

      // Appending editor elements
      target.innerHTML = '';
      target.appendChild(textarea);
      target.appendChild(pre);
      pre.appendChild(code);

      textarea.value = initialCode;
      const rendered = this._render(code, textarea);

      if (opts.live && language.match(/css/)) {
        target.appendChild(liveCSS);
        liveCSS.innerText = rendered;
      } else if (opts.live && language.match(/markup/)) {
        target.appendChild(liveHTML);
        liveHTML.innerHTML = rendered;
      }

      this._input(target);
      this._scroll(textarea, pre);

      return target;
    }

    this._input = (target) => {
      const textarea = target.querySelector('.editor--textarea');
      const pre = target.querySelector('.editor--pre');
      const code = target.querySelector('.editor--code');
      const live = target.querySelector('.editor--live');

      // Input Event Listener
      textarea.addEventListener('input', e => {
        const input = e.target;
        input.value = input.value.replace(/\t/g, this.indent);

        const rendered = this._render(code, textarea);

        if (live) {
          if (live.hasAttribute('markup')) {
            live.innerHTML = input.value;
          } else {
            live.innerText = rendered;
          }
        }
      });

      // Keydown Event Listener
      textarea.addEventListener('keydown', e => {
        const input = e.target;
        const selStartPos = input.selectionStart;
        const selEndPos = input.selectionEnd;
        const inputVal = input.value;

        // Indent on enter
        if (e.key === 'Enter') {
          e.preventDefault();
          const indented = [inputVal.slice(0, selStartPos + 1), '  \n', inputVal.slice(selStartPos + 1)].join('');
          input.value = indented;
          input.selectionStart = selStartPos + 3;
          input.selectionEnd = selEndPos + 3;

          const event = new Event('input', {
            'bubbles': true,
            'cancelable': true,
          });

          input.dispatchEvent(event);
        }


        // if (e.key === 'Enter') {
        //   console.log(input);
        //   console.log(input.value);
        //   e.target.querySelector('.editor--textarea').value += '  ';
          // const event = new Event('input', {
          //   'bubbles': true,
          //   'cancelable': true,
          // });

          // input.dispatchEvent(event);
        // }

        // If `tab` is pressed, indent
        // if (e.keyCode === 9) {
        //   e.preventDefault();

        //   if (e.shiftKey) {
        //     indentLength = this.indent.length;
        //   }
        // }
      })
    }

    this._scroll = (textarea, pre) => {
      textarea.addEventListener('scroll', e => {
        const roundedScroll = Math.floow(e.target.scrollTop);

        // Fixes issues of desync text on mouse wheel in Firefox
        if (navigator.userAgent.toLowerCase().indexOf('firefox') < 0) {
          e.target.scrollTop = roundedScroll;
        }

        pre.style.transformY = `-${roundedScroll}px`;
      });
    }

    this._render = (code, input) => {
      const cleaned = input.value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      // Insert text
      code.innerHTML = cleaned;

      // Highlight text
      Prism.highlightElement(code);

      return cleaned;
    }

    this._language = lang => {
      if(lang.match(/html|xml|xhtml|svg/)) {
        return 'markup';
      }
      else if(lang.match(/js/)) {
        return 'javascript';
      }
      else {
        return lang;
      }
    }
  }

  run(selector, opts) {
    return this._run(selector, opts);
  }
}
