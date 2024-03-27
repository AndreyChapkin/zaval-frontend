"use client";

export interface FlexLineProps {
    direction: "row" | "column";
    alignItems?: "center" | "start" | "end" | "stretch";
    justifyContent?: "center" | "start" | "end" | "between" | "around";
    hasScrollable?: boolean;
    className?: string;
    spacing?: number;
    children: React.ReactNode;
}

// Deprecated
function FlexLine({ children, className, ...props }: FlexLineProps) {

    const { direction, alignItems, justifyContent, hasScrollable, spacing } = props;
    const directionClassname = direction === 'column' ? "column" : "row";
    let justifyContentClassname = 'justifyStart';
    switch (justifyContent) {
        case 'center':
            justifyContentClassname = 'justifyCenter';
            break;
        case 'start':
            justifyContentClassname = 'justifyStart';
            break;
        case 'end':
            justifyContentClassname = 'justifyEnd';
            break;
        case 'between':
            justifyContentClassname = 'justifyBetween';
            break;
        case 'around':
            justifyContentClassname = 'justifyAround';
            break;
    }
    let alignItemsClassname = 'alignStart';
    if (hasScrollable) {
        alignItemsClassname = 'alignStretch';
    } else {
        switch (alignItems) {
            case 'center':
                alignItemsClassname = 'alignCenter';
                break;
            case 'start':
                alignItemsClassname = 'alignStart';
                break;
            case 'end':
                alignItemsClassname = 'alignEnd';
                break;
            case 'stretch':
                alignItemsClassname = 'alignStretch';
                break;
        }
    }
    let spacingClassname = 'gap1';
    switch (spacing) {
        case 1:
            spacingClassname = 'gap1';
            break;
        case 2:
            spacingClassname = 'gap2';
            break;
        case 3:
            spacingClassname = 'gap3';
            break;
        case 4:
            spacingClassname = 'gap4';
            break;
        case 5:
            spacingClassname = 'gap5';
            break;
        case 6:
            spacingClassname = 'gap6';
            break;
    }
    const resultClassnames = `flexLine ${className ? className : ""} ${directionClassname} ${justifyContentClassname} ${alignItemsClassname} ${spacingClassname}`;

    return (
        <div className={resultClassnames}>
            {children}
        </div>
    );
}

export default FlexLine;