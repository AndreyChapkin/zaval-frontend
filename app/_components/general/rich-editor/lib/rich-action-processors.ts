import { RICH_TYPE_TO_DEFAULT_MAP, RichTitleElement, RichTitleType, RichType, TITLES_ARRAY, isRichParentElement } from "@/app/_lib/types/rich-text";
import { useEffect, useState } from "react";
import { RichDomManipulator, RichTranslators, createRichHTMLElement, defineElementRichType, parseRichHTMLElement } from "./rich-dom-manipulations";
import { translateEventToEditorCommand } from "./rich-command-processors";

const KEY_TO_EDITION_ACTION_MAP: Record<string, RichActionDraft> = {
    'Alt+Digit1': {
        actionName: 'create',
        richType: 'title-1',
    },
    'Alt+Digit2': {
        actionName: 'create',
        richType: 'text',
    },
    'Alt+Digit3': {
        actionName: 'create',
        richType: 'link',
    },
    'Alt+Digit4': {
        actionName: 'create',
        richType: 'list',
    },
    'Alt+Digit5': {
        actionName: 'create',
        richType: 'united-block',
    },
    'Alt+Digit6': {
        actionName: 'create',
        richType: 'expandable-block',
    },
    'Alt+Digit7': {
        actionName: 'create',
        richType: 'code-block',
    },
    'Alt+KeyE': {
        actionName: 'create',
        richType: 'list-item',
    },
    'Alt+ArrowUp': {
        actionName: 'move',
        direction: 'up'
    },
    'Alt+ArrowDown': {
        actionName: 'move',
        direction: 'down'
    },
    'Alt+Equal': {
        actionName: 'replace',
        description: {
            elementType: 'title',
            transformation: 'upgrade'
        }
    },
    'Alt+Minus': {
        actionName: 'replace',
        description: {
            elementType: 'title',
            transformation: 'downgrade'
        }
    },
};

export interface AnchorInfo {
    elements?: HTMLElement[];
    parent?: HTMLElement;
    previous?: HTMLElement;
    next?: HTMLElement;
}

export type RichActionTypes = 'create' | 'delete' | 'update' | 'move' | 'replace';

export interface RichCreateAction {
    name: 'create';
    payload: {
        newElements: HTMLElement[];
        placement: {
            anchorElement: HTMLElement;
            position: 'before' | 'after' | 'begin' | 'end';
        };
    };
}

export function asCreateAction(newElements: HTMLElement[], placement: RichCreateAction['payload']['placement']): RichCreateAction {
    return {
        name: 'create',
        payload: {
            newElements,
            placement,
        }
    };
}

export interface RichDeleteAction {
    name: 'delete';
    payload: {
        element: HTMLElement;
    };
}

export function asDeleteAction(element: HTMLElement): RichDeleteAction {
    return {
        name: 'delete',
        payload: {
            element,
        }
    };
}

export interface RichUpdateAction {
    name: 'update';
    payload: {
        element: HTMLElement;
        attributes?: Record<string, string>;
    };
}

export interface RichMoveAction {
    name: 'move';
    payload: {
        element: HTMLElement;
        direction: 'up' | 'down';
    };
}

export interface RichReplaceAction {
    name: 'replace';
    payload: {
        element: HTMLElement;
        newElements: HTMLElement[];
    };
}

export function asReplaceAction(element: HTMLElement, newElements: HTMLElement[]): RichReplaceAction {
    return {
        name: 'replace',
        payload: {
            element,
            newElements,
        }
    };
}

export interface RichCreateDraft {
    actionName: 'create';
    richType: RichType | 'text';
    place?: {
        type: RichType;
        position: 'before' | 'after' | 'begin' | 'end';
    };
}

export interface RichDeleteDraft {
    actionName: 'delete';
}

export interface RichUpdateDraft {
    actionName: 'update';
    attributesNames: string[];
}

export interface RichMoveDraft {
    actionName: 'move';
    direction: 'up' | 'down';
}

export interface RichReplaceDraft {
    actionName: 'replace';
    description: {
        elementType: 'title',
        transformation: 'downgrade' | 'upgrade';
    };
}

export type RichAction = RichCreateAction | RichDeleteAction | RichUpdateAction | RichMoveAction | RichReplaceAction;
export type RichActionDraft = RichCreateDraft | RichDeleteDraft | RichUpdateDraft | RichMoveDraft | RichReplaceDraft;

export type FulfillmentLinkInfo = {
    richType: 'link';
    info: {
        name: string;
        href: string;
    };
};

export type FulfillmentInfo = FulfillmentLinkInfo;

export function doesActionNeedFullfillment(action: RichActionDraft): boolean {
    return action.actionName === 'create' && action.richType === 'link';
}

export function planRichAction(event: React.KeyboardEvent<HTMLElement>): RichActionDraft | null {
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

export function isReservedShortcut(event: React.KeyboardEvent<HTMLElement>): boolean {
    return planRichAction(event) !== null || translateEventToEditorCommand(event) !== null;
}

export function useActionProcessor(richDomManipulator: RichDomManipulator | null) {
    const [actionProcessor, setActionProcessor] = useState<ActionProcessor>(new ActionProcessor(richDomManipulator));

    useEffect(() => {
        setActionProcessor(new ActionProcessor(richDomManipulator));
    }, [richDomManipulator]);

    return actionProcessor;
}

export class ActionProcessor {
    private manipulator: RichDomManipulator | null = null;

    constructor(richDomManipulator: RichDomManipulator | null) {
        this.manipulator = richDomManipulator;
    }

    fulfillDraftAction(draftAction: RichActionDraft, infoToFulfill?: FulfillmentInfo): RichAction | null {
        if (draftAction) {
            let fulfilledAction: RichAction | null = null;
            switch (draftAction.actionName) {
                case 'create':
                    fulfilledAction = this.fulfillCreateRichAction(draftAction, infoToFulfill);
                    break;
                case 'delete':
                    fulfilledAction = this.fulfillDeleteRichAction();
                    break;
                case 'update':
                    fulfilledAction = this.fulfillUpdateRichAction(draftAction);
                    break;
                case 'move':
                    fulfilledAction = this.fulfillMoveRichAction(draftAction);
                    break;
                case 'replace':
                    fulfilledAction = this.fulfillReplaceRichAction(draftAction);
                    break;
            }
            if (fulfilledAction) {
                return fulfilledAction;
            }
        }
        return null;
    }

    // return anchor elements
    applyRichAction(action: RichAction): AnchorInfo {
        switch (action.name) {
            case 'create':
                return this.applyCreateRichAction(action);
            case 'delete':
                return this.applyDeleteRichAction(action);
            case 'update':
                return this.applyUpdateRichAction(action);
            case 'move':
                return this.applyMoveRichAction(action);
            case 'replace':
                return this.applyReplaceRichAction(action);
        }
    }

    private definePlacementPosition(createDraft: RichCreateDraft): RichCreateAction['payload']['placement'] | null {
        if (this.manipulator === null) {
            return null;
        }
        const selectedElementInfo = this.manipulator.selectedElementInfo;
        if (!selectedElementInfo) {
            return {
                anchorElement: this.manipulator.containerElement,
                position: 'end'
            };
        }
        // titles
        if (TITLES_ARRAY.indexOf(createDraft.richType as any) > -1) {
            const rootElement = this.manipulator.findNearestRichRootElement(selectedElementInfo.element);
            if (!rootElement) {
                return {
                    anchorElement: this.manipulator.containerElement,
                    position: 'end'
                };
            }
            return {
                anchorElement: rootElement,
                position: 'after'
            };
        }
        // list items
        if (createDraft.richType === 'list-item') {
            // detect context
            const listItemElement = this.manipulator.findNearestElementWithType('list-item', selectedElementInfo.element);
            if (listItemElement) {
                return {
                    anchorElement: listItemElement,
                    position: 'after',
                };
            }
            return null;
        }
        // any parent element
        if (isRichParentElement(createDraft.richType as any)) {
            let appropriateParentInfo = this.manipulator.findNearestRichParentElement(selectedElementInfo.element, ['paragraph', 'list']);
            let nearestParentInfo = this.manipulator.findNearestRichParentElement(selectedElementInfo.element);
            if (appropriateParentInfo) {
                if (nearestParentInfo && nearestParentInfo.element !== appropriateParentInfo.element) {
                    return {
                        anchorElement: nearestParentInfo.element,
                        position: 'after'
                    };
                }
                return {
                    anchorElement: appropriateParentInfo.element,
                    position: 'end'
                };
            }
            // if no parent, try to create in container
            const rootElement = this.manipulator.findNearestRichRootElement(selectedElementInfo.element);
            if (!rootElement) {
                return {
                    anchorElement: this.manipulator.containerElement,
                    position: 'end'
                };
            }
            return {
                anchorElement: rootElement,
                position: 'after'
            };
        } else {
            // any non parent element
            if (selectedElementInfo) {
                return {
                    anchorElement: selectedElementInfo.element,
                    position: 'after'
                };
            }
        }
        return null;
    }

    private applyCreateRichAction(richCreateAction: RichCreateAction): AnchorInfo {
        const newElements = richCreateAction.payload.newElements;
        // place new elements
        if (richCreateAction.payload.placement) {
            const { anchorElement, position } = richCreateAction.payload.placement;
            const anchorType = defineElementRichType(anchorElement);
            if (anchorType) {
                if (position === 'begin') {
                    if (RichTranslators[anchorType].contentHtml) {
                        RichTranslators[anchorType].contentHtml!!(anchorElement).prepend(...newElements);
                    } else {
                        anchorElement.prepend(...newElements);
                    }                    
                } else if (position === 'end') {
                    if (RichTranslators[anchorType].contentHtml) {
                        RichTranslators[anchorType].contentHtml!!(anchorElement).append(...newElements);
                    } else {
                        anchorElement.append(...newElements);
                    }
                } else if (position === 'before') {
                    anchorElement.before(...newElements);
                } else if (position === 'after') {
                    anchorElement.after(...newElements);
                }
            }
        }
        return {
            elements: newElements,
        };
    }

    private applyDeleteRichAction(richDeleteAction: RichDeleteAction): AnchorInfo {
        const previous = richDeleteAction.payload.element.previousElementSibling;
        const next = richDeleteAction.payload.element.nextElementSibling;
        const parentInfo = this.manipulator?.findNearestRichParentElement(richDeleteAction.payload.element);
        const parent = parentInfo?.type === 'container' ? null : parentInfo?.element;
        richDeleteAction.payload.element.remove();
        return {
            parent: parent ?? undefined,
            previous: (previous as HTMLElement) ?? undefined,
            next: (next as HTMLElement) ?? undefined,
        }
    }

    private applyUpdateRichAction(richUpdateAction: RichUpdateAction): AnchorInfo {
        const element = richUpdateAction.payload.element;
        const attributes = richUpdateAction.payload.attributes;
        if (attributes) {
            Object.keys(attributes).forEach((attributeName) => {
                // TODO: add attributes filtering
                element.setAttribute(attributeName, attributes[attributeName]);
            });
        }
        return {
            elements: [element],
        };
    }

    private applyMoveRichAction(richMoveAction: RichMoveAction): AnchorInfo {
        const element = richMoveAction.payload.element;
        const direction = richMoveAction.payload.direction;
        if (direction === 'up') {
            const previousElement = element.previousElementSibling;
            if (previousElement) {
                previousElement.before(element);
            }
        } else {
            const nextElement = element.nextElementSibling;
            if (nextElement) {
                nextElement.after(element);
            }
        }
        return {
            elements: [element],
        };
    }

    private applyReplaceRichAction(richReplaceAction: RichReplaceAction): AnchorInfo {
        const element = richReplaceAction.payload.element;
        const newElements = richReplaceAction.payload.newElements;
        element.replaceWith(...newElements);
        return {
            elements: newElements,
        };
    }

    private fulfillCreateRichAction(draftAction: RichActionDraft, infoToFulfill?: FulfillmentInfo): RichCreateAction | null {
        if (this.manipulator) {
            let createDraft = draftAction as RichCreateDraft;
            const selectedElementInfo = this.manipulator.selectedElementInfo;
            // adapt text creation draft according to selected context
            if (createDraft.richType === 'text') {
                let isInsideParagraph = false;
                if (selectedElementInfo) {
                    const selectedContextInfo = this.manipulator.findNearestRichParentElement(selectedElementInfo.element);
                    if (selectedContextInfo?.type === 'paragraph') {
                        isInsideParagraph = true;
                    }
                }
                createDraft = {
                    ...createDraft,
                    richType: isInsideParagraph ? 'simple' : 'paragraph',
                };
            }
            // common processing
            let newElement: HTMLElement | null = null;
            // fulfill action if needed
            if (infoToFulfill) {
                switch (infoToFulfill.richType) {
                    case 'link':
                        newElement = createRichHTMLElement({
                            type: 'link',
                            name: infoToFulfill.info.name,
                            href: infoToFulfill.info.href,
                        });
                        break;
                }
            } else {
                newElement = createRichHTMLElement(RICH_TYPE_TO_DEFAULT_MAP[createDraft.richType as RichType]);
            }
            // define new element placement
            if (newElement) {
                const placement = this.definePlacementPosition(createDraft);
                if (placement) {
                    return {
                        name: 'create',
                        payload: {
                            newElements: [newElement],
                            placement
                        }
                    };
                }
            }
        }
        return null;
    }

    private fulfillDeleteRichAction(): RichDeleteAction | null {
        const selectedElement = this.manipulator!!.selectedElementInfo?.element;
        if (selectedElement) {
            return {
                name: 'delete',
                payload: {
                    element: selectedElement
                }
            };
        }
        return null;
    }

    private fulfillUpdateRichAction(draftAction: RichActionDraft): RichUpdateAction | null {
        if (this.manipulator) {
            const selectedElement = this.manipulator.selectedElementInfo?.element;
            if (!selectedElement) {
                return null;
            }
            const updateDraft = draftAction as RichUpdateDraft;
            const attributes: Record<string, string> = {};
            updateDraft.attributesNames.forEach((attributeName) => {
                const attributeValue = selectedElement.getAttribute(attributeName);
                if (attributeValue) {
                    attributes[attributeName] = attributeValue;
                }
            });
            return {
                name: 'update',
                payload: {
                    element: selectedElement,
                    attributes,
                }
            };
        }
        return null;
    }

    private fulfillMoveRichAction(draftAction: RichActionDraft): RichMoveAction | null {
        const selectedElement = this.manipulator!!.selectedElementInfo?.element;
        if (selectedElement) {
            const moveDraft = draftAction as RichMoveDraft;
            return {
                name: 'move',
                payload: {
                    element: selectedElement,
                    direction: moveDraft.direction
                }
            };
        }
        return null;
    }

    private fulfillReplaceRichAction(draftAction: RichActionDraft): RichReplaceAction | null {
        const selectedElement = this.manipulator!!.selectedElementInfo?.element;
        if (selectedElement) {
            const selectedType = defineElementRichType(selectedElement);
            if (selectedType) {
                const replaceDraft = draftAction as RichReplaceDraft;
                let newElement: HTMLElement;
                const selectedTitleType = selectedType as RichTitleType;
                let index = TITLES_ARRAY.indexOf(selectedTitleType);
                if (replaceDraft.description.elementType === 'title' && index > -1) {
                    switch (replaceDraft.description.transformation) {
                        case 'upgrade':
                            index += 1;
                            break;
                        case 'downgrade':
                            index -= 1;
                            break;
                    }
                    index = Math.max(0, Math.min(index, TITLES_ARRAY.length - 1));
                    const newTitleType = TITLES_ARRAY[index];
                    const selectedRichElement = parseRichHTMLElement(selectedElement)!!;
                    if (selectedRichElement && TITLES_ARRAY.indexOf(selectedRichElement.type as any) > -1) {
                        const selectedTitleElement = selectedRichElement as RichTitleElement;
                        newElement = createRichHTMLElement({
                            type: newTitleType,
                            text: selectedTitleElement.text,
                            id: selectedTitleElement.id,
                        });
                        return {
                            name: 'replace',
                            payload: {
                                element: selectedElement,
                                newElements: [newElement],
                            }
                        };
                    }
                }
            }
        }
        return null;
    }
}