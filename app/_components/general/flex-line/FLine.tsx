"use client";

import "./FLine.scss";

export interface FLineProps {
    direction: "row" | "column";
    alignItems?: "center" | "start" | "end" | "stretch";
    justifyContent?: "center" | "start" | "end" | "between" | "around";
    scrollableX?: boolean;
    squeezableX?: boolean;
    scrollableY?: boolean;
    squeezableY?: boolean;
    className?: string;
    id?: any;
    spacing?: number;
    children: React.ReactNode;
    onClick?: (e: any) => void;
    onWheel?: (e: any) => void;
}

function FLine({ children, className, ...props }: FLineProps) {

    const { direction, alignItems, justifyContent, scrollableX, squeezableX, scrollableY, squeezableY, spacing, ...rest } = props;
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
        case 0:
            spacingClassname = '';
            break;
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
    const squeezeXClassname = squeezableX ? "fSqueezableX" : "";
    const squeezeYClassname = squeezableY ? "fSqueezableY" : "";
    const resultClassnames = `fLine ${className ? className : ""} ${directionClassname} ${justifyContentClassname} ${alignItemsClassname} ${spacingClassname} ${scrollableXClassname} ${scrollableYClassname} ${squeezeXClassname} ${squeezeYClassname}`;

    return (
        <div className={resultClassnames} {...rest}>
            {children}
        </div>
    );
}

export default FLine;