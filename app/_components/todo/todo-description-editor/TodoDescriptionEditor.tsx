import React, { useState } from 'react';
import { StandardText } from '../../general/standard-text/StandardText';
import { IconButton } from '../../general/icon-button/IconButton';
import { SAVE_ICON_URL } from '@/app/_lib/constants/image-url-constants';

interface TodoDescriptionEditorProps {
    description: string;
    onSave: (value: string) => void;
}

const TodoDescriptionEditor: React.FC<TodoDescriptionEditorProps> = ({ description, onSave }) => {

    const [innerDescription, setInnerDescription] = useState(description);

    return (
        <>
            <StandardText
                className="flex1"
                value={innerDescription}
                onChange={setInnerDescription}
                onKeyUpEvent={e => {
                    if (e.key === 's' && e.altKey) {
                        onSave(innerDescription);
                    }
                }}
            />
            <IconButton
                iconUrl={SAVE_ICON_URL}
                onClick={() => onSave(innerDescription)}
            />
        </>
    );
};

export default TodoDescriptionEditor;