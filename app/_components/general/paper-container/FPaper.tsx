import React from 'react';

import FLine, { FLineProps } from '../flex-line/FLine';
import './FPaper.scss';

export interface FPaperProps extends FLineProps {
    outlineType?: 'outline-1' | 'outline-2' | 'outline-3' | 'outline-4' | 'outline-5';
    lightType?: 'light-1' | 'light-2' | 'light-3' | 'light-4' | 'light-5' | 'normal' | 'dark-1' | 'dark-2' | 'dark-3' | 'dark-4' | 'dark-5';
    secondary?: boolean;
}

export const FPaper: React.FC<FPaperProps> = ({
    className = "",
    lightType = 'normal',
    outlineType,
    secondary = false,
    ...rest
}) => {
    let lightClass = chooseLightClass(lightType, secondary);
    let outlineClass = chooseOutlineClass(outlineType);
    return (
        <FLine className={`fPaper ${lightClass} ${outlineClass} ${className}`} {...rest} />
    );
};

function chooseOutlineClass(outlineType?: string) {
    if (!outlineType) {
        return "";
    }
    return outlineType;
}

function chooseLightClass(lightType: string, secondary: boolean = false) {
    if (secondary) {
        return lightType === 'normal' ? "secondary"
            : `secondaryPaper-${lightType}`;
    }
    return lightType === 'normal' ? "main"
        : `mainPaper-${lightType}`;
}
