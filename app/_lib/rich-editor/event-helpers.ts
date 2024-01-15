import { isComplexRichType } from "../types/rich-text";
import { findSelectedElement, getSelectedText, pasteElementsInSelection, pasteEnterInSelection, pasteSpacesInSelection, selectTextInElement, setCaretWithinNode } from "./dom-helpers";
import type { CreateAction, CreateComplexAction, CreateSimpleAction } from "./editor-actions/create-actions";
import type { EditionAction, EditionResult, EditorCommand } from "./editor-actions/editor-action-general-types";
import type { ModifyAction } from "./editor-actions/modify-action";
import type { MoveAction } from "./editor-actions/move-actions";
import type { TransformTitleAction } from "./editor-actions/transform-actions";
import { createNewComplexRichElement, createNewRichElementAccordingToSelection, createNewSimpleRichElement, defineElementRichType, findSelectedElementWithRichType, findSelectedRichElement, findTheNearestAppropriatePlace, setAttributesToElement, tryToChooseNewLevelForSelectedTitle } from "./rich-editor-helpers";

const KEY_TO_EDITION_ACTION_MAP: Record<string, EditionAction> = {
	'Alt+Digit1': {
		type: 'create',
		name: 'draft',
		richType: 'title-1',
	},
	'Alt+Digit2': {
		type: 'create',
		name: 'draft',
		richType: 'paragraph',
	},
	'Alt+Digit3': {
		type: 'create',
		name: 'draft',
		richType: 'link',
	},
	'Alt+Digit4': {
		type: 'create',
		name: 'draft',
		richType: 'list-item',
	},
	'Alt+Digit5': {
		type: 'create',
		name: 'draft',
		richType: 'united-block',
	},
	'Alt+Digit6': {
		type: 'create',
		name: 'draft',
		richType: 'expandable-block',
	},
	'Alt+Digit7': {
		type: 'create',
		name: 'draft',
		richType: 'code-block',
	},
	'Alt+Shift+KeyE': {
		type: 'modify',
		name: 'draftExtendList',
	},
	'Alt+ArrowUp': {
		type: 'move',
		name: 'draftWithin',
		direction: 'up'
	},
	'Alt+ArrowDown': {
		type: 'move',
		name: 'draftWithin',
		direction: 'down'
	},
	'Alt+Equal': {
		type: 'transform',
		name: 'title',
		description: 'upgrade'
	},
	'Alt+Minus': {
		type: 'transform',
		name: 'title',
		description: 'downgrade'
	},
};


const KEY_TO_EDITION_COMMAND_MAP: Record<string, EditorCommand> = {
	'Alt+KeyS': {
		name: 'save',
	},
	'Alt+KeyC': {
		name: 'copy',
	},
	'Alt+Shift+KeyC': {
		name: 'replace',
	},
	'Alt+KeyH': {
		name: 'help',
	},
	'Alt+Shift+ArrowLeft': {
		name: 'upgradeSelection',
	},
	'Alt+Delete': {
		name: 'delete',
	},
	'Alt+Shift+Delete': {
		name: 'undoDelete',
	},
	'Esc': {
		name: 'cancel'
	},
};

export function tryToProcessActionEvent(event: React.KeyboardEvent<Element>, selectedElement: HTMLElement | null, contentContainer: HTMLElement) {
	let action = translateEventToEditionAction(event);
	if (action) {
		action = fillDraftActionWithDataOrReturnSame(action, selectedElement, contentContainer);
		return processEditionAction(action);
	}
	return null;
}

export function translateEventToEditorCommand(event: React.KeyboardEvent<Element>): EditorCommand | null {
	let combination = event.code;
	if (event.shiftKey) {
		combination = `Shift+${combination}`;
	}
	if (event.altKey) {
		combination = `Alt+${combination}`;
	}
	return KEY_TO_EDITION_COMMAND_MAP[combination] ?? null;
}

export function rewriteDefaultBehaviourForSomeInputs(event: React.KeyboardEvent<Element>): 'done' | null {
	// paste enter without shift
	if (event.code === 'Enter' && !event.shiftKey) {
		event.preventDefault();
		pasteEnterInSelection();
		return 'done';
	}
	// paste several spaces when press tab instead of switching
	if (event.code === 'Tab') {
		event.preventDefault();
		pasteSpacesInSelection();
		return 'done';
	}
	return null;
}

function fillDraftActionWithDataOrReturnSame(action: EditionAction, selectedElement: HTMLElement | null, containerElement: HTMLElement): EditionAction {
	if (action.type === 'create' && action.name === 'draft') {
		return {
			type: 'create',
			name: isComplexRichType(action.richType) ? 'complex' : 'simple',
			richType: action.richType,
			container: containerElement,
		};
	} else if (action.type === 'modify' && action.name === 'draftExtendList') {
		return {
			type: 'modify',
			name: 'extendList',
			container: containerElement,
		};
	} else if (action.type === 'move' && action.name === 'draftWithin' && selectedElement) {
		return {
			type: 'move',
			name: 'within',
			direction: action.direction,
			selectedElement,
			container: containerElement,
		};
	}
	return action;
}

function translateEventToEditionAction(event: React.KeyboardEvent<Element>): EditionAction | null {
	if (event.altKey) {
		let pressedCombinationName = event.code;
		if (event.shiftKey) {
			pressedCombinationName = `Shift+${pressedCombinationName}`;
		}
		pressedCombinationName = `Alt+${pressedCombinationName}`;
		return KEY_TO_EDITION_ACTION_MAP[pressedCombinationName] ?? null;
	}
	return null;
}

export function processEditionAction(action: EditionAction): EditionResult | null {
	switch (action.type) {
		case 'create':
			return createNewRichElementAndResult(action);
		case 'move':
			return moveRichElementAndResult(action);
		case 'transform':
			return transformRichTitleElementAndResult(action);
		case 'modify':
			return modifyRichElementAndResult(action);
	}
	return null;
}

function createNewRichElementAndResult(action: CreateAction): EditionResult | null {
	let newElement: HTMLElement | null = null;
	if (action.name === 'simple') {
		newElement = createNewSimpleRichElementAccordingToSelection(action);
	} else if (action.name === 'complex') {
		newElement = createNewComplexRichElementAccordingToSelection(action);
	}
	if (newElement) {
		return {
			name: 'created',
			elementInfo: {
				richType: action.richType,
				element: newElement,
			}
		};
	}
	return null;
}

export function createNewSimpleRichElementAccordingToSelection(action: CreateSimpleAction): HTMLElement | null {
	switch (action.richType) {
		case 'link':
			return createLinkElementAccordingToSelection(action.container);
	}
	if (['title-1', 'title-2', 'title-3', 'title-4'].indexOf(action.richType) > -1) {
		return createTitleElementAccordingToSelection(action);
	}
	// other simple elements
	return createNewRichElementAccordingToSelection(action.container,
		action.richType,
		action.data as string || 'placeholder',
		{}
	);
}

export function createNewComplexRichElementAccordingToSelection(action: CreateComplexAction): HTMLElement | null {
	switch (action.richType) {
		case 'list-item':
			return createListItemAccordingToSelection('placeholder', action.container);
	}
	return createNewRichElementAccordingToSelection(action.container, action.richType, action.data ?? 'placeholder');
}

function createLinkElementAccordingToSelection(containerElement: HTMLElement): HTMLElement | null {
	const selectedText = getSelectedText();
	if (selectedText) {
		const newElement = createNewRichElementAccordingToSelection(containerElement, 'link', selectedText);
		if (newElement) {
			pasteElementsInSelection(["[", newElement, "]"]);
			return newElement;
		}
	}
	return null;
}

function createTitleElementAccordingToSelection(action: CreateSimpleAction): HTMLElement | null {
	const newElement = createNewRichElementAccordingToSelection(
		action.container,
		action.richType,
		"placeholder",
		{
			id: `${Math.floor(Math.random() * 1000000000)}`
		}
	);
	return newElement;
}

function createListItemAccordingToSelection(text: string, containerElement: HTMLElement): HTMLElement | null {
	const nearestAppropriatePlace = findTheNearestAppropriatePlace(containerElement, 'list-item');
	const needCreateList = !nearestAppropriatePlace
		|| defineElementRichType(nearestAppropriatePlace.anchorElement) !== 'list';
	const newListItemElement = createNewComplexRichElement('list-item', text);
	if (needCreateList) {
		const newListElement = createNewRichElementAccordingToSelection(
			containerElement,
			'list',
			null,
		);
		if (newListElement) {
			newListElement.append(newListItemElement);
			return newListElement;
		}
	}
	return newListItemElement;
}

function moveRichElementAndResult(action: MoveAction): EditionResult | null {
	let result: EditionResult | null = null;
	if (action.name === 'within') {
		const selectedRichElement = action.selectedElement || findSelectedRichElement(action.container);
		if (selectedRichElement) {
			switch (action.direction) {
				case 'up':
					let previousElement = selectedRichElement.previousElementSibling;
					previousElement?.before(selectedRichElement);
					break;
				case 'down':
					let nextElement = selectedRichElement.nextElementSibling;
					nextElement?.after(selectedRichElement);
					break;
			}
			selectedRichElement.scrollIntoView();
			setCaretWithinNode(selectedRichElement);
			result = {
				name: 'moved',
				elementInfo: {
					richType: defineElementRichType(selectedRichElement)!!,
					element: selectedRichElement,
				},
			};
		}
	}
	return result;
}

export function transformRichTitleElementAndResult(action: TransformTitleAction): EditionResult | null {
	const selectedElement = findSelectedElement();
	if (selectedElement) {
		const newTitleRichType = tryToChooseNewLevelForSelectedTitle(selectedElement, action);
		if (newTitleRichType) {
			const newTitleElement = createNewSimpleRichElement(
				newTitleRichType,
				selectedElement.textContent,
				{ 'id': selectedElement.id }
			);
			selectedElement.replaceWith(newTitleElement);
			selectTextInElement(newTitleElement);
			return {
				name: 'transformed',
				elementInfo: {
					richType: newTitleRichType,
					element: newTitleElement,
				},
			};
		}
	}
	return null;
}

export function modifyRichElementAndResult(action: ModifyAction): EditionResult | null {
	switch (action.name) {
		case 'attributes':
			const attributes = action.data;
			setAttributesToElement(action.element, attributes);
			return {
				name: 'modified',
				elementInfo: {
					element: action.element,
					richType: defineElementRichType(action.element)!!,
				}
			};
		case 'extendList':
			const selectedListItemElement = findSelectedElementWithRichType('list-item', action.container);
			if (selectedListItemElement) {
				const newListItemElement = createNewComplexRichElement('list-item', 'placeholder');
				selectedListItemElement.after(newListItemElement);
				const listElement = findSelectedElementWithRichType('list', action.container)!!;
				return {
					name: 'modified',
					elementInfo: {
						element: listElement,
						richType: 'list',
					}
				};
			}
	}
	return null;
}

export function detectNativeActions(event: React.KeyboardEvent<Element>): 'paste' | null {
	if (event.ctrlKey) {
		if (event.code === "KeyV") {
			return 'paste';
		}
	}
	return null;
}