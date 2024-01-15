export interface MoveDraftWithinAction {
    type: 'move',
    name: 'draftWithin',
    direction: 'up' | 'down',  
}

export interface MoveWithinAction {
    type: 'move',
    name: 'within',
    direction: 'up' | 'down',
    selectedElement: HTMLElement,
    container: HTMLElement,
}

export type MoveAction = MoveDraftWithinAction | MoveWithinAction;