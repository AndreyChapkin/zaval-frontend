import { RICH_TYPE_TO_DEFAULT_MAP, RichTitleElement, RichTitleType, RichType, TITLES_ARRAY, isRichParentElement, isRichType } from "@/app/_lib/types/rich-text-types";
import { useEffect, useState } from "react";
import { RichDomManipulator, RichTranslators, createRichHTMLElement, createTextNode, defineElementRichType, parseRichHTMLElement } from "./rich-dom-manipulations";
import { translateEventToEditorCommand } from "./rich-command-processors";
import { findSelectedTextNode } from "./dom-selections";

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

export type RichActionTypes = 'create' | 'delete' | 'update' | 'move' | 'replace';

export type TouchedNodeInfo = {
    type: RichType;
    element: HTMLElement;
} | {
    type: 'container',
} | {
    type: 'text',
    text: Text;
};

export function getNodeFromTouchedNodeInfo(info: TouchedNodeInfo): HTMLElement | Text | null {
    if (info.type === 'text') {
        return info.text;
    }
    if (info.type === 'container') {
        return null;
    }
    return info.element;
}

export interface RichCreateAction {
    name: 'create';
    payload: {
        newElements: TouchedNodeInfo[];
        placement: {
            anchorElement: TouchedNodeInfo;
            position: 'before' | 'after' | 'begin' | 'end';
        };
    };
}

export function asCreateAction(newElements: HTMLElement[], placement: { element: HTMLElement; position: 'before' | 'after' | 'begin' | 'end'; }): RichCreateAction {
    const createNewElements: TouchedNodeInfo[] = newElements.map((element) => {
        const richType = defineElementRichType(element);
        if (richType) {
            return {
                type: richType,
                element,
            };
        }
        return {
            type: 'text',
            text: createTextNode(element.textContent ?? ''),
        };
    });
    let finalPlacement: RichCreateAction['payload']['placement'] = {
        anchorElement: {
            type: 'container',
        },
        position: placement.position,
    };
    const anchorRichType = defineElementRichType(placement.element);
    if (anchorRichType) {
        finalPlacement = {
            anchorElement: {
                type: anchorRichType,
                element: placement.element,
            },
            position: placement.position,
        };
    }
    if (placement.element instanceof Text) {
        finalPlacement = {
            anchorElement: {
                type: 'text',
                text: placement.element,
            },
            position: placement.position,
        };
    }
    return {
        name: 'create',
        payload: {
            newElements: createNewElements,
            placement: finalPlacement,
        }
    };
}

export interface RichDeleteAction {
    name: 'delete';
    payload: {
        elements: (HTMLElement | Text)[];
    };
}

export function asDeleteAction(element: HTMLElement): RichDeleteAction {
    return {
        name: 'delete',
        payload: {
            elements: [element],
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
        elements: ChildNode[];
        newElements: ChildNode[];
    };
}

export function asReplaceAction(elements: ChildNode[], newElements: ChildNode[]): RichReplaceAction {
    return {
        name: 'replace',
        payload: {
            elements,
            newElements,
        }
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

    // return reverse action
    applyRichAction(action: RichAction): RichAction {
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
                anchorElement: {
                    type: 'container',
                },
                position: 'end'
            };
        }
        // titles
        if (TITLES_ARRAY.indexOf(createDraft.richType as any) > -1) {
            const rootElement = this.manipulator.findNearestRichRootElement(selectedElementInfo.element);
            if (!rootElement) {
                return {
                    anchorElement: {
                        type: 'container',
                    },
                    position: 'end'
                };
            }
            return {
                anchorElement: {
                    type: defineElementRichType(rootElement)!!,
                    element: rootElement,
                },
                position: 'after'
            };
        }
        // list items
        if (createDraft.richType === 'list-item') {
            // detect context
            const listItemElement = this.manipulator.findNearestElementWithType('list-item', selectedElementInfo.element);
            if (listItemElement) {
                return {
                    anchorElement: {
                        type: 'list-item',
                        element: listItemElement
                    },
                    position: 'after',
                };
            }
            return null;
        }
        // link or strong elements
        if (createDraft.richType === 'link' || createDraft.richType === 'strong') {
            // create only inside paragraph
            if (selectedElementInfo.richType === 'paragraph') {
                const selectedTextNode = findSelectedTextNode();
                if (selectedTextNode) {
                    return {
                        anchorElement: {
                            type: 'text',
                            text: selectedTextNode
                        },
                        position: 'after'
                    };
                }
                return {
                    anchorElement: {
                        type: 'paragraph',
                        element: selectedElementInfo.element
                    },
                    position: 'end'
                };
            }
            return null;
        }
        // if selected element is parent
        if (isRichParentElement(selectedElementInfo.richType)) {
            return {
                anchorElement: {
                    type: selectedElementInfo.richType,
                    element: selectedElementInfo.element
                },
                position: 'end'
            };
        }
        // any other cases
        return {
            anchorElement: {
                type: selectedElementInfo.richType,
                element: selectedElementInfo.element
            },
            position: 'after'
        };
    }

    private applyCreateRichAction(richCreateAction: RichCreateAction): RichDeleteAction {
        const newElementInfos = richCreateAction.payload.newElements;
        const newElements = newElementInfos.map((el) => {
            if (el.type === 'container') {
                return this.manipulator!!.containerElement;
            }
            if (el.type === 'text') {
                return el.text;
            }
            return el.element;
        });
        // place new elements
        if (richCreateAction.payload.placement) {
            const { anchorElement: anchorElementInfo, position } = richCreateAction.payload.placement;
            const anchorNode = anchorElementInfo.type === 'container' ?
                this.manipulator!!.containerElement
                : anchorElementInfo.type === 'text' ?
                    anchorElementInfo.text
                    : anchorElementInfo.element;
            const type = anchorElementInfo.type;
            const richTranslator = type === 'container' || type === 'text' ?
                null
                : RichTranslators[type];
            if (position === 'begin') {
                const anchorElement = anchorNode as HTMLElement;
                if (richTranslator?.contentHtml) {
                    richTranslator.contentHtml(anchorElement).prepend(...newElements);
                } else {
                    anchorElement.prepend(...newElements);
                }
            } else if (position === 'end') {
                const anchorElement = anchorNode as HTMLElement;
                if (richTranslator?.contentHtml) {
                    richTranslator.contentHtml(anchorElement).append(...newElements);
                } else {
                    anchorElement.append(...newElements);
                }
            } else if (position === 'before') {
                anchorNode.before(...newElements);
            } else if (position === 'after') {
                anchorNode.after(...newElements);
            }
        }
        return {
            name: 'delete',
            payload: {
                elements: newElements,
            },
        };
    }

    // all elements are siblings
    private applyDeleteRichAction(richDeleteAction: RichDeleteAction): RichCreateAction {
        const deleteElements = richDeleteAction.payload.elements;
        const firstElement = deleteElements[0];
        const lastElement = deleteElements[deleteElements.length - 1];
        const previous = firstElement.previousSibling;
        const next = lastElement.nextSibling;
        const parentInfo = this.manipulator?.findNearestRichParentElement(firstElement);
        const parent = parentInfo?.type === 'container' ? null : parentInfo?.element as HTMLElement | null;
        for (let element of deleteElements) {
            element.remove();
        }
        const reverseCreateElements: TouchedNodeInfo[] = deleteElements.map((element) => {
            return element instanceof Text ?
                {
                    type: 'text',
                    text: element,
                }
                : {
                    type: defineElementRichType(element)!!,
                    element,
                };
        });
        const reversePlacement: RichCreateAction['payload']['placement'] =
            previous ?
                previous instanceof Text ?
                    {
                        anchorElement: {
                            type: 'text',
                            text: previous,
                        },
                        position: 'after',
                    }
                    : {
                        anchorElement: {
                            type: defineElementRichType(previous as HTMLElement)!!,
                            element: previous as HTMLElement,
                        },
                        position: 'after',
                    }
                : next ?
                    next instanceof Text ?
                        {
                            anchorElement: {
                                type: 'text',
                                text: next,
                            },
                            position: 'before',
                        }
                        : {
                            anchorElement: {
                                type: defineElementRichType(next as HTMLElement)!!,
                                element: next as HTMLElement,
                            },
                            position: 'before',
                        }
                    : parent ? {
                        anchorElement: {
                            type: defineElementRichType(parent as HTMLElement)!!,
                            element: parent as HTMLElement,
                        },
                        position: 'end',
                    } : {
                        anchorElement: {
                            type: 'container',
                        },
                        position: 'end',
                    };
        return {
            name: 'create',
            payload: {
                newElements: reverseCreateElements,
                placement: reversePlacement,
            }
        }
    }

    private applyUpdateRichAction(richUpdateAction: RichUpdateAction): RichUpdateAction {
        const element = richUpdateAction.payload.element;
        const attributes = richUpdateAction.payload.attributes;
        const prevAttributes: Record<string, string> = {};
        if (attributes) {
            Object.keys(attributes).forEach((attributeName) => {
                // TODO: add attributes filtering
                prevAttributes[attributeName] = element.getAttribute(attributeName) ?? '';
                element.setAttribute(attributeName, attributes[attributeName]);
            });
        }
        return {
            name: 'update',
            payload: {
                element,
                attributes: prevAttributes,
            },
        };
    }

    private applyMoveRichAction(richMoveAction: RichMoveAction): RichMoveAction {
        const element = richMoveAction.payload.element;
        const direction = richMoveAction.payload.direction;
        const reverseDirection: 'up' | 'down' = direction === 'up' ? 'down' : 'up';
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
            name: 'move',
            payload: {
                element,
                direction: reverseDirection
            },
        };
    }

    private applyReplaceRichAction(richReplaceAction: RichReplaceAction): RichReplaceAction {
        const elements = richReplaceAction.payload.elements;
        const newElements = richReplaceAction.payload.newElements;
        for (let i = 0; i < elements.length; i++) {
            if (i === 0) {
                continue;
            }
            elements[i].remove();
        }
        elements[0].replaceWith(...newElements);
        return {
            name: 'replace',
            payload: {
                elements: newElements,
                newElements: elements
            }
        };
    }

    private fulfillCreateRichAction(draftAction: RichActionDraft, infoToFulfill?: FulfillmentInfo): RichCreateAction | null {
        if (this.manipulator) {
            let createDraft = draftAction as RichCreateDraft;
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
                const defaultRichElement = RICH_TYPE_TO_DEFAULT_MAP[createDraft.richType];
                // if create title add id
                if (TITLES_ARRAY.indexOf(defaultRichElement.type as any) > -1) {
                    (defaultRichElement as RichTitleElement).id = crypto.randomUUID();
                }
                newElement = createRichHTMLElement(defaultRichElement);
            }
            // define new element placement
            if (newElement) {
                const placement = this.definePlacementPosition(createDraft);
                if (placement) {
                    return {
                        name: 'create',
                        payload: {
                            newElements: [
                                {
                                    type: createDraft.richType as RichType,
                                    element: newElement
                                },
                            ],
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
                    elements: [selectedElement],
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
                                elements: [selectedElement],
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