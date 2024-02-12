import React, { ChangeEvent, useCallback } from 'react';

import './StandardLabel.scss';

interface StandardLabelProps {
    label: string;
    labelPosition?: 'top' | 'left';
    className?: string;
    children: React.ReactNode | React.ReactNode[];
}

export const StandardLabel: React.FC<StandardLabelProps> = ({ label, labelPosition = 'top', className = "", children }) => {

    return (
        <div className={`standardLabelWrapper ${className} ${labelPosition === 'left' ? 'rowStartAndEnd' : 'columnStartAndStretch'} gap2`}>
            <label>{label}</label>
            {
                children
            }
        </div>
    );
};