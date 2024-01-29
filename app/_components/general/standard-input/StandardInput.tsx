import React, { ChangeEvent, useCallback } from 'react';

import './StandardInput.scss';

interface StandardInputProps {
    value: string;
    autofocus?: boolean;
    onChange: (value: string) => void;
}

export const StandardInput: React.FC<StandardInputProps> = ({ value, autofocus, onChange }) => {
    
    const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    }, [onChange]);

    return (
        <input
            autoFocus={autofocus}
            className="standardInput"
            type="text"
            value={value}
            onChange={handleInputChange} />
    );
};