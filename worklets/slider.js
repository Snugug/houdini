export default function(id) {
  const container = document.getElementById(id);
  const deck = container.querySelector('.deck');
  const words = container.querySelector('.words');

  const next = document.createElement('button');
  next.innerText = 'next';
  next.classList.add('slider--button');
  const previous = document.createElement('button');
  previous.innerText = 'previous';
  previous.classList.add('slider--button');
  previous.style.opacity = 0;
  previous.disabled = true;

  container.insertBefore(previous, words);
  container.insertBefore(next, words);

  const deckFragments = [];
  const wordsFragments = [];


  for (const fragment of deck.querySelectorAll('.fragment')) {
    fragment.style.opacity = 0;
    deckFragments.push({
      elem: fragment,
      active: false,
    });
  }

  for (const fragment of words.querySelectorAll('.fragment')) {
    fragment.style.display = 'none';
    wordsFragments.push({
      elem: fragment,
      active: false,
    });
  }

  next.addEventListener('click', () => {
    const foundD = deckFragments.findIndex(item => item.active === false);
    deckFragments[foundD].elem.style.opacity = 1;
    deckFragments[foundD].active = true;
    wordsFragments[foundD].elem.style.display = 'list-item';
    wordsFragments[foundD].active = true;

    if (foundD === deckFragments.length - 1) {
      next.style.opacity = 0;
      next.disabled = true;
    } else {
      next.style.opacity = 1;
      next.disabled = false;
    }

    if (foundD === -1) {
      previous.style.opacity = 0;
      previous.disabled = true;
    } else {
      previous.style.opacity = 1;
      previous.disabled = false;
    }
  });

  previous.addEventListener('click', () => {
    const dReverse = deckFragments.slice(0).reverse();
    const wReverse = wordsFragments.slice(0).reverse();
    const foundD = dReverse.findIndex(item => item.active === true);

    console.log(dReverse[foundD]);

    dReverse[foundD].elem.style.opacity = 0;
    dReverse[foundD].active = false;
    wReverse[foundD].elem.style.display = 'none';
    wReverse[foundD].active = false;

    if (foundD === deckFragments.length - 1) {
      previous.style.opacity = 0;
      previous.disabled = true;
    } else {
      previous.style.opacity = 1;
      previous.disabled = false;
    }

    if (foundD === -1) {
      next.style.opacity = 0;
      next.disabled = true;
    } else {
      next.style.opacity = 1;
      next.disabled = false;
    }
  });
}
