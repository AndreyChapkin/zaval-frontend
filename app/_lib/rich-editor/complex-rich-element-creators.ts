import { RICH_CODE_BLOCK_CONTENT_CLASS, RICH_CODE_BLOCK_ICON_CLASS, RICH_EXPANDABLE_BLOCK_CONTENT_CLASS, RICH_EXPANDABLE_BLOCK_TITLE_CLASS, RICH_LIST_ITEM_CONTENT_CLASS, RICH_LIST_ITEM_SIGN_CLASS, RICH_TYPES_TO_RICH_CLASSES_MAP } from "../types/rich-text";
import { createNewSimpleRichElement } from "./rich-editor-helpers";

export function createList(content: (HTMLElement | string)[] | string | null): HTMLElement {
    const listWrapper = document.createElement('ul');
    const richClass = RICH_TYPES_TO_RICH_CLASSES_MAP['list'];
    listWrapper.classList.add(richClass);
    if (content) {
        if (typeof content === 'string') {
            // string content
            listWrapper.append(createListItem(content));
        } else {
            // array content
            for (let contentElement of content) {
                if (typeof contentElement === 'string') {
                    listWrapper.append(createListItem(contentElement));
                } else {
                    listWrapper.append(contentElement);
                }
            }
        }
    }
    return listWrapper;
}

export function createListItem(content: (HTMLElement | string)[] | string | null): HTMLElement {
    const listItemWrapper = document.createElement('div');
    const richClass = RICH_TYPES_TO_RICH_CLASSES_MAP['list-item'];
    listItemWrapper.classList.add(richClass);

    const signElement = document.createElement('div');
    signElement.classList.add(RICH_LIST_ITEM_SIGN_CLASS);

    const contentElement = document.createElement('li');
    contentElement.classList.add(RICH_LIST_ITEM_CONTENT_CLASS);

    if (typeof content === 'string') {
        const paragraphElement = createNewSimpleRichElement('paragraph', content ?? 'placeholder');
        contentElement.append(paragraphElement);
    } else if (content) {
        contentElement.append(...content);
    } else {
        // null content
        const paragraphElement = createNewSimpleRichElement('paragraph', 'placeholder');
        contentElement.append(paragraphElement);
    }

    listItemWrapper.append(signElement, contentElement);
    return listItemWrapper;
}

export function createUnitedBlock(content: (string | HTMLElement)[] | string | null): HTMLElement {
    const unitedBlockWrapper = document.createElement('div');
    const richClass = RICH_TYPES_TO_RICH_CLASSES_MAP['united-block'];
    unitedBlockWrapper.classList.add(richClass);

    if (typeof content === 'string') {
        // string content
        const paragraphElement = createNewSimpleRichElement('paragraph', content);
        unitedBlockWrapper.append(paragraphElement);
    } else if (content) {
        // array content
        unitedBlockWrapper.append(...content);
    } else {
        // null content
        const paragraphElement = createNewSimpleRichElement('paragraph', 'placeholder');
        unitedBlockWrapper.append(paragraphElement);
    }
    return unitedBlockWrapper;
}

export function createCodeBlock(content: string | null): HTMLElement {
    const codeBlockWrapper = document.createElement('div');
    const richClass = RICH_TYPES_TO_RICH_CLASSES_MAP['code-block'];
    codeBlockWrapper.classList.add(richClass);

    const iconElement = document.createElement('div');
    iconElement.classList.add(RICH_CODE_BLOCK_ICON_CLASS);

    const contentElement = document.createElement('div');
    contentElement.classList.add(RICH_CODE_BLOCK_CONTENT_CLASS);

    if (typeof content === 'string') {
        contentElement.append(content);
    } else {
        // null content
        contentElement.append('placeholder');
    }

    codeBlockWrapper.append(iconElement, contentElement);
    return codeBlockWrapper;
}

export function createExpandableBlock(content: (HTMLElement | string)[] | string | null): HTMLElement {
    const expandableBlockWrapper = document.createElement('div');
    const richClass = RICH_TYPES_TO_RICH_CLASSES_MAP['expandable-block'];
    expandableBlockWrapper.classList.add(richClass);

    const titleElement = document.createElement('div');
    titleElement.classList.add(RICH_EXPANDABLE_BLOCK_TITLE_CLASS);

    const contentElement = document.createElement('div');
    contentElement.classList.add(RICH_EXPANDABLE_BLOCK_CONTENT_CLASS);

    if (typeof content === 'string') {
        titleElement.append(content);
        const paragraphElement = createNewSimpleRichElement('paragraph', 'placeholder');
        contentElement.append(paragraphElement);
    } else if (content) {
        // array
        const [title, ...bodyContent] = content;
        titleElement.append(title);
        contentElement.append(...bodyContent);
    } else {
        // null content
        titleElement.append('placeholder');
        const paragraphElement = createNewSimpleRichElement('paragraph', 'placeholder');
        contentElement.append(paragraphElement);
    }

    expandableBlockWrapper.append(titleElement, contentElement);
    return expandableBlockWrapper;
}

export function appendToListItem(listItemElement: HTMLElement, childElement: HTMLElement) {
    const contentElement = listItemElement.querySelector(`.${RICH_LIST_ITEM_CONTENT_CLASS}`);
    if (contentElement) {
        contentElement.append(childElement);
    }
}

export function appendToCodeBlock(codeBlockElement: HTMLElement, content: string) {
    const contentElement = codeBlockElement.querySelector(`.${RICH_CODE_BLOCK_CONTENT_CLASS}`);
    if (contentElement) {
        contentElement.append(content);
    }
}

export function appendToExpandableBlock(expandableBlockElement: HTMLElement, childElement: HTMLElement) {
    const contentElement = expandableBlockElement.querySelector(`.${RICH_EXPANDABLE_BLOCK_CONTENT_CLASS}`);
    if (contentElement) {
        contentElement.append(childElement);
    }
}

export function insertListChildren(element: HTMLElement, childrenArray: ChildNode[]) {
    for (let childNode of element.childNodes) {
        childrenArray.push(childNode);
    }
}

export function insertListItemChildren(element: HTMLElement, childrenArray: ChildNode[]) {
    const contentElement = element.querySelector(`.${RICH_LIST_ITEM_CONTENT_CLASS}`);
    if (contentElement) {
        for (let childNode of contentElement.childNodes) {
            childrenArray.push(childNode);
        }
    }
}

export function insertCodeBlockChildren(element: HTMLElement, childrenArray: ChildNode[]) {
    const contentElement = element.querySelector(`.${RICH_CODE_BLOCK_CONTENT_CLASS}`);
    if (contentElement) {
        for (let childNode of contentElement.childNodes) {
            childrenArray.push(childNode);
        }
    }
}

export function insertUnitedBlockChildren(element: HTMLElement, childrenArray: ChildNode[]) {
    for (let childNode of element.childNodes) {
        childrenArray.push(childNode);
    }
}

export function insertExpandableBlockChildren(element: HTMLElement, childrenArray: ChildNode[]) {
    const titleElement = element.querySelector(`.${RICH_EXPANDABLE_BLOCK_TITLE_CLASS}`);
    const contentElement = element.querySelector(`.${RICH_EXPANDABLE_BLOCK_CONTENT_CLASS}`);
    if (titleElement && contentElement) {
        // append title as first child
        childrenArray.push(titleElement.childNodes[0]);
        // append content children as the rest
        for (let childNode of contentElement.childNodes) {
            childrenArray.push(childNode);
        }
    }

}