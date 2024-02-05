import React, { ChangeEvent, useCallback } from 'react';

import './StandardInput.scss';

interface StandardInputProps {
    value: string;
    autofocus?: boolean;
    className?: string;
    onChange: (value: string) => void;
}

export const StandardInput: React.FC<StandardInputProps> = ({ value, autofocus, className = "", onChange }) => {
    
    const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value || '';
        onChange(value);
    }, [onChange]);

    return (
        <input
            autoFocus={autofocus}
            className={`standardInput ${className}`}
            type="text"
            value={value}
            onChange={handleInputChange} />
    );
};