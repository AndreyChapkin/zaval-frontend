import React from 'react';
import { ModalWindow } from '../../modal-window/ModalWindow';

import './RichEditorShortkeys.scss';

interface RichEditorShortkeysProps {
    onClose: () => void;
}

const RichEditorShortkeys: React.FC<RichEditorShortkeysProps> = ({ onClose }) => {
    return (
        <ModalWindow onClose={onClose}>
            <div className="richEditorShortkeys">
                <div className="column">
                    <div className="controlPrompt"><b>Create title 1</b><span>Alt+1</span></div>
                    <div className="controlPrompt"><b>Create paragraph</b><span>Alt+2</span></div>
                    <div className="controlPrompt"><b>Create link</b><span>Alt+3</span></div>
                    <div className="controlPrompt"><b>Create list item</b><span>Alt+4</span></div>
                    <div className="controlPrompt"><b>Create united block</b><span>Alt+5</span></div>
                    <div className="controlPrompt"><b>Create expandable block</b><span>Alt+6</span></div>
                    <div className="controlPrompt"><b>Create code block</b><span>Alt+7</span></div>
                    <div className="controlPrompt"><b>Extend list</b><span>Alt+Shift+E</span></div>
                    <div className="controlPrompt"><b>Upgrade title</b><span>Alt+Equal</span></div>
                    <div className="controlPrompt"><b>Downgrade title</b><span>Alt+Minus</span></div>
                </div>
                <div className="column">
                    <div className="controlPrompt"><b>Move selected up</b><span>Alt+Up</span></div>
                    <div className="controlPrompt"><b>Move selected down</b><span>Alt+Down</span></div>
                    <div className="controlPrompt"><b>Select parent</b><span>Alt+Shift+Left</span></div>
                    <div className="controlPrompt"><b>Copy selected</b><span>Alt+C</span></div>
                    <div className="controlPrompt"><b>Replace selected</b><span>Alt+Shift+C</span></div>
                    <div className="controlPrompt"><b>Delete selected</b><span>Alt+Delete</span></div>
                    <div className="controlPrompt"><b>Restore deleted</b><span>Alt+Shift+Delete</span></div>
                </div>
                <div className="column">
                    <div className="controlPrompt"><b>Save</b><span>Alt+S</span></div>
                    <div className="controlPrompt"><b>Prompts</b><span>Alt+H</span></div>
                    <div className="controlPrompt"><b>Exit</b><span>Esc</span></div>
                </div>
            </div>
        </ModalWindow>
    );
};

export default RichEditorShortkeys;
