import React from 'react';

import FLine, { FLineProps } from '../flex-line/FLine';
import './FPaper.scss';

export interface FPaperProps extends FLineProps {
    outline?: 1 | 2 | 3 | 4 | 5;
    outlineLightType?: 'l-1' | 'l-2' | 'l-3' | 'l-4' | 'l-5' | 'none' | 'd-1' | 'd-2' | 'd-3' | 'd-4' | 'd-5';
    lightType?: 'l-1' | 'l-2' | 'l-3' | 'l-4' | 'l-5' | 'none' | 'd-1' | 'd-2' | 'd-3' | 'd-4' | 'd-5';
    interactive?: boolean;
    secondary?: boolean;
    style?: any;
}

export const FPaper: React.FC<FPaperProps> = ({
    className = "",
    lightType = 'none',
    outline,
    outlineLightType,
    interactive = false,
    secondary = false,
    ...rest
}) => {
    const lightClass = chooseLightClass(lightType, secondary, interactive);
    const outlineClass = chooseOutlineClass(outline, outlineLightType, secondary, interactive);

    return (
        <FLine
            className={`${lightClass} ${outlineClass} ${className}`}
            {...rest}
        />
    );
};

function chooseLightClass(lightType: FPaperProps["lightType"], secondary: boolean = false, interactive: boolean = false) {
    let resultLightClass = "fPaper";
    if (secondary) {
        resultLightClass = `secondary-${resultLightClass}`;
    } else {
        resultLightClass = `main-${resultLightClass}`;
    }
    if (interactive) {
        resultLightClass = `interactive-${resultLightClass}`;
    }
    const lightClassPostfix = chooseLightClassPostfix(lightType);
    if (lightClassPostfix) {
        resultLightClass = `${resultLightClass}-${lightClassPostfix}`;
    }
    return resultLightClass;
}

function chooseOutlineClass(
    outline: FPaperProps['outline'],
    outlineLightType: FPaperProps['outlineLightType'],
    secondary: boolean = false,
    interactive: boolean = false
) {
    if (!outline) {
        return "";
    }
    let resultOutlineClass = `outline-${outline}`;
    if (!outlineLightType) {
        return resultOutlineClass;
    }
    let resultOutlineLightClass = "outline";
    if (secondary) {
        resultOutlineLightClass = `secondary-${resultOutlineLightClass}`;
    } else {
        resultOutlineLightClass = `main-${resultOutlineLightClass}`;
    }
    if (interactive) {
        resultOutlineLightClass = `interactive-${resultOutlineLightClass}`;
    }
    const lightClassPostfix = chooseLightClassPostfix(outlineLightType);
    if (lightClassPostfix) {
        resultOutlineLightClass = `${resultOutlineLightClass}-${lightClassPostfix}`;
    }
    return `${resultOutlineClass} ${resultOutlineLightClass}`;
}

type LightTypeClassPostfix = 'light-1' | 'light-2' | 'light-3' | 'light-4' | 'light-5' | 'dark-1' | 'dark-2' | 'dark-3' | 'dark-4' | 'dark-5';

function chooseLightClassPostfix(lightType: FPaperProps['lightType']): LightTypeClassPostfix | null {
    if (lightType === 'none') {
        return null;
    }
    switch (lightType) {
        case 'l-1':
            return 'light-1';
        case 'l-2':
            return 'light-2';
        case 'l-3':
            return 'light-3';
        case 'l-4':
            return 'light-4';
        case 'l-5':
            return 'light-5';
        case 'd-1':
            return 'dark-1';
        case 'd-2':
            return 'dark-2';
        case 'd-3':
            return 'dark-3';
        case 'd-4':
            return 'dark-4';
        case 'd-5':
            return 'dark-5';
        default:
            return null;
    }
}
