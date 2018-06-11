registerLayout('blueprint', class {
  static get inputProperties() {
    return [ '--padding', '--offset' ];
  }

  *intrinsicSizes() { }
  *layout(children, edges, constraints, styleMap) {
    const inlineSize = constraints.fixedInlineSize;

    const padding = parseInt(styleMap.get('--padding'));
    const offset = parseFloat(styleMap.get('--offset'));

    // We also accept 'auto', which will select the BEST number of columns.
    let columns = 6;

    // Layout all children with simply their column size.
    const childInlineSize = (inlineSize - ((columns + 1) * padding)) / columns;
    const childFragments = yield children.map((child) => {
      return child.layoutNextFragment({fixedInlineSize: childInlineSize});
    });

    let autoBlockSize = 0;
    let max = 0;
    for (let i in childFragments) {
      const childFragment = childFragments[i];

      if (i < 6) {
        childFragment.inlineOffset = padding + ((childInlineSize * i) + padding);
        if (i < 3) {
          childFragment.blockOffset = childFragment.blockSize * offset * Math.abs(2 -i) + padding;
          max = Math.max(max, childFragment.blockOffset);
        } else {
          childFragment.blockOffset = childFragment.blockSize * offset * Math.abs(3 -i) + padding;
          max = Math.max(max, childFragment.blockOffset);
        }
      } else {
        childFragment.inlineOffset = padding + ((childInlineSize * (i - 5)) + padding) - (childInlineSize / 2);
        childFragment.blockOffset = max + childFragment.blockSize * offset * 2 + padding;
      }

      autoBlockSize = childFragment.blockOffset + childFragment.blockSize;
    }

    return {autoBlockSize, childFragments};
  }
});
