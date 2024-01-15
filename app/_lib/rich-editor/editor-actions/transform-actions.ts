export interface TransformTitleAction {
    type: 'transform',
    name: 'title',
    description: 'upgrade' | 'downgrade',
}

export type TransformAction = TransformTitleAction;