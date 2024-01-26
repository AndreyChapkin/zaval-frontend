import { decreaseNumberOfCalls } from '@/app/_lib/utils/function-helpers';
import React, { useCallback, useState } from 'react';

interface RichEditorEditorProps {
    text: string;
    onChange: (newText: string) => void;
}

const RichEditorEditor: React.FC<RichEditorEditorProps> = ({ text, onChange }) => {

    const [value, setValue] = useState(text);

    const changeWrapper = useCallback(decreaseNumberOfCalls((value: string) => {
        onChange(value);
    }, 1000), [onChange]);

    return (
        <div>
            <textarea value={value} onChange={(e) => {
                changeWrapper(e.target.value);
                setValue(e.target.value);
            }} />
        </div>
    );
};

export default RichEditorEditor;
