import React, { ChangeEvent, use, useCallback, useEffect, useState } from 'react';

import './StandardInput.scss';
import { StandardLabel } from '../standard-label/StandardLabel';
import { useMobileQuery } from '@/app/_lib/utils/hooks';

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

    const isMobile = useMobileQuery();

    const [effectiveLabelPosition, setEffectiveLabelPosition] = useState(labelPosition);

    useEffect(() => {
        if (isMobile) {
            setEffectiveLabelPosition('top');
        } else {
            setEffectiveLabelPosition(labelPosition);
        }
    }, [isMobile]);

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
            <StandardLabel label={label} labelPosition={effectiveLabelPosition}>
                {standardInput}
            </StandardLabel >
            : standardInput
    );
};