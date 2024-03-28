"use client";

import FLine, { FLineProps } from "./FLine";

type FColProps = Omit<FLineProps, "direction"> & {
    fitChildrenX?: boolean;
};

function FCol({fitChildrenX, ...rest}: FColProps) {

    const effectiveAlignItems = fitChildrenX ? 'stretch' : rest.alignItems;

    return <FLine direction="column" alignItems={effectiveAlignItems} {...rest} />;
}

export default FCol;