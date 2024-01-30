import { CODE_ICON_URL } from "@/app/_lib/constants/image-url-constants";
import { RICH_CODE_BLOCK_CONTENT_CLASS, RICH_CODE_BLOCK_ICON_CLASS, RICH_EXPANDABLE_BLOCK_CONTENT_CLASS, RICH_EXPANDABLE_BLOCK_TITLE_CLASS, RICH_LIST_ITEM_CONTENT_CLASS, RICH_LIST_ITEM_SIGN_CLASS, RICH_TYPE_TO_CLASS_NAME_MAP, RichCodeBlockElement, RichElement, RichExpandableBlockElement, RichLinkElement, RichListElement, RichListItemElement, RichParagraphElement, RichSimpleElement, RichStrongElement, RichTitleElement, RichUnitedBlockElement, RichUnknownElement } from "@/app/_lib/types/rich-text";
import { useState } from "react";

export function resolveRichFragment(richElement: RichElement | string): React.ReactNode {
    if (typeof richElement === 'string') {
        return richElement;
    } else {
        switch (richElement.type) {
            case 'paragraph':
                return <RichParagraph richElement={richElement} />;
            case 'simple':
                return <RichSimple richElement={richElement} />;
            case 'link':
                return <RichLink richElement={richElement} />;
            case 'strong':
                return <RichStrong richElement={richElement} />;
            case 'title-1':
            case 'title-2':
            case 'title-3':
            case 'title-4':
                return <RichTitle richElement={richElement} />;
            case 'list':
                return <RichList richElement={richElement} />;
            case 'list-item':
                return <RichListItem richElement={richElement} />;
            case 'expandable-block':
                return <RichExpandableBlock richElement={richElement} />;
            case 'united-block':
                return <RichUnitedBlock richElement={richElement} />;
            case 'code-block':
                return <RichCodeBlock richElement={richElement} />;
            case 'unknown':
                return <RichUnknown richElement={richElement} />;
        }
    }
}

export interface RichElementProps<T extends RichElement> {
    richElement: T;
};

export const RichParagraph: React.FC<RichElementProps<RichParagraphElement>> = ({ richElement }) => (
    <p className={RICH_TYPE_TO_CLASS_NAME_MAP['paragraph']}>
        {richElement.children.map(resolveRichFragment)}
    </p>
);

export const RichSimple: React.FC<RichElementProps<RichSimpleElement>> = ({ richElement }) => (
    <span className={RICH_TYPE_TO_CLASS_NAME_MAP['simple']}>
        {richElement.text}
    </span>
);

export const RichLink: React.FC<RichElementProps<RichLinkElement>> = ({ richElement }) => (
    <a className={RICH_TYPE_TO_CLASS_NAME_MAP['link']} href={richElement.href}>
        {richElement.name}
    </a>
);

export const RichStrong: React.FC<RichElementProps<RichStrongElement>> = ({ richElement }) => (
    <strong className={RICH_TYPE_TO_CLASS_NAME_MAP['strong']}>
        {richElement.text}
    </strong>
);

export const RichTitle: React.FC<RichElementProps<RichTitleElement>> = ({ richElement }) => {
    switch (richElement.type) {
        case 'title-1':
            return <h1 className={RICH_TYPE_TO_CLASS_NAME_MAP[richElement.type]}>{richElement.text}</h1>;
        case 'title-2':
            return <h2 className={RICH_TYPE_TO_CLASS_NAME_MAP[richElement.type]}>{richElement.text}</h2>;
        case 'title-3':
            return <h3 className={RICH_TYPE_TO_CLASS_NAME_MAP[richElement.type]}>{richElement.text}</h3>;
        case 'title-4':
            return <h4 className={RICH_TYPE_TO_CLASS_NAME_MAP[richElement.type]}>{richElement.text}</h4>;
    }
};

export const RichList: React.FC<RichElementProps<RichListElement>> = ({ richElement }) => (
    <ul className={RICH_TYPE_TO_CLASS_NAME_MAP['list']}>
        {richElement.children.map(resolveRichFragment)}
    </ul>
);

export const RichListItem: React.FC<RichElementProps<RichListItemElement>> = ({ richElement }) => (
    <li className={`${RICH_TYPE_TO_CLASS_NAME_MAP['list-item']} rowStartAndStart`}>
        <div className={RICH_LIST_ITEM_SIGN_CLASS} />
        <div className={`${RICH_LIST_ITEM_CONTENT_CLASS}`}>
            {richElement.children.map(resolveRichFragment)}
        </div>
    </li>
);

export const RichExpandableBlock: React.FC<RichElementProps<RichExpandableBlockElement>> = ({ richElement }) => {

    const [isExpanded, setIsExpanded] = useState(false);

    const clickHandler = () => setIsExpanded(!isExpanded);


    return (<div className={RICH_TYPE_TO_CLASS_NAME_MAP['expandable-block']}>
        <div className={RICH_EXPANDABLE_BLOCK_TITLE_CLASS} onClick={clickHandler}>
            {richElement.title}
        </div>
        {
            isExpanded &&
            <div className={RICH_EXPANDABLE_BLOCK_CONTENT_CLASS}>
                {richElement.children.map(resolveRichFragment)}
            </div>
        }
    </div>);
};

export const RichUnitedBlock: React.FC<RichElementProps<RichUnitedBlockElement>> = ({ richElement }) => (
    <div className={RICH_TYPE_TO_CLASS_NAME_MAP['united-block']}>
        {richElement.children.map(resolveRichFragment)}
    </div>
);

export const RichCodeBlock: React.FC<RichElementProps<RichCodeBlockElement>> = ({ richElement }) => (
    <div className={RICH_TYPE_TO_CLASS_NAME_MAP['code-block']}>
        <div className={`${RICH_CODE_BLOCK_ICON_CLASS} rowCenterAndCenter`}>
            <img
                src={CODE_ICON_URL}
                alt="status"
            />
        </div>
        <pre className={RICH_CODE_BLOCK_CONTENT_CLASS}>
            {richElement.text}
        </pre>
    </div>
);

export const RichUnknown: React.FC<RichElementProps<RichUnknownElement>> = ({ richElement }) => (
    <div className={RICH_TYPE_TO_CLASS_NAME_MAP['unknown']}>
        {richElement.text}
    </div>
);