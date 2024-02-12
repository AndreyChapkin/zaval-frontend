import { useState } from "react";
import { ActionButton } from "../../general/action-button/ActionButton";
import { ModalWindow } from "../../general/modal-window/ModalWindow";
import { StandardInput } from "../../general/standard-input/StandardInput";

import { createArticle } from "@/app/_lib/calls/article-calls";
import './CreateArticleModal.scss';

export interface CreateArticleModalProps {
    onCancel: () => void;
    onSuccess: (articleLight: ArticleLightDto) => void;
}

function CreateArticleModal({ onCancel, onSuccess }: CreateArticleModalProps) {

    const [title, setTitle] = useState('');

    const createHandler = async () => {
        const createdArticleLight = await createArticle(title);
        onSuccess(createdArticleLight);
    };

    return (
        <ModalWindow onClose={onCancel}>
            <div className="createArticleModal columnCenterAndStretch gap6">
                <div className="editPanel columnStartAndStretch">
                    <StandardInput
                        value={title}
                        label="Article title"
                        onChange={setTitle} />
                </div>
                <div className="controlPanel rowCenter gap5">
                    <ActionButton
                        label="Create"
                        onClick={createHandler} />
                    <ActionButton
                        label="Cancel"
                        onClick={onCancel} />
                </div>
            </div>
        </ModalWindow>
    );
}

export default CreateArticleModal;