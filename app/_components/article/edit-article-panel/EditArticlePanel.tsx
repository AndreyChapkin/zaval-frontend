import React, { useState } from 'react';
import { RichEditor } from '../../general/rich-editor/RichEditor';
import { StandardInput } from '../../general/standard-input/StandardInput';
import { updateArticle } from '@/app/_lib/calls/article-calls';

interface EditArticlePanelProps {
    articleLight: ArticleLightDto;
    description: string;
    onSuccess: () => void;
    onCancel: () => void;
}

export const EditArticlePanel: React.FC<EditArticlePanelProps> = ({ articleLight, description, onCancel, onSuccess }) => {

    const [editTitle, setEditTitle] = useState(articleLight.title);

    const updateArticleHandler = async (content: string) => {
        await updateArticle(articleLight.id, { title: editTitle, content });
        onSuccess();
    };

    return (
        <div className='editArticlePanel columnStartAndStretch gap1 flex1'>
            <StandardInput value={editTitle} onChange={setEditTitle} />
            <RichEditor className='scrollableInColumn' richContent={description} onSave={updateArticleHandler} onCancel={onCancel} />
        </div>
    );
};