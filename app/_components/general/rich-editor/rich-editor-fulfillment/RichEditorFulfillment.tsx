import React, { useEffect } from 'react';
import { ActionButton } from '../../action-button/ActionButton';
import { ModalWindow } from '../../modal-window/ModalWindow';
import { StandardInput } from '../../standard-input/StandardInput';
import { FulfillmentInfo, FulfillmentLinkInfo, RichActionDraft } from '../lib/rich-action-processors';

import './RichEditorFulfillment.scss';
import { readFromClipboard } from '@/app/_lib/utils/function-helpers';

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
    const [name, setName] = React.useState('link');
    const [href, setHref] = React.useState('');

    useEffect(() => {
        // read link from clipboard
        readFromClipboard("text/plain").then(clipboardContent => {
            const potentialLink = clipboardContent as string;
            if (potentialLink.startsWith('http://') || potentialLink.startsWith('https://') || potentialLink.startsWith('/')) {
                setHref(potentialLink);
            }
        });
    }, []);

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