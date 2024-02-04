import { RichElement } from '@/app/_lib/types/rich-text-types';
import { resolveRichFragment } from './rich-fragments/RichFragments';

import "./rich-fragments/rich-elements.scss";
import "./RichText.scss";
import { forwardRef } from 'react';

interface RichTextProps {
    richElements: RichElement[];
    isEditionMode?: boolean;
}

export const RichText = forwardRef<HTMLDivElement, RichTextProps>(({ richElements }, ref) => {
    return (
        <div className='richText columnStartAndStretch scrollableInColumn'>
            {
                richElements.map((richElement) => {
                    return resolveRichFragment(richElement);
                })
            }
        </div>
    );
});
