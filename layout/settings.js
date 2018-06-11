export default {
  'centered blocks': {
    name: 'Centered Blocks',
    features: [
      'basic',
      'input properties',
    ],
    worklet: `registerLayout('block-like', class {
  static get inputProperties() {
    return ['--gap'];
  }

  *intrinsicSizes(children, edges, styleMap) {
    const childrenSizes = yield children.map((child) => {
      return child.intrinsicSizes();
    });

    const maxContentSize = childrenSizes.reduce((max, childSizes) => {
      return Math.max(max, childSizes.maxContentSize);
    }, 0);

    const minContentSize = childrenSizes.reduce((max, childSizes) => {
      return Math.max(max, childSizes.minContentSize);
    }, 0);

    return {maxContentSize, minContentSize};
  }

  *layout(children, edges, constraints, styleMap) {
    const availableInlineSize = constraints.fixedInlineSize;
    const availableBlockSize = constraints.fixedBlockSize;

    const childConstraints = { availableInlineSize, availableBlockSize };

    const childFragments = yield children.map((child) => {
      return child.layoutNextFragment(childConstraints);
    });

    let blockOffset = 0;
    for (let fragment of childFragments) {
      // Position the fragment in a block like manner, centering it in the
      // inline direction
      fragment.blockOffset = blockOffset;
      fragment.inlineOffset = (availableInlineSize - fragment.inlineSize) / 2;

      blockOffset += fragment.blockSize + styleMap.get('--gap').value;
    }

    const autoBlockSize = blockOffset;

    return {
      autoBlockSize,
      childFragments,
    };
  }
});`,
    js: `CSS.registerProperty({
  name: '--gap',
  syntax: '<number>',
  inherits: false,
  initialValue: 5,
});`,
    css: `.parent {
  display: layout(block-like);
}

.one {
  border: 2px solid red;
}

.two {
  border: 2px dashed orange;
}

.three {
  border: 2px solid yellow;
}

.four {
  border: 2px dashed green;
}

.five {
  border: 2px solid blue;
}

.block {
  height: 25vh;
  display: flex;
  justify-items: vertical;
  align-items: center;
}
`,
    html: `<div class="parent">
  <div class="block one">Hello</div>
  <div class="block two">World</div>
  <div class="block three">How</div>
  <div class="block four">Are</div>
  <div class="block five">You?</div>
</div>`,
  },
  masonry: {
    name: 'Masonry',
    features: [
      'input properties',
    ],
    worklet: `// From https://github.com/GoogleChromeLabs/houdini-samples

registerLayout('masonry', class {
  static get inputProperties() {
    return [ '--padding', '--columns' ];
  }

  *intrinsicSizes() { /* TODO implement :) */ }
  *layout(children, edges, constraints, styleMap) {
    const inlineSize = constraints.fixedInlineSize;

    const padding = parseInt(styleMap.get('--padding'));
    const columnValue = styleMap.get('--columns');

    // We also accept 'auto', which will select the BEST number of columns.
    let columns = parseInt(columnValue);
    if (columnValue == 'auto' || !columns) {
      columns = Math.ceil(inlineSize / 350); // MAGIC NUMBER \o/.
    }

    // Layout all children with simply their column size.
    const childInlineSize = (inlineSize - ((columns + 1) * padding)) / columns;
    const childFragments = yield children.map((child) => {
      return child.layoutNextFragment({fixedInlineSize: childInlineSize});
    });

    let autoBlockSize = 0;
    const columnOffsets = Array(columns).fill(0);
    for (let childFragment of childFragments) {
      // Select the column with the least amount of stuff in it.
      const min = columnOffsets.reduce((acc, val, idx) => {
        if (!acc || val < acc.val) {
          return {idx, val};
        }

        return acc;
      }, {val: +Infinity, idx: -1});

      childFragment.inlineOffset = padding + (childInlineSize + padding) * min.idx;
      childFragment.blockOffset = padding + min.val;

      columnOffsets[min.idx] = childFragment.blockOffset + childFragment.blockSize;
      autoBlockSize = Math.max(autoBlockSize, columnOffsets[min.idx] + padding);
    }

    return {autoBlockSize, childFragments};
  }
});

/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */`,
    js: `CSS.registerProperty({
  name: '--padding',
  syntax: '<number>',
  inherits: false,
  initialValue: 0,
});

CSS.registerProperty({
  name: '--columns',
  syntax: '<number> | auto',
  inherits: false,
  initialValue: 'auto',
});`,
    css: `body {
  display: layout(masonry);
  --padding: 10;
  --columns: 3;
}
div {
  background-color: hsl(0, 80%, 20%);
  color: hsl(0, 80%, 95%);
  font: 12px sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
div::first-letter {
  font-size: 200%;
}`,
    html: `<div>1 Lorem ipsum dolor sit amet, consul disputando ne his, et vim accumsan ponderum. </div>

<div>2 Lorem ipsum dolor sit amet, consul disputando ne his, et vim accumsan ponderum. Rebum deseruisse ex vix. Vix stet honestatis definitionem an, et natum ocurreret cum, semper interpretaris cu mea. Eam saperet fierent luptatum no. Ius ei dicunt detracto elaboraret. Rebum deseruisse ex vix. Vix stet honestatis definitionem an, et natum ocurreret cum, semper interpretaris cu mea. Eam saperet fierent luptatum no. Ius ei dicunt detracto elaboraret</div>

<div>3 Lorem ipsum dolor sit amet, consul disputando ne his, et vim accumsan ponderum. Rebum deseruisse ex vix. Vix stet honestatis definitionem an, et natum ocurreret cum, semper interpretaris cu mea. Eam saperet fierent luptatum no. Ius ei dicunt detracto elaboraret.</div>

<div>4 Lorem ipsum dolor sit amet, consul disputando ne his, et vim accumsan ponderum. Rebum deseruisse ex vix. Vix stet honestatis definitionem an, et natum ocurreret cum, semper interpretaris cu mea. Eam saperet fierent luptatum no. Ius ei dicunt detracto elaboraret.</div>

<div>5 Lorem ipsum dolor sit amet, consul disputando ne his, et vim accumsan ponderum. Rebum deseruisse ex vix. Vix stet honestatis definitionem an, et natum ocurreret cum, semper interpretaris cu mea. Eam saperet fierent luptatum no. Ius ei dicunt detracto elaboraret.</div>

<div>6 Lorem ipsum dolor sit amet, consul disputando ne his, et vim accumsan ponderum. Rebum deseruisse ex vix. Vix stet honestatis definitionem an, et natum ocurreret cum, semper interpretaris cu mea. Eam saperet fierent luptatum no. Ius ei dicunt detracto elaboraret.</div>

<div>7 Lorem ipsum dolor sit amet, consul disputando ne his, et vim accumsan ponderum. Rebum deseruisse ex vix. Vix stet honestatis definitionem an, et natum ocurreret cum, semper interpretaris cu mea. Eam saperet fierent luptatum no. Ius ei dicunt detracto elaboraret.</div>

<div>8 Lorem ipsum dolor sit amet, consul disputando ne his, et vim accumsan ponderum. Rebum deseruisse ex vix. Vix stet honestatis definitionem an, et natum ocurreret cum, semper interpretaris cu mea. Eam saperet fierent luptatum no. Ius ei dicunt detracto elaboraret.</div>

<div>9 Lorem ipsum dolor sit amet, consul disputando ne his, et vim accumsan ponderum. Rebum deseruisse ex vix. Vix stet honestatis definitionem an, et natum ocurreret cum, semper interpretaris cu mea. Eam saperet fierent luptatum no. Ius ei dicunt detracto elaboraret.</div>`,
  },
  custom: {
    name: 'Custom',
    features: [
      'custom',
    ],
    worklet: `registerLayout('sample-layout', class {
  // Properties to look for on calling element
  static get inputProperties() { return ['--foo']; }
  // Properties to look for on direct child elements
  static get childrenInputProperties() { return ['--bar']; }
  // Options for the Layout
  // \`childDisplay\` can be 'block' or 'normal'. 'block' is similar to children of flex and grid containers, 'normal'. Otherwise boxes won't be blockified
  // \`sizing\` can be 'block-like' or 'manual'. 'block-like' will make the Layout Constraints's inline size be fixed, and block size be calculated like border-box. Otherwise, it's just the calculated inlineSize and blockSize
  static get layoutOptions() {
    childDisplay: 'normal',
    sizing: 'block-like'
  }

  // Generator functions instead of normal functions to support async/parallel layout engines
  // Determines how a box fits its content or fits in to our layout context
  *intrinsicSizes(children, edges, styleMap) {
    // children - Child elements of box being laid out
    // edges - Layout Edges of the box being
    // styleMap - Typed OM style map of box being laid out

    // Intrinsic sizes code goes here.
  }

  *layout(children, edges, constraints, styleMap, breakToken) {
    // children - Child elements of Parent Layout
    // edges - \`LayoutEdges\` of Parent Layout
    // constraints - \`Layout Constraints\` of Parent Layout
    // styleMap - Typed OM style map of Parent Layout
    // breakToken - Token (if paginating for printing for example) to resume layout at

    // Layout code goes here.
  }
});`,
    js: ``,
    css: ``,
    html: ``,
  },
};
