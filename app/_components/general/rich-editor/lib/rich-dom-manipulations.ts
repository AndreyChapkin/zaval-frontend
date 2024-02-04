import { RICH_CLASS_NAMES, RICH_CLASS_NAME_TO_TYPE_MAP, RICH_CODE_BLOCK_CONTENT_CLASS, RICH_CODE_BLOCK_ICON_CLASS, RICH_EXPANDABLE_BLOCK_CONTENT_CLASS, RICH_EXPANDABLE_BLOCK_TITLE_CLASS, RICH_LIST_ITEM_CONTENT_CLASS, RICH_LIST_ITEM_SIGN_CLASS, RICH_SELECTED_ELEMENT_CLASS, RICH_TYPE_TO_CLASS_NAME_MAP, RichClassName, RichCodeBlockElement, RichElement, RichExpandableBlockElement, RichLinkElement, RichListElement, RichListItemElement, RichParagraphElement, RichParentElement, RichSimpleElement, RichStrongElement, RichTitleElement, RichTitleType, RichType, RichUnitedBlockElement, RichUnknownElement, isRichParentElement } from "@/app/_lib/types/rich-text-types";
import { useEffect, useState } from "react";
import { htmlElem } from "./dom-builders";
import { findNearestParentElement } from "./dom-manipulation";
import { findSelectedElement } from "./dom-selections";

export interface SelectedElementInfo {
	element: HTMLElement;
	richType: RichType;
}

export function useRichDomManipulator(containerElementRef: React.RefObject<HTMLElement>) {
	const [richDomManipulator, setRichDomManipulator] = useState<RichDomManipulator | null>(null);

	useEffect(() => {
		if (containerElementRef.current) {
			setRichDomManipulator(new RichDomManipulator(containerElementRef.current));
		}
	}, [containerElementRef.current]);

	return richDomManipulator;
}

export class RichDomManipulator {
	containerElement: HTMLElement;
	selectedElementInfo: { element: HTMLElement; richType: RichType } | null = null;

	constructor(containerElement: HTMLElement) {
		this.containerElement = containerElement;
	}

	setAsSelectedElement(element: HTMLElement, richType?: RichType): { element: HTMLElement, richType: RichType } {
		const selectedType = richType ?? defineElementRichType(element)!!;
		// change selected element class indicator
		if (this.selectedElementInfo) {
			this.selectedElementInfo.element.classList.remove(RICH_SELECTED_ELEMENT_CLASS);
		}
		element.classList.add(RICH_SELECTED_ELEMENT_CLASS);
		this.selectedElementInfo = {
			element,
			richType: selectedType
		}
		return this.selectedElementInfo;
	}

	findSelectedRichElement(): { element: HTMLElement, richType: RichType } | null {
		let element = findSelectedElement();
		let richType = element && defineElementRichType(element);
		while (element && !richType) {
			if (element === this.containerElement) {
				return null;
			}
			element = findNearestParentElement(element);
			richType = element && defineElementRichType(element);
		}
		if (richType && element) {
			return {
				element,
				richType
			};
		}
		return null;
	}

	findNearestRichElement(
		childElement: Node,
		excludeTypes: RichType[] = [],
	): { element: HTMLElement, type: RichType | 'container' } | null {
		let element = findNearestParentElement(childElement);
		let richType = element && defineElementRichType(element);
		while (element && (!richType || excludeTypes.indexOf(richType) > -1)) {
			if (element === this.containerElement) {
				return {
					type: 'container',
					element: this.containerElement,
				};
			}
			element = findNearestParentElement(element);
			richType = element && defineElementRichType(element);
		}
		if (richType && element) {
			return {
				element,
				type: richType
			};
		}
		return null;
	}

	findNearestRichParentElement(
		childElement: Node,
		excludeTypes: RichType[] = [],
	): { element: HTMLElement, type: RichType | 'container' } | null {
		let elementInfo = this.findNearestRichElement(childElement);
		while (elementInfo && elementInfo.type !== 'container' && excludeTypes.indexOf(elementInfo.type) > -1) {
			elementInfo = this.findNearestRichElement(elementInfo.element);
		}
		if (elementInfo && isRichParentElement(elementInfo.type as any)) {
			return elementInfo;
		}
		return null;
	}

	findNearestRichRootElement(childElement: Node): HTMLElement | null {
		let searchResult = this.findNearestRichElement(childElement);
		if (searchResult?.type === 'container') {
			if (childElement instanceof HTMLElement) {
				const childType = defineElementRichType(childElement);
				if (childType) {
					return childElement as HTMLElement;
				}
			}
		}
		let prevSearchResult = null;
		while (searchResult && searchResult.type !== 'container') {
			prevSearchResult = searchResult;
			searchResult = this.findNearestRichElement(searchResult.element);
		}
		return prevSearchResult && prevSearchResult.element;
	}

	findNearestElementWithType(richType: RichType, childElement: Node): HTMLElement | null {
		let searchResult = this.findNearestRichParentElement(childElement);
		while (searchResult && searchResult.type !== 'container') {
			if (searchResult.type === richType) {
				return searchResult.element;
			}
			searchResult = this.findNearestRichParentElement(searchResult.element);
		}
		return null;
	}

	extractAllRichElements(): RichElement[] {
		const children = Array.from(this.containerElement.children) as HTMLElement[];
		return children.map(parseRichHTMLElement);
	}

	extractSelectedElementHtml(): string | null {
		const content = this.selectedElementInfo?.element.outerHTML;
		if (content) {
			return content;
		}
		return null;
	}
}

export function defineElementRichType(element: HTMLElement): RichType | null {
	if (element) {
		let richClass: RichClassName | null = null;
		for (let className of element.classList) {
			if (RICH_CLASS_NAMES.indexOf(className as any) > -1) {
				richClass = className as RichClassName;
				break;
			}
		}
		if (richClass) {
			return RICH_CLASS_NAME_TO_TYPE_MAP[richClass]!!;
		}
	}
	return null;
}

export function createRichHTMLElement(
	richElement: RichElement,
): HTMLElement {
	const translator = RichTranslators[richElement.type];
	return translator.toHtml(richElement);
}

export function parseRichHTMLElement(
	htmlElement: HTMLElement,
): RichElement {
	const richType = defineElementRichType(htmlElement);
	if (richType) {
		const translator = RichTranslators[richType];
		return translator.fromHtml(htmlElement as any);
	}
	return {
		type: 'unknown',
		text: htmlElement.innerText,
	};
}

function chooseTitleTag(titleType: RichTitleType): 'h1' | 'h2' | 'h3' | 'h4' {
	switch (titleType) {
		case 'title-1':
			return 'h1';
		case 'title-2':
			return 'h2';
		case 'title-3':
			return 'h3';
		case 'title-4':
			return 'h4';
	}
}

const titleTranslator = {
	toHtml: (elem: RichTitleElement) => {
		return htmlElem({
			tag: chooseTitleTag(elem.type),
			classes: RICH_TYPE_TO_CLASS_NAME_MAP[elem.type],
			attrs: {
				id: elem.id,
			},
			children: elem.text,
		});
	},
	fromHtml: (htmlElem: HTMLElement): RichTitleElement => {
		const titleType = defineElementRichType(htmlElem)!! as RichTitleType;
		return {
			type: titleType,
			text: htmlElem.innerText,
			id: htmlElem.getAttribute('id')!!,
		};
	},
};

export const RichTranslators: Record<RichType, {
	toHtml: (richElem: any) => HTMLElement;
	fromHtml: (htmlElem: HTMLElement) => RichElement;
	contentHtml?: (parentElement: HTMLElement) => HTMLElement;
}> = {
	'paragraph': {
		toHtml: (elem: RichParagraphElement): HTMLElement => {
			return htmlElem({
				tag: 'p',
				classes: RICH_TYPE_TO_CLASS_NAME_MAP['paragraph'],
				children: elem.children.map(createRichHTMLElement),
			});
		},
		fromHtml: (htmlElem: HTMLElement): RichParagraphElement => {
			const children = Array.from(htmlElem.children) as HTMLElement[];
			return {
				type: 'paragraph',
				children: children.map(parseRichHTMLElement),
			};
		},
	},
	'simple': {
		toHtml: (elem: RichSimpleElement): HTMLElement => {
			return htmlElem({
				tag: 'span',
				classes: RICH_TYPE_TO_CLASS_NAME_MAP['simple'],
				children: elem.text,
			});
		},
		fromHtml: (htmlElem: HTMLElement): RichSimpleElement => {
			return {
				type: 'simple',
				text: htmlElem.innerText,
			};
		},
	},
	'link': {
		toHtml: (elem: RichLinkElement): HTMLElement => {
			return htmlElem({
				tag: 'a',
				classes: RICH_TYPE_TO_CLASS_NAME_MAP['link'],
				attrs: {
					href: elem.href
				},
				children: elem.name,
			});
		},
		fromHtml: (htmlElem: HTMLElement) => {
			return {
				type: 'link',
				name: htmlElem.innerText,
				href: htmlElem.getAttribute('href') || '',
			};
		},
	},
	'strong': {
		toHtml: (elem: RichStrongElement) => {
			return htmlElem({
				tag: 'strong',
				classes: RICH_TYPE_TO_CLASS_NAME_MAP['strong'],
				children: elem.text,
			});
		},
		fromHtml: (htmlElem: HTMLElement) => {
			return {
				type: 'strong',
				text: htmlElem.innerText,
			};
		},
	},
	'title-1': titleTranslator,
	'title-2': titleTranslator,
	'title-3': titleTranslator,
	'title-4': titleTranslator,
	'list': {
		toHtml: (richElement: RichListElement) => {
			return htmlElem({
				tag: 'ul',
				classes: RICH_TYPE_TO_CLASS_NAME_MAP['list'],
				children: richElement.children.map(createRichHTMLElement),
			});
		},
		fromHtml: (htmlElem: HTMLElement): RichListElement => {
			const children = Array.from(htmlElem.children) as HTMLElement[];
			const listItemTranslator = RichTranslators['list-item'];
			return {
				type: 'list',
				children: children.map(c => listItemTranslator.fromHtml(c) as RichListItemElement),
			};
		}
	},
	'list-item': {
		toHtml: (richElement: RichListItemElement): HTMLElement => {
			return htmlElem({
				tag: 'li',
				classes: [RICH_TYPE_TO_CLASS_NAME_MAP['list-item'], "rowStartAndStart"],
				children: [
					htmlElem({
						tag: 'div',
						classes: RICH_LIST_ITEM_SIGN_CLASS
					}),
					htmlElem({
						tag: 'div',
						classes: RICH_LIST_ITEM_CONTENT_CLASS,
						children: richElement.children.map(createRichHTMLElement),
					})
				]
			});
		},
		fromHtml: (htmlElem: HTMLElement): RichListItemElement | RichUnknownElement => {
			const contentElement = htmlElem.querySelector(`.${RICH_LIST_ITEM_CONTENT_CLASS}`);
			if (contentElement) {
				const children = Array.from(contentElement.children) as HTMLElement[];
				return {
					type: 'list-item',
					children: children.map(parseRichHTMLElement),
				};
			}
			return {
				type: 'unknown',
				text: htmlElem.innerText,
			};
		},
		contentHtml: (parentElement: HTMLElement) => {
			return parentElement.querySelector(`.${RICH_LIST_ITEM_CONTENT_CLASS}`)!!;
		},
	},
	'expandable-block': {
		toHtml: (richElement: RichExpandableBlockElement): HTMLElement => {
			return htmlElem({
				tag: 'div',
				classes: RICH_TYPE_TO_CLASS_NAME_MAP['expandable-block'],
				children: [
					htmlElem({
						tag: 'div',
						classes: RICH_EXPANDABLE_BLOCK_TITLE_CLASS,
						children: richElement.title,
					}),
					htmlElem({
						tag: 'div',
						classes: RICH_EXPANDABLE_BLOCK_CONTENT_CLASS,
						children: richElement.children.map(createRichHTMLElement),
					})
				]
			});
		},
		fromHtml: (htmlElem: HTMLElement): RichExpandableBlockElement => {
			const titleElement = htmlElem.querySelector(`.${RICH_EXPANDABLE_BLOCK_TITLE_CLASS}`)!! as HTMLElement;
			const contentElement = htmlElem.querySelector(`.${RICH_EXPANDABLE_BLOCK_CONTENT_CLASS}`)!!;
			const children = Array.from(contentElement.children) as HTMLElement[];
			return {
				type: 'expandable-block',
				title: titleElement.innerText,
				children: children.map(parseRichHTMLElement),
			};
		},
		contentHtml: (parentElement: HTMLElement) => {
			return parentElement.querySelector(`.${RICH_EXPANDABLE_BLOCK_CONTENT_CLASS}`)!!;
		},
	},
	'united-block': {
		toHtml: (richElement: RichUnitedBlockElement): HTMLElement => {
			return htmlElem({
				tag: 'div',
				classes: RICH_TYPE_TO_CLASS_NAME_MAP['united-block'],
				children: richElement.children.map(createRichHTMLElement),
			});
		},
		fromHtml: (htmlElem: HTMLElement): RichUnitedBlockElement => {
			const children = Array.from(htmlElem.children) as HTMLElement[];
			return {
				type: 'united-block',
				children: children.map(parseRichHTMLElement),
			};
		},
	},
	'code-block': {
		toHtml: (richElement: RichCodeBlockElement): HTMLElement => {
			return htmlElem({
				tag: 'div',
				classes: RICH_TYPE_TO_CLASS_NAME_MAP['code-block'],
				children: [
					htmlElem({
						tag: 'div',
						classes: RICH_CODE_BLOCK_ICON_CLASS,
					}),
					htmlElem({
						tag: 'pre',
						classes: RICH_CODE_BLOCK_CONTENT_CLASS,
						children: richElement.text,
					})

				],
			});
		},
		fromHtml: (htmlElem: HTMLElement): RichCodeBlockElement => {
			const contentElement = htmlElem.querySelector(`.${RICH_CODE_BLOCK_CONTENT_CLASS}`)!! as HTMLElement;
			return {
				type: 'code-block',
				text: contentElement.innerText,
			};
		},
		contentHtml: (parentElement: HTMLElement) => {
			return parentElement.querySelector(`.${RICH_CODE_BLOCK_CONTENT_CLASS}`)!!;
		},
	},
	'unknown': {
		toHtml: (richElement: RichUnknownElement): HTMLElement => {
			return htmlElem({
				tag: 'div',
				classes: RICH_TYPE_TO_CLASS_NAME_MAP['unknown'],
				children: richElement.text,
			});
		},
		fromHtml: (htmlElem: HTMLElement): RichUnknownElement => {
			return {
				type: 'unknown',
				text: htmlElem.innerText,
			};
		},
	}
};

export function removeEmptyRichElements(elements: RichElement[]): RichElement[] {
	const nonEmptyElement = elements.filter(canBeAdded);
	return nonEmptyElement;
}

function canBeAdded(richElement: RichElement): boolean {
	if (isRichParentElement(richElement.type)) {
		const parent = richElement as RichParentElement;
		parent.children = parent.children.filter(canBeAdded);
		return parent.children.length > 0;
	}
	switch (richElement.type) {
		case 'title-1':
		case 'title-2':
		case 'title-3':
		case 'title-4':
			return richElement.text.length > 0;
		case 'simple':
			return richElement.text.length > 0;
		case 'link':
			return richElement.name.length > 0;
		case 'strong':
			return richElement.text.length > 0;
		case 'unknown':
			return richElement.text.length > 0;
	}
	return true;
}