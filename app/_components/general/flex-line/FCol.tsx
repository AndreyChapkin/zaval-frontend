"use client";

import FlexLine, { FlexLineProps } from "./FlexLine";

type FColProps = Omit<FlexLineProps, "direction">;

function FCol(props: FColProps) {

    return <FlexLine direction="column" {...props} />;
}

export default FCol;