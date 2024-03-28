import React from 'react';

import './StandardLabel.scss';
import FCol from '../flex-line/FCol';
import FRow from '../flex-line/FRow';

interface StandardLabelProps {
    label: string;
    labelPosition?: 'top' | 'left';
    className?: string;
    children: React.ReactNode | React.ReactNode[];
}

export const StandardLabel: React.FC<StandardLabelProps> = ({ label, labelPosition = 'top', className = "", children }) => {

    return (
        labelPosition === 'top' ?
            <FCol className={`standardLabelWrapper ${className}`} alignItems='stretch' justifyContent='start'>
                <label>{label}</label>
                {
                    children
                }
            </FCol>
            :
            <FRow className={`standardLabelWrapper ${className}`} alignItems='center' justifyContent='start' spacing={2}>
                <label>{label}</label>
                {
                    children
                }
            </FRow>
    );
};