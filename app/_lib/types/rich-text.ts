export const RICH_SIMPLE_TYPES = [
	'title', 'title-1', 'title-2', 'title-3', 'title-4',
	'paragraph', 'unknown', 'strong', 'obscure', 'link',
] as const;
export type RichSimpleTypes = (typeof RICH_SIMPLE_TYPES)[number];

export const RICH_COMPLEX_TYPES = [
	'list', 'list-item',
	'expandable-block', 'united-block', 'code-block',
	'info-block', 'warning-block',
] as const;
export type RichComplexTypes = (typeof RICH_COMPLEX_TYPES)[number];
export function isComplexRichType(value: RichTypes): value is RichComplexTypes {
	return RICH_COMPLEX_TYPES.indexOf(value as any) > -1;
}

export const RICH_TYPES = [...RICH_SIMPLE_TYPES, ...RICH_COMPLEX_TYPES] as const;
export type RichTypes = (typeof RICH_TYPES)[number];
export function isRichType(value: string): value is RichTypes {
	return RICH_TYPES.indexOf(value as any) > -1;
}

export type RichTitleTypes = Extract<RichSimpleTypes, 'title-1' | 'title-2' | 'title-3' | 'title-4'>;

export const RICH_CLASSES = [
	'rich-title', 'rich-title-1', 'rich-title-2', 'rich-title-3', 'rich-title-4',
	'rich-paragraph', 'rich-unknown', 'rich-strong', 'rich-obscure', 'rich-link',
	'rich-list', 'rich-list-item',
	'rich-expandable-block', 'rich-united-block', 'rich-code-block',
	'rich-info-block', 'rich-warning-block',
] as const;
export type RichClasses = (typeof RICH_CLASSES)[number];

export const RICH_ATTRIBUTES: Partial<Record<RichTypes, string[]>> = {
	'link': ['href'],
	'title-1': ['id'],
	'title-2': ['id'],
	'title-3': ['id'],
	'title-4': ['id'],
};

export type NewPositionType = 'before' | 'after';

export type NewTransformationType = 'left' | 'right';

export type EditorModes = 'edit' | 'read';

export type PossibleRichParentTypes = RichTypes | 'root' | 'any-parent';

export const SIMPLE_RICH_TYPES_TO_TAGS_MAP: Record<RichSimpleTypes, string> = {
	"title": 'h1',
	"title-1": 'h1',
	"title-2": 'h2',
	"title-3": 'h3',
	"title-4": 'h4',
	'paragraph': 'p',
	'unknown': 'div',
	'strong': 'b',
	'obscure': 'span',
	'link': 'a',
} as const;

export const TAGS_TO_SIMPLE_RICH_TYPES_MAP: Record<string, RichSimpleTypes> = Object.entries(
	SIMPLE_RICH_TYPES_TO_TAGS_MAP
).reduce((acc, cur) => {
	acc[cur[1]] = cur[0];
	return acc;
}, {} as Record<string, string>) as Record<string, RichSimpleTypes>;

export const RICH_TYPES_TO_POSSIBLE_PARENT_TYPES: Record<RichTypes, PossibleRichParentTypes[]> = {
	'title': ['root'],
	'title-1': ['root'],
	'title-2': ['root'],
	'title-3': ['root'],
	'title-4': ['root'],
	'paragraph': ['root', 'list-item', 'united-block', 'expandable-block'],
	'unknown': ['any-parent'],
	'strong': ['paragraph'],
	'obscure': ['paragraph'],
	'link': ['paragraph'],
	'list': ['root', 'list-item', 'united-block', 'expandable-block'],
	'list-item': ['list', 'list-item', 'united-block', 'expandable-block'],
	'expandable-block': ['root', 'list-item', 'united-block'],
	'united-block': ['root', 'list-item'],
	'code-block': ['root', 'list-item', 'united-block', 'expandable-block'],
	'info-block': ['root', 'list-item'],
	'warning-block': ['root', 'list-item']
};

export const RICH_TYPES_TO_RICH_CLASSES_MAP: Record<RichTypes, RichClasses> = {
	'title': 'rich-title',
	'title-1': 'rich-title-1',
	'title-2': 'rich-title-2',
	'title-3': 'rich-title-3',
	'title-4': 'rich-title-4',
	'paragraph': 'rich-paragraph',
	'unknown': 'rich-unknown',
	'strong': 'rich-strong',
	'obscure': 'rich-obscure',
	'link': 'rich-link',
	'list': 'rich-list',
	'list-item': 'rich-list-item',
	'expandable-block': 'rich-expandable-block',
	'united-block': 'rich-united-block',
	'code-block': 'rich-code-block',
	'info-block': 'rich-info-block',
	'warning-block': 'rich-warning-block',
};

export const RICH_LIST_ITEM_SIGN_CLASS = `${RICH_TYPES_TO_RICH_CLASSES_MAP['list-item']}-sign`;
export const RICH_LIST_ITEM_CONTENT_CLASS = `${RICH_TYPES_TO_RICH_CLASSES_MAP['list-item']}-content`;

export const RICH_CODE_BLOCK_ICON_CLASS = `${RICH_TYPES_TO_RICH_CLASSES_MAP['code-block']}-icon`;
export const RICH_CODE_BLOCK_CONTENT_CLASS = `${RICH_TYPES_TO_RICH_CLASSES_MAP['code-block']}-content`;

export const RICH_EXPANDABLE_BLOCK_TITLE_CLASS = `${RICH_TYPES_TO_RICH_CLASSES_MAP['expandable-block']}-title`;
export const RICH_EXPANDABLE_BLOCK_CONTENT_CLASS = `${RICH_TYPES_TO_RICH_CLASSES_MAP['expandable-block']}-content`;

export const RICH_CLASSES_TO_RICH_TYPES_MAP: Record<RichClasses, RichTypes> = Object.entries(
	RICH_TYPES_TO_RICH_CLASSES_MAP
).reduce((acc, cur) => {
	acc[cur[1]] = cur[0];
	return acc;
}, {} as Record<string, string>) as Record<RichClasses, RichTypes>;

export interface DescriptionFragment {
	richType: RichTypes;
	attributes?: Record<string, string> | null;
	children: (string | DescriptionFragment)[];
}