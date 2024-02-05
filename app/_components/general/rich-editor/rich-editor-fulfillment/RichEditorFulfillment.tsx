import React from 'react';
import { ActionButton } from '../../action-button/ActionButton';
import { ModalWindow } from '../../modal-window/ModalWindow';
import { StandardInput } from '../../standard-input/StandardInput';
import { FulfillmentInfo, FulfillmentLinkInfo, RichActionDraft } from '../lib/rich-action-processors';

import './RichEditorFulfillment.scss';

interface RichEditorFulfillmentProps {
    draftAction: RichActionDraft;
    onAccept: (info: FulfillmentInfo) => void;
    onCancel: () => void;
}

export const RichEditorFulfillment: React.FC<RichEditorFulfillmentProps> = ({ draftAction, onAccept, onCancel }) => {
    return (
        draftAction.actionName === 'create' &&
        draftAction.richType === 'link' &&
        <ModalWindow onClose={onCancel}>
            <LinkFulfillment onAccept={onAccept} />
        </ModalWindow>
        ||
        <>
        </>
    );
};

interface LinkFulfillmentProps {
    onAccept: (info: FulfillmentLinkInfo) => void;
}

const LinkFulfillment: React.FC<LinkFulfillmentProps> = ({ onAccept }) => {
    const [name, setName] = React.useState('');
    const [href, setHref] = React.useState('');
    return (
        <div className="linkFulfillment columnCenterAndCenter gap2">
            <StandardInput autofocus value={name} onChange={setName} />
            <StandardInput value={href} onChange={setHref} />
            <div className='linkFulfillmentControl'>
                <ActionButton
                    label='Accept'
                    onClick={() => onAccept({
                        richType: 'link',
                        info: { name, href }
                    })} />
            </div>
        </div>
    );
};