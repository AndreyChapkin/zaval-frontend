import type { RichTypes } from "$lib/types/rich-text";

export interface CreateDraftAction {
    type: 'create',
    name: 'draft',
    richType: RichTypes,
}

export interface CreateSimpleAction {
    type: 'create',
    name: 'simple',
    richType: RichTypes,
    container: HTMLElement,
    data?: string,
}

export interface CreateComplexAction {
    type: 'create',
    name: 'complex',
    richType: RichTypes,
    container: HTMLElement,
    data?: string,
}

export type CreateAction = CreateDraftAction | CreateSimpleAction | CreateComplexAction;