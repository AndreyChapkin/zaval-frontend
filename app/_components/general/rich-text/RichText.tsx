import React from 'react';

import { RichElement } from '@/app/_lib/types/rich-text';
import './RichText.scss';
import { resolveRichFragment } from './rich-fragments/RichFragments';

interface RichTextProps {
    richElements: RichElement[];
    isEditionMode?: boolean;
}

export const RichText = React.forwardRef<HTMLDivElement, RichTextProps>(({ richElements, isEditionMode = false }, ref) => {
    return (
        <div className='richText columnStartAndStretch'>
            {
                richElements.map((richElement) => {
                    return resolveRichFragment(richElement);
                })
            }
        </div>
    );
});
