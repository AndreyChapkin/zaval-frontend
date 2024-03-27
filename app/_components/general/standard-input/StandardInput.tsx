import React, { ChangeEvent, useCallback } from 'react';

import './StandardInput.scss';
import { StandardLabel } from '../standard-label/StandardLabel';

interface StandardInputProps {
    value: string;
    label?: string;
    labelPosition?: 'top' | 'left';
    autofocus?: boolean;
    className?: string;
    onChange: (value: string) => void;
}

export const StandardInput: React.FC<StandardInputProps> = ({ label, labelPosition = 'top', value, autofocus, className = "", onChange }) => {

    const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value || '';
        onChange(value);
    }, [onChange]);

    const standardInput = (
        <input
            className='standardInput'
            autoFocus={autofocus}
            type="text"
            value={value}
            onChange={handleInputChange} />
    );

    return (
        label ?
            <StandardLabel label={label} labelPosition={labelPosition}>
                {standardInput}
            </StandardLabel >
            : standardInput
    );
};