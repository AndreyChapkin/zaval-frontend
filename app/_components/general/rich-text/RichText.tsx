import React from 'react';

import './RichText.scss';

interface RichTextProps {
    content: string;
    isEditionMode?: boolean;
}

export const RichText = React.forwardRef<HTMLDivElement, RichTextProps>(({ content, isEditionMode = false }, ref) => {
    return (
        <div className='richText' contentEditable={isEditionMode} ref={ref} dangerouslySetInnerHTML={{ __html: content }} />
    );
});
