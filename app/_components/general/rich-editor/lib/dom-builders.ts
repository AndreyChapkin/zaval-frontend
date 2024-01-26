type TagNameType = 'div' | 'span' | 'p' | 'a' | 'strong' | 'ul' | 'li' | 'h1' | 'h2' | 'h3' | 'h4' | 'pre' | 'code';

export interface TagAttributes {
    href?: string;
    id?: string;
};

export function htmlElem(props: {
    tag: TagNameType;
    classes?: string[] | string;
    attrs?: TagAttributes;
    children?: HTMLElement | string | (HTMLElement | string)[]
}): HTMLElement {
    const element = document.createElement(props.tag);
    if (props.classes) {
        if (typeof props.classes === 'string') {
            element.classList.add(props.classes);
        } else {
            element.classList.add(...props.classes);
        }
    }
    if (props.attrs) {
        Object.entries(props.attrs).forEach(([key, value]) => {
            if (value) {
                element.setAttribute(key, value);
            }
        });
    }
    if (props.children) {
        if (Array.isArray(props.children)) {
            element.append(...props.children);
        } else {
            element.append(props.children);
        }
    }
    return element;
}