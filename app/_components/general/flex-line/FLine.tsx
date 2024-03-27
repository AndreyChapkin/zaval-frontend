"use client";

import "./FLine.scss";

export interface FLineProps {
    direction: "row" | "column";
    alignItems?: "center" | "start" | "end" | "stretch";
    justifyContent?: "center" | "start" | "end" | "between" | "around";
    scrollableX?: boolean;
    squeezeX?: boolean;
    scrollableY?: boolean;
    squeezeY?: boolean;
    className?: string;
    spacing?: number;
    children: React.ReactNode;
}

function FLine({ children, className, ...props }: FLineProps) {

    const { direction, alignItems, justifyContent, scrollableX, squeezeX, scrollableY, squeezeY, spacing } = props;
    const directionClassname = direction === 'column' ? "fColumn" : "fRow";
    let justifyContentClassname = 'fJustifyStart';
    switch (justifyContent) {
        case 'center':
            justifyContentClassname = 'fJustifyCenter';
            break;
        case 'start':
            justifyContentClassname = 'fJustifyStart';
            break;
        case 'end':
            justifyContentClassname = 'fJustifyEnd';
            break;
        case 'between':
            justifyContentClassname = 'fJustifyBetween';
            break;
        case 'around':
            justifyContentClassname = 'fJustifyAround';
            break;
    }
    let alignItemsClassname = 'fAlignStart';
    switch (alignItems) {
        case 'center':
            alignItemsClassname = 'fAlignCenter';
            break;
        case 'start':
            alignItemsClassname = 'fAlignStart';
            break;
        case 'end':
            alignItemsClassname = 'fAlignEnd';
            break;
        case 'stretch':
            alignItemsClassname = 'fAlignStretch';
            break;
    }
    let spacingClassname = 'fGap1';
    switch (spacing) {
        case 1:
            spacingClassname = 'fGap1';
            break;
        case 2:
            spacingClassname = 'fGap2';
            break;
        case 3:
            spacingClassname = 'fGap3';
            break;
        case 4:
            spacingClassname = 'fGap4';
            break;
        case 5:
            spacingClassname = 'fGap5';
            break;
        case 6:
            spacingClassname = 'fGap6';
            break;
    }
    const scrollableXClassname = scrollableX ? "fScrollableX" : "";
    const scrollableYClassname = scrollableY ? "fScrollableY" : "";
    const squeezeXClassname = squeezeX ? "fSqueezableX" : "";
    const squeezeYClassname = squeezeY ? "fSqueezableY" : "";
    const resultClassnames = `fLine ${className ? className : ""} ${directionClassname} ${justifyContentClassname} ${alignItemsClassname} ${spacingClassname} ${scrollableXClassname} ${scrollableYClassname} ${squeezeXClassname} ${squeezeYClassname}`;

    return (
        <div className={resultClassnames}>
            {children}
        </div>
    );
}

export default FLine;