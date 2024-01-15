import { useCallback } from 'react';
import {
	RICH_ATTRIBUTES,
	RICH_CLASSES,
	RICH_CLASSES_TO_RICH_TYPES_MAP,
	RICH_TYPES_TO_POSSIBLE_PARENT_TYPES,
	RICH_TYPES_TO_RICH_CLASSES_MAP,
	SIMPLE_RICH_TYPES_TO_TAGS_MAP,
	TAGS_TO_SIMPLE_RICH_TYPES_MAP,
	isComplexRichType,
	type DescriptionFragment,
	type NewTransformationType,
	type RichClasses,
	type RichComplexTypes,
	type RichSimpleTypes,
	type RichTitleTypes,
	type RichTypes
} from '../types/rich-text';
import { appendToCodeBlock, appendToExpandableBlock, appendToListItem, createCodeBlock, createExpandableBlock, createList, createListItem, createUnitedBlock, insertCodeBlockChildren, insertExpandableBlockChildren, insertListChildren, insertListItemChildren, insertUnitedBlockChildren } from './complex-rich-element-creators';
import { findNearestParentElement, findSelectedElement } from './dom-helpers';
import type { TransformTitleAction } from './editor-actions/transform-actions';

type RemovedStackElementType = {
	element: HTMLElement;
	relativeToAnchor: 'before' | 'after' | 'inside';
	anchorElement: HTMLElement;
};

export function getRichTagClass(richType: RichTypes): string | undefined {
	return RICH_TYPES_TO_RICH_CLASSES_MAP[richType];
}

export function getSimpleRichTag(richType: RichSimpleTypes): string | undefined {
	return SIMPLE_RICH_TYPES_TO_TAGS_MAP[richType];
}

function asCorrectRichType(tag: string): RichTypes | null {
	const type = TAGS_TO_SIMPLE_RICH_TYPES_MAP[tag];
	if (type) {
		return type;
	}
	return null;
}

export function serializeRichContent(richContentContainer: HTMLElement): string {
	const contentDuplicate = richContentContainer.cloneNode(true) as HTMLElement;
	const nonEmptyContent = removeEmptyNodes(contentDuplicate);
	return nonEmptyContent?.innerHTML ?? "";
}

function removeEmptyNodes(contentNode: HTMLElement): HTMLElement | null {
	if (contentNode.childNodes.length === 0) {
		return null;
	}
	const nodesToProcess = [...contentNode.childNodes];
	while (nodesToProcess.length > 0) {
		const curNode = nodesToProcess.pop()!!;
		// Preserve all text nodes and fragment nodes with children. Plan to check fragment nodes too.
		if (curNode instanceof Text) {
			if ((curNode.textContent ?? "").trim().length < 1) {
				curNode.remove();
			}
		} else if (curNode.childNodes.length < 0) {
			curNode.remove();
		} else {
			nodesToProcess.push(...curNode.childNodes);
		}
	}
	return contentNode;
}

export function parseDescription(description: string): DescriptionFragment[] {
	if (description) {
		const fragments: DescriptionFragment[] = JSON.parse(description);
		return fragments;
	}
	return [];
}

export function tryToChooseNewLevelForSelectedTitle(selectedElement: HTMLElement, action: TransformTitleAction): RichTitleTypes | null {
	const richType = defineElementRichType(selectedElement);
	// if selected element is rich element
	if (richType) {
		// create transformation field
		const richTitleTypes: RichTitleTypes[] = ['title-1', 'title-2', 'title-3', 'title-4'];
		// make transformation value
		const transformationDirection = action.description === 'upgrade' ?
			-1 :
			action.description === 'downgrade' ?
				1 :
				0;
		const currentTypePosition = richTitleTypes.indexOf(richType as any);
		// if current element is rich title
		if (currentTypePosition > -1) {
			// try to transform current rich title according to the transformation value
			const transformedTypePosition = currentTypePosition + transformationDirection;
			if (0 <= transformedTypePosition && transformedTypePosition < richTitleTypes.length) {
				return richTitleTypes[transformedTypePosition];
			}
		}

	}
	return null;
}

export function setAttributesToElement(
	richElement: HTMLElement,
	attributes: Record<string, string | number>
) {
	const richType = defineElementRichType(richElement);
	if (richType) {
		const allowedAttributes = RICH_ATTRIBUTES[richType];
		if (allowedAttributes) {
			for (let allowedAttribute of allowedAttributes) {
				const allowedAttributeValue = attributes[allowedAttribute];
				if (allowedAttributeValue) {
					richElement.setAttribute(allowedAttribute, String(allowedAttributeValue));
				}
			}
		}
	}
}

export function createNewSimpleRichElement(
	richType: RichSimpleTypes,
	text: string | null,
	attributes: Record<string, string> | null = null
): HTMLElement {
	const tagName = SIMPLE_RICH_TYPES_TO_TAGS_MAP[richType];
	const richClass = RICH_TYPES_TO_RICH_CLASSES_MAP[richType];
	const newElement = document.createElement(tagName);
	newElement.classList.add(richClass);
	if (text) {
		newElement.innerText = text;
	}
	const allowedAttributes = RICH_ATTRIBUTES[richType];
	if (attributes && allowedAttributes) {
		const resultAttributes = Object.entries(attributes).filter(
			([key, _]) => allowedAttributes.indexOf(key) > -1
		);
		for (let [resKey, resAttribute] of resultAttributes) {
			newElement.setAttribute(resKey, resAttribute);
		}
	}
	return newElement;
}

export function createNewComplexRichElement(
	richType: RichComplexTypes,
	content: (HTMLElement | string)[] | string | null,
): HTMLElement {
	switch (richType) {
		case 'list':
			return createList(content);
		case 'list-item':
			return createListItem(content);
		case 'code-block':
			return createCodeBlock(String(content));
		case 'expandable-block':
			return createExpandableBlock(content);
		default:
			return createUnitedBlock(content);
	}
}

export function extractRichElementChildren(element: HTMLElement, richType: RichTypes): ChildNode[] {
	const resultChildren = [] as ChildNode[];
	const isComplex = isComplexRichType(richType);
	if (isComplex) {
		switch (richType) {
			case 'list':
				insertListChildren(element, resultChildren);
				break;
			case 'list-item':
				insertListItemChildren(element, resultChildren);
				break;
			case 'code-block':
				insertCodeBlockChildren(element, resultChildren);
				break;
			case 'united-block':
				insertUnitedBlockChildren(element, resultChildren);
				break;
			case 'expandable-block':
				insertExpandableBlockChildren(element, resultChildren);
				break;
		}
	} else {
		if (richType === 'unknown') {
			// It is not clear how to process unkown element content. So save the raw text at least.
			const textChild = document.createTextNode(element.textContent ?? '');
			resultChildren.push(textChild);
		} else {
			for (let childNode of element.childNodes) {
				resultChildren.push(childNode);
			}
		}
	}
	return resultChildren;
}

export function findTheNearestAppropriatePlace(
	containerElement: HTMLElement,
	richType: RichTypes,
): { anchorElement: HTMLElement, place: 'append' | 'after' } | null {
	let selectedRichElementInfo = findSelectedRichElement(containerElement);
	if (selectedRichElementInfo) {
		const appropriateParentTypes = RICH_TYPES_TO_POSSIBLE_PARENT_TYPES[richType];
		let prevConsideredRichElementInfo: typeof selectedRichElementInfo | null = null;
		// if selected element = null then container is reached
		while (selectedRichElementInfo &&
			!(appropriateParentTypes.includes('any-parent') ||
				appropriateParentTypes.includes(selectedRichElementInfo.richType))
		) {
			prevConsideredRichElementInfo = selectedRichElementInfo;
			selectedRichElementInfo = findNearestRichParentElement(selectedRichElementInfo.element, containerElement);
		}
		if (selectedRichElementInfo) {
			return prevConsideredRichElementInfo
				? {
					anchorElement: prevConsideredRichElementInfo.element,
					place: 'after'
				}
				: {
					anchorElement: selectedRichElementInfo.element,
					place: 'append',
				};
		} else if (appropriateParentTypes.includes('root')) {
			return prevConsideredRichElementInfo
				? {
					anchorElement: prevConsideredRichElementInfo.element,
					place: 'after'
				}
				: {
					anchorElement: containerElement,
					place: 'append',
				};
		}
	}
	return null;
}

export function findSelectedRichElement(containerElement: HTMLElement): { element: HTMLElement, richType: RichTypes } | null {
	let element = findSelectedElement();
	let richType = element && defineElementRichType(element);
	console.log("@@@ richType", richType);
	while (element && !richType) {
		if (element === containerElement) {
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

export function switchSelectedElement(prevElement: HTMLElement | null, newElement: HTMLElement | null): HTMLElement | null {
	if (newElement !== prevElement) {
		prevElement?.classList.remove('selectedRichElement');
		newElement?.classList.add('selectedRichElement');
	}
	return newElement;
}

export function findNearestRichParentElement(
	childElement: Node,
	containerElement: HTMLElement
): { element: HTMLElement, richType: RichTypes } | null {
	let element = findNearestParentElement(childElement);
	let richType = element && defineElementRichType(element);
	while (element && !richType) {
		if (element === containerElement) {
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

export function findSelectedElementWithRichType(richType: RichTypes, containerElement: HTMLElement): HTMLElement | null {
	let element = findSelectedElement();
	while (element && defineElementRichType(element) !== richType) {
		if (element === containerElement) {
			return null;
		}
		element = findNearestParentElement(element);
	}
	return element;
}

export function createNewRichElementAccordingToSelection(
	containerElement: HTMLElement,
	richType: RichTypes,
	text: string | null,
	attributes: Record<string, string> | null = null,
): HTMLElement | null {
	const appropriatePlace = findTheNearestAppropriatePlace(containerElement, richType);
	if (appropriatePlace) {
		const newElement = isComplexRichType(richType)
			? createNewComplexRichElement(richType, text)
			: createNewSimpleRichElement(richType, text, attributes);
		const { anchorElement, place } = appropriatePlace;
		if (place === 'append') {
			appendToRichOrNotRichElement(anchorElement, newElement);
		} else if (place === 'after') {
			anchorElement.after(newElement);
		}
		return newElement;
	}
	return null;
}

export function defineElementRichType(element: HTMLElement): RichTypes | null {
	if (element) {
		let richClass: RichClasses | null = null;
		for (let className of element.classList) {
			console.log("@@@ className", JSON.stringify(className));
			if (RICH_CLASSES.indexOf(className as any) > -1) {
				richClass = className as RichClasses;
				break;
			}
		}
		if (richClass) {
			return RICH_CLASSES_TO_RICH_TYPES_MAP[richClass]!!;
		}
	}
	return null;
}

export function markNonRichElements(element: HTMLElement) {
	const richType = defineElementRichType(element);
	if (!richType) {
		element.style.backgroundColor = 'red';
	} else {
		const children = extractRichElementChildren(element, richType);
		children.forEach(child => {
			if (child instanceof HTMLElement) {
				markNonRichElements(child);
			}
		});
	}
}

export function fixSuspiciousElements(element: HTMLElement) {
	const richType = defineElementRichType(element);
	if (!richType) {
		// Browser can paste span elements when ctrl+V or delete some elements
		if (element.tagName === 'SPAN') {
			const textNode = document.createTextNode(element.textContent ?? 'placeholder');
			element.replaceWith(textNode);
		} else if (element.tagName.toLocaleLowerCase() === SIMPLE_RICH_TYPES_TO_TAGS_MAP['strong']) {
			// If strong element tag but without rich class
			const STRONG_RICH_CLASS = RICH_TYPES_TO_RICH_CLASSES_MAP['strong']!!;
			element.classList.add(STRONG_RICH_CLASS);
		}
	} else {
		const children = extractRichElementChildren(element, richType);
		children.forEach(child => {
			if (child instanceof HTMLElement) {
				fixSuspiciousElements(child);
			}
		});
	}
}

export function appendToRichOrNotRichElement(parentElement: HTMLElement, childElement: HTMLElement) {
	const richType = defineElementRichType(parentElement);
	if (richType) {
		const isComplex = isComplexRichType(richType);
		if (isComplex) {
			switch (richType) {
				case 'list-item':
					appendToListItem(parentElement, childElement);
					break;
				case 'code-block':
					appendToCodeBlock(parentElement, childElement.textContent ?? '');
					break;
				case 'expandable-block':
					appendToExpandableBlock(parentElement, childElement);
					break;
			}
			return;
		}
	}
	parentElement.append(childElement);
}

export function chooseNewTransformation(
	event: KeyboardEvent,
): NewTransformationType | null {
	if (event.altKey && event.shiftKey) {
		switch (event.code) {
			case 'ArrowLeft':
				return 'left';
			case 'ArrowRight':
				return 'right';
		}
	}
	return null;
}

// TODO: refactor
export function isEditorEmpty(
	containerElement: HTMLElement
): boolean {
	for (let child of containerElement.childNodes) {
		if ((child instanceof HTMLElement) && defineElementRichType(child)) {
			return false;
		}
	}
	return true;
}

type HTMLElementRefType = React.MutableRefObject<HTMLElement | null>;
type StackRefType = React.MutableRefObject<RemovedStackElementType[]>;

export function useManageRichCopy(selectedElementRef: HTMLElementRefType) {
	const manageRichCopy = useCallback(() => {
		const selectedElement = selectedElementRef.current;
		if (selectedElement) {
			const content = selectedElement.outerHTML;
			const blobInput = new Blob([content], { type: 'text/html' });
			const clipboardItemInput = new ClipboardItem({ 'text/html': blobInput });
			navigator.clipboard.write([clipboardItemInput]);
		}
	}, []);
	return manageRichCopy;
}

export function useManageRichReplace(selectedElementRef: HTMLElementRefType) {
	const manageRichReplace = useCallback(async () => {
		const selectedElement = selectedElementRef.current;
		if (selectedElement) {
			const clipboardContents = await navigator.clipboard.read();
			const blob = await clipboardContents[0].getType('text/html');
			const text = await blob.text();
			// TODO: Bad
			const tempDom = new DOMParser().parseFromString(text, 'text/html');
			selectedElement.replaceWith(...tempDom.body.childNodes);
			selectedElementRef.current = null;
		}
	}, []);
	return manageRichReplace;
}

export function useManageRichRemoval(selectedElementRef: HTMLElementRefType, stackRef: StackRefType) {
	const manageRichRemoval = useCallback(() => {
		const selectedElement = selectedElementRef.current;
		if (selectedElement) {
			const stackElement: RemovedStackElementType | null = selectedElement.previousElementSibling ?
				{
					element: selectedElement,
					relativeToAnchor: 'after',
					anchorElement: selectedElement.previousElementSibling as HTMLElement
				}
				: selectedElement.nextElementSibling ?
					{
						element: selectedElement,
						relativeToAnchor: 'before',
						anchorElement: selectedElement.nextElementSibling as HTMLElement
					}
					: selectedElement.parentElement ?
						{
							element: selectedElement,
							relativeToAnchor: 'inside',
							anchorElement: selectedElement.parentElement as HTMLElement
						}
						: null;
			if (stackElement) {
				stackRef.current.push(stackElement);
				selectedElement.remove();
				selectedElementRef.current = null;
			}
		}
	}, []);
	return manageRichRemoval;
}

export function useManageRichUndoRemoval(stackRef: StackRefType) {
	const manageRichUndoRemoval = useCallback(() => {
		let removalStackElement = stackRef.current.pop();
		if (removalStackElement) {
			const { element, relativeToAnchor, anchorElement } = removalStackElement;
			if (removalStackElement.anchorElement.parentElement) {
				switch (relativeToAnchor) {
					case 'after':
						anchorElement.after(element);
						break;
					case 'before':
						anchorElement.before(element);
						break;
					case 'inside':
						anchorElement.append(element);
						break;
				}
			}
		}
	}, []);
	return manageRichUndoRemoval;
}