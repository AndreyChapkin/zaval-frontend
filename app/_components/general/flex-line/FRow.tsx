"use client";

import FLine, { FLineProps } from "./FLine";

type FRowProps = Omit<FLineProps, "direction"> & {
    fitChildrenY?: boolean;
};

function FRow({ fitChildrenY, ...rest }: FRowProps) {

    const effectiveAlignItems = fitChildrenY ? 'stretch' : rest.alignItems;

    return <FLine direction="row" alignItems={effectiveAlignItems} {...rest} />;
}

export default FRow;