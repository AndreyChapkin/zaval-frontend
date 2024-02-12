import { resolveRichFragment } from './rich-fragments/RichFragments';

import { forwardRef, useMemo } from 'react';
import "./rich-fragments/rich-elements.scss";
import "./RichText.scss";
import { RichElement } from '@/app/_lib/types/rich-text-types';

interface RichTextProps {
    richContent: string | RichElement[];
}

export const RichText = forwardRef<HTMLDivElement, RichTextProps>(({ richContent }, ref) => {

    const richElements: RichElement[] = useMemo(() => {
        return typeof richContent === 'string' ?
            richContent.length > 0 ? JSON.parse(richContent) : []
            : richContent;
    }, [richContent]);

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

RichText.displayName = 'RichText';
