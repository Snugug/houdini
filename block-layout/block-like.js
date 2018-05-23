registerLayout('block-like', class {
    *intrinsicSizes(children, edges, styleMap) {
      const childrenSizes = yield children.map((child) => {
          return child.intrinsicSizes();
      });

      const maxContentSize = childrenSizes.reduce((max, childSizes) => {
          return Math.max(max, childSizes.maxContentContribution);
      }, 0) + edges.all.inline;

      const minContentSize = childrenSizes.reduce((max, childSizes) => {
          return Math.max(max, childSizes.minContentContribution);
      }, 0) + edges.all.inline;

      return {maxContentSize, minContentSize};
    }

    *layout(children, edges, constraints, styleMap) {
      console.log(children);
      console.log(edges);
      console.log(constraints);
      console.log(styleMap);
        const availableInlineSize = constraints.fixedInlineSize - edges.all.inline;
        const availableBlockSize = (constraints.fixedBlockSize || Infinity) - edges.all.block;

        const childConstraints = { availableInlineSize, availableBlockSize };

        const childFragments = yield children.map((child) => {
            return child.layoutNextFragment(childConstraints);
        });

        let blockOffset = edges.all.blockStart;
        for (let fragment of childFragments) {
            // Position the fragment in a block like manner, centering it in the
            // inline direction.
            fragment.blockOffset = blockOffset;
            fragment.inlineOffset = Math.max(
                edges.all.inlineStart,
                (availableInlineSize - fragment.inlineSize) / 2);

            blockOffset += fragment.blockSize;
        }

        const autoBlockSize = blockOffset + edges.all.blockEnd;

        return {
            autoBlockSize,
            childFragments,
        };
    }
});
