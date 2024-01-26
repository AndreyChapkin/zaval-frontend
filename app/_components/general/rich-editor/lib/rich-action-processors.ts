import { RICH_TYPE_TO_DEFAULT_MAP, RichTitleElement, RichTitleType, RichType, TITLES_ARRAY, isRichParentElement } from "@/app/_lib/types/rich-text";
import { useEffect, useState } from "react";
import { RichDomManipulator, createRichHTMLElement, defineElementRichType, parseRichHTMLElement } from "./rich-dom-manipulations";

const KEY_TO_EDITION_ACTION_MAP: Record<string, RichActionDraft> = {
    'Alt+Digit1': {
        actionName: 'create',
        richType: 'title-1',
    },
    'Alt+Digit2': {
        actionName: 'create',
        richType: 'paragraph',
    },
    'Alt+Digit3': {
        actionName: 'create',
        richType: 'link',
    },
    'Alt+Digit4': {
        actionName: 'create',
        richType: 'list-item',
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
    'Alt+Shift+KeyE': {
        actionName: 'create',
        richType: 'list-item',
        place: {
            type: 'list-item',
            position: 'after'
        }
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

export interface RichDeleteAction {
    name: 'delete';
    payload: {
        element: HTMLElement;
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
        newElement: HTMLElement;
    };
}

export interface RichCreateDraft {
    actionName: 'create';
    richType: RichType;
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
    return planRichAction(event) !== null;
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
        console.log("@@@ fulfillDraftAction", JSON.stringify(draftAction))
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

    applyRichAction(action: RichAction) {
        switch (action.name) {
            case 'create':
                this.applyCreateRichAction(action);
                break;
            case 'delete':
                this.applyDeleteRichAction(action);
                break;
            case 'update':
                this.applyUpdateRichAction(action);
                break;
            case 'move':
                this.applyMoveRichAction(action);
                break;
            case 'replace':
                this.applyReplaceRichAction(action);
                break;
        }
    }

    private definePlacementPosition(createDraft: RichCreateDraft): RichCreateAction['payload']['placement'] | null {
        const selectedElementInfo = this.manipulator!!.selectedElementInfo;
        if (!selectedElementInfo) {
            return null;
        }
        // titles
        if (TITLES_ARRAY.indexOf(createDraft.richType as any) > -1) {
            const rootElement = this.manipulator!!.findNearestRichRootElement(selectedElementInfo.element)!!;
            return {
                anchorElement: rootElement,
                position: 'after'
            };
        }
        // list items
        if (createDraft.richType === 'list-item') {
            if (createDraft.place?.type === 'list-item') {
                const listItemElement = this.manipulator!!.findNearestElementWithType('list-item', selectedElementInfo.element)!!;
                return {
                    anchorElement: listItemElement,
                    position: createDraft.place.position,
                };
            }
        }
        // Add inside selected parent element or add after non-parent element
        if (isRichParentElement(selectedElementInfo.richType)) {
            return {
                anchorElement: selectedElementInfo.element,
                position: 'end'
            };
        }
        return {
            anchorElement: selectedElementInfo.element,
            position: 'after'
        };
    }

    private applyCreateRichAction(richCreateAction: RichCreateAction) {
        console.log("@@@ applyCreateRichAction", JSON.stringify(richCreateAction))
        const newElements = richCreateAction.payload.newElements;
        // place new elements
        if (richCreateAction.payload.placement) {
            const { anchorElement, position } = richCreateAction.payload.placement;
            if (position === 'begin') {
                anchorElement.prepend(...newElements);
            } else if (position === 'end') {
                anchorElement.append(...newElements);
            } else if (position === 'before') {
                anchorElement.before(...newElements);
            } else if (position === 'after') {
                anchorElement.after(...newElements);
            }
        }
    }

    private applyDeleteRichAction(richDeleteAction: RichDeleteAction) {
        richDeleteAction.payload.element.remove();
    }

    private applyUpdateRichAction(richUpdateAction: RichUpdateAction) {
        const element = richUpdateAction.payload.element;
        const attributes = richUpdateAction.payload.attributes;
        if (attributes) {
            Object.keys(attributes).forEach((attributeName) => {
                // TODO: add attributes filtering
                element.setAttribute(attributeName, attributes[attributeName]);
            });
        }
    }

    private applyMoveRichAction(richMoveAction: RichMoveAction) {
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
    }

    private applyReplaceRichAction(richReplaceAction: RichReplaceAction) {
        const element = richReplaceAction.payload.element;
        const newElement = richReplaceAction.payload.newElement;
        element.replaceWith(newElement);
    }

    private fulfillCreateRichAction(draftAction: RichActionDraft, infoToFulfill?: FulfillmentInfo): RichCreateAction | null {
        if (this.manipulator) {
            const createDraft = draftAction as RichCreateDraft;
            let newElement = createRichHTMLElement(RICH_TYPE_TO_DEFAULT_MAP[createDraft.richType]);
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
            }
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
                                newElement,
                            }
                        };
                    }
                }
            }
        }
        return null;
    }
}