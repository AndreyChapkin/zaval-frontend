import React, { use, useEffect, useRef, useState } from 'react';
import { StandardText } from '../../general/standard-text/StandardText';
import { IconButton } from '../../general/icon-button/IconButton';
import { CANCEL_ICON_URL, SAVE_ICON_URL } from '@/app/_lib/constants/image-url-constants';
import FCol from '../../general/flex-line/FCol';

interface TodoDescriptionEditorProps {
    description: string;
    onSave: (value: string) => void;
    onCancel: () => void;
}

const TodoDescriptionEditor: React.FC<TodoDescriptionEditorProps> = ({ description, onSave, onCancel }) => {

    const [innerDescription, setInnerDescription] = useState(description);
    const [cursorPosition, setCursorPosition] = useState(0);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        // set cursor position after first inserted link paranthesis
        textareaRef.current?.setSelectionRange(cursorPosition + 1, cursorPosition + 1);
    }, [cursorPosition]);

    return (
        <>
            <StandardText
                ref={textareaRef}
                className="flex1"
                value={innerDescription}
                onChange={setInnerDescription}
                onKeyUpEvent={e => {
                    if (e.key === 's' && e.altKey) {
                        onSave(innerDescription);
                    } else if (e.key === 'l' && e.altKey) {
                        // insert link text in current cursor position
                        e.preventDefault();
                        const selectionStart = e.currentTarget.selectionStart;
                        const selectionEnd = e.currentTarget.selectionEnd;
                        const linkText = '[]()';
                        const newDescription = innerDescription.slice(0, selectionStart) + linkText + innerDescription.slice(selectionEnd);
                        setInnerDescription(newDescription);
                        setCursorPosition(selectionStart);
                    }
                }}
            />
            <FCol spacing={3}>
                <IconButton
                    iconUrl={SAVE_ICON_URL}
                    onClick={() => onSave(innerDescription)}
                />
                <IconButton
                    iconUrl={CANCEL_ICON_URL}
                    onClick={onCancel}
                />
            </FCol>
        </>
    );
};

export default TodoDescriptionEditor;