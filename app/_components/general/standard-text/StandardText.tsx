import React, { ChangeEvent, KeyboardEventHandler, useCallback } from 'react';

import './StandardText.scss';
import { StandardLabel } from '../standard-label/StandardLabel';

interface StandardTextProps {
    value: string;
    label?: string;
    labelPosition?: 'top' | 'left';
    autofocus?: boolean;
    className?: string;
    rows?: number;
    onChange: (value: string) => void;
    onKeyUpEvent?: KeyboardEventHandler<HTMLTextAreaElement>;
}

const InnerStandardText: React.ForwardRefRenderFunction<HTMLTextAreaElement, StandardTextProps> = ({
    label,
    labelPosition = 'top',
    value,
    rows = 2,
    autofocus,
    className = "",
    onChange,
    onKeyUpEvent,
}, ref) => {

    const handleInputChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value || '';
        onChange(value);
    }, [onChange]);

    const standardText = (
        <textarea
            ref={ref}
            className="standardText flex1"
            autoFocus={autofocus}
            value={value}
            rows={rows}
            onKeyUp={onKeyUpEvent}
            onChange={handleInputChange} />
    );

    return (
        label ?
            <StandardLabel className={className} label={label} labelPosition={labelPosition}>
                {standardText}
            </StandardLabel >
            : standardText
    );
};

export const StandardText = React.forwardRef<HTMLTextAreaElement, StandardTextProps>(InnerStandardText);