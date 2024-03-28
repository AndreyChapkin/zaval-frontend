import React from 'react';
import { ModalWindow } from '../modal-window/ModalWindow';
import { ActionButton } from '../action-button/ActionButton';

type RemoveModalProps = {
    onAccept: () => void;
    onCancel: () => void;
};

export const RemoveModal: React.FC<RemoveModalProps> = ({ onAccept, onCancel }) => {
    return (
        <ModalWindow width={40} height={40} alignItems='center' justifyContent='center' direction='column' onClose={onCancel}>
            <div className="message mb-6">Really want to remove?</div>
            <ActionButton label="Yes" tabIndex={0} onClick={onAccept} />
        </ModalWindow>

    );
};