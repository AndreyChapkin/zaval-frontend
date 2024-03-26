"use client";

import FlexLine, { FlexLineProps } from "./FlexLine";

type FRowProps = Omit<FlexLineProps, "direction">;

function FRow(props: FRowProps) {

    return <FlexLine direction="row" {...props} />;
}

export default FRow;