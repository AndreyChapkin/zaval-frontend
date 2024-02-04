import React from 'react';
import { ModalWindow } from '../modal-window/ModalWindow';
import { ActionButton } from '../action-button/ActionButton';

import './RemoveModal.scss';

type RemoveModalProps = {
    onAccept: () => void;
    onCancel: () => void;
};

export const RemoveModal: React.FC<RemoveModalProps> = ({ onAccept, onCancel }) => {
    return (
        <ModalWindow onClose={onCancel}>
            <div className="removeModal columnCenterAndCenter gap4">
                <div className="message">Really want to remove?</div>
                <ActionButton label="Yes" tabIndex={0} onClick={onAccept} />
            </div>
        </ModalWindow>

    );
};