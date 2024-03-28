import React from 'react';

import './PaperContainer.scss';

interface PaperContainerProps {
    outlineType?: 'outline-1' | 'outline-2' | 'outline-3' | 'outline-4' | 'outline-5';
    lightType: 'light-1' | 'light-2' | 'light-3' | 'light-4' | 'light-5' | 'normal' | 'dark-1' | 'dark-2' | 'dark-3' | 'dark-4' | 'dark-5';
    secondary?: boolean;
    className?: string;
    children: React.ReactNode;
}

export const PaperContainer: React.FC<PaperContainerProps> = ({
    children,
    className = "",
    lightType = 'normal',
    outlineType,
    secondary = false
}) => {
    let lightClass = chooseLightClass(lightType, secondary);
    let outlineClass = chooseOutlineClass(outlineType);
    return (
        <div className={`paperContainer ${lightClass} ${outlineClass} ${className}`}>
            {children}
        </div>
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
