import type { RichTypes } from "$lib/types/rich-text";
import type { CreateAction } from "./create-actions";
import type { ModifyAction } from "./modify-action";
import type { MoveAction } from "./move-actions";
import type { TransformAction } from "./transform-actions";

export type EditionAction = CreateAction | MoveAction | TransformAction | ModifyAction;

export interface EditionResult {
    name: 'created' | 'transformed' | 'moved' | 'modified',
    elementInfo: {
        element: HTMLElement,
        richType: RichTypes,
    },
}

export interface EditorCommand {
    name: 'save' | 'copy' | 'replace' | 'delete' | 'undoDelete' | 'upgradeSelection' | 'help' | 'cancel';
}