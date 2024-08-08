import { resolveRichFragment } from './rich-fragments/RichFragments';

import { forwardRef, useMemo } from 'react';
import "./rich-fragments/rich-elements.scss";
import "./RichText.scss";
import { RichElement, RichParagraphElement } from '@/app/_lib/types/rich-text-types';

interface RichTextProps {
    richContent: string | RichElement[];
    isSimpleText?: boolean;
}

function isValidIndex(index: number, text: string): boolean {
    return index > -1 && index < text.length;
}

function convertSimpleTextToRichElements(text: string): RichElement[] {
    const result: RichParagraphElement = {
        type: 'paragraph',
        textFragments: []
    };
    let fallbackTextStartIndex = -1;
    let creatingElementDescription: {
        type: "link";
        nameStartIndex: number;
        nameEndIndex: number;
        hrefStartIndex: number;
    } | {
        type: "text";
        startIndex: number;
    } = {
        type: "text",
        startIndex: 0,
    };
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        // if face "[" - start of the rich link element name
        if (char === '[') {
            // if has fallback text - add it to the result
            if (isValidIndex(fallbackTextStartIndex, text)) {
                result.textFragments.push(text.slice(fallbackTextStartIndex, i));
            }
            // start new fallback text
            fallbackTextStartIndex = i;
            if (creatingElementDescription.type === "text") {
                result.textFragments.push(text.slice(creatingElementDescription.startIndex, i));
            }
            creatingElementDescription = {
                type: "link",
                nameStartIndex: i + 1,
                nameEndIndex: -1,
                hrefStartIndex: -1,
            };
        } else if (char === ']') {
            if (creatingElementDescription.type === "link") {
                const nextChar = text[i + 1];
                if (nextChar === '(') {
                    creatingElementDescription.nameEndIndex = i;
                    creatingElementDescription.hrefStartIndex = i + 2;
                }
            }
        } else if (char === ')') {
            if (
                creatingElementDescription.type === "link" &&
                isValidIndex(creatingElementDescription.nameStartIndex, text) &&
                isValidIndex(creatingElementDescription.nameEndIndex, text) &&
                isValidIndex(creatingElementDescription.hrefStartIndex, text)
            ) {
                // it is valid link element - create it
                result.textFragments.push({
                    type: 'link',
                    name: text.slice(creatingElementDescription.nameStartIndex, creatingElementDescription.nameEndIndex),
                    href: text.slice(creatingElementDescription.hrefStartIndex, i)
                });
                // assume that next element will be text
                creatingElementDescription = {
                    type: "text",
                    startIndex: i + 1,
                };
            } else if (creatingElementDescription.type === "text") {
                continue;
            } else {
                // convert fallback text to the next text fragment
                creatingElementDescription = {
                    type: "text",
                    startIndex: fallbackTextStartIndex,
                };
            }
            // clear fallback text
            fallbackTextStartIndex = -1;
        }
    }
    // if the last element is a text element - add it to the result
    if (isValidIndex(fallbackTextStartIndex, text)) {
        result.textFragments.push(text.slice(fallbackTextStartIndex));
    } else if (creatingElementDescription.type === "text") {
        result.textFragments.push(text.slice(creatingElementDescription.startIndex));
    }
    return [result];
}

export const RichText = forwardRef<HTMLDivElement, RichTextProps>(({ richContent, isSimpleText = false }, ref) => {

    const richElements: RichElement[] = useMemo(() => {
        if (isSimpleText) {
            const content = typeof richContent === 'string' ? richContent : JSON.stringify(richContent);
            return convertSimpleTextToRichElements(content);
        }
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
