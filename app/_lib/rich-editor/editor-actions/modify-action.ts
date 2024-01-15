export interface ModifyAttributesAction {
    type: 'modify',
    name: 'attributes',
    element: HTMLElement,
    data: Record<string, string | number>,
}

export interface ModifyDraftListAction {
    type: 'modify',
    name: 'draftExtendList',
    data?: string,
}

export interface ModifyListAction {
    type: 'modify',
    name: 'extendList',
    container: HTMLElement,
    data?: string,
}

export type ModifyAction = ModifyAttributesAction | ModifyListAction | ModifyDraftListAction;