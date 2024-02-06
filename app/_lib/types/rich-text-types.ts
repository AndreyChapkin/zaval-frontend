
export interface RichElementBase {
	type: RichType;
}

export interface RichParentElement {
	children: RichElement[];
}

export interface RichTitleElement extends RichElementBase {
	type: RichTitleType;
	text: string;
	id: string;
}

export interface RichLinkElement extends RichElementBase {
	type: 'link';
	name: string;
	href: string;
}

export interface RichStrongElement extends RichElementBase {
	type: 'strong';
	text: string;
}

export interface RichListElement extends RichElementBase {
	type: 'list';
	listItems: RichListItemElement[];
}

export interface RichListItemElement extends RichElementBase, RichParentElement {
	type: 'list-item';
	children: RichElement[];
}

export interface RichParagraphElement extends RichElementBase {
	type: 'paragraph';
	textFragments: (RichElement | string)[];
}

export interface RichExpandableBlockElement extends RichElementBase, RichParentElement {
	type: 'expandable-block';
	title: string;
	children: RichElement[];
}

export interface RichUnitedBlockElement extends RichElementBase, RichParentElement {
	type: 'united-block';
	children: RichElement[];
}

export interface RichCodeBlockElement extends RichElementBase {
	type: 'code-block';
	text: string;
}

export interface RichUnknownElement {
	type: 'unknown';
	text: string;
}

export function isRichParentElement(elementType: RichType): boolean {
	return [
		'list-item', 'expandable-block', 'united-block',
	].indexOf(elementType) > -1;
}

export type RichElement = RichLinkElement | RichStrongElement
	| RichTitleElement | RichUnknownElement | RichCodeBlockElement
	| RichParagraphElement | RichListElement | RichListItemElement
	| RichExpandableBlockElement | RichUnitedBlockElement | RichCodeBlockElement;

export type RichElementParent = Extract<RichElement,
	RichListItemElement | RichExpandableBlockElement | RichUnitedBlockElement>;

export const RICH_TYPES = [
	'title-1', 'title-2', 'title-3', 'title-4',
	'paragraph', 'unknown', 'strong', 'link', 'list', 'list-item',
	'expandable-block', 'united-block', 'code-block',
] as const;
export type RichType = (typeof RICH_TYPES)[number];

export function isRichType(value: string): value is RichType {
	return RICH_TYPES.indexOf(value as any) > -1;
}

export type RichTitleType = Extract<RichType, 'title-1' | 'title-2' | 'title-3' | 'title-4'>;
export const TITLES_ARRAY: RichTitleType[] = ['title-1', 'title-2', 'title-3', 'title-4'] as const;

export const RICH_CLASS_NAMES = [
	'richTitle1', 'richTitle2', 'richTitle3', 'richTitle4',
	'richParagraph', 'richUnknown', 'richStrong', 'richLink',
	'richList', 'richListItem',
	'richExpandableBlock', 'richUnitedBlock', 'richCodeBlock',
] as const;
export type RichClassName = (typeof RICH_CLASS_NAMES)[number];

export const RICH_TYPE_TO_CLASS_NAME_MAP: Record<RichType, RichClassName> = {
	'title-1': 'richTitle1',
	'title-2': 'richTitle2',
	'title-3': 'richTitle3',
	'title-4': 'richTitle4',
	'paragraph': 'richParagraph',
	'unknown': 'richUnknown',
	'strong': 'richStrong',
	'link': 'richLink',
	'list': 'richList',
	'list-item': 'richListItem',
	'expandable-block': 'richExpandableBlock',
	'united-block': 'richUnitedBlock',
	'code-block': 'richCodeBlock',
} as const;

export const RICH_CLASS_NAME_TO_TYPE_MAP: Record<RichClassName, RichType> = Object.entries(
	RICH_TYPE_TO_CLASS_NAME_MAP
).reduce((acc, cur) => {
	acc[cur[1]] = cur[0];
	return acc;
}, {} as Record<string, string>) as Record<RichClassName, RichType>;

export const RICH_TYPE_TO_DEFAULT_MAP: Record<RichType, RichElement> = {
	'title-1': { type: 'title-1', text: 'Placeholder', id: 'Placeholder' },
	'title-2': { type: 'title-2', text: 'Placeholder', id: 'Placeholder' },
	'title-3': { type: 'title-3', text: 'Placeholder', id: 'Placeholder' },
	'title-4': { type: 'title-4', text: 'Placeholder', id: 'Placeholder' },
	'paragraph': {
		type: 'paragraph',
		textFragments: ['Placeholder']
	},
	'unknown': { type: 'unknown', text: 'Placeholder' },
	'strong': { type: 'strong', text: 'Placeholder' },
	'link': { type: 'link', name: 'Placeholder', href: 'Placeholder' },
	'list': {
		type: 'list',
		listItems: [{
			type: 'list-item',
			children: [
				{
					type: 'paragraph',
					textFragments: ['Placeholder']
				}
			]
		}]
	},
	'list-item': {
		type: 'list-item',
		children: [
			{
				type: 'paragraph',
				textFragments: ['Placeholder']
			}
		]
	},
	'expandable-block': {
		type: 'expandable-block', title: 'Placeholder',
		children: [
			{
				type: 'paragraph',
				textFragments: ['Placeholder']
			},
		]
	},
	'united-block': {
		type: 'united-block',
		children: [
			{
				type: 'paragraph',
				textFragments: ['Placeholder']
			},
		]
	},
	'code-block': {
		type: 'code-block',
		text: 'Placeholder',
	},
} as const;

export type NewPositionType = 'before' | 'after';
export type NewTransformationType = 'left' | 'right';

export const RICH_LIST_ITEM_SIGN_CLASS = `${RICH_TYPE_TO_CLASS_NAME_MAP['list-item']}Sign`;
export const RICH_LIST_ITEM_CONTENT_CLASS = `${RICH_TYPE_TO_CLASS_NAME_MAP['list-item']}Content`;

export const RICH_CODE_BLOCK_ICON_CLASS = `${RICH_TYPE_TO_CLASS_NAME_MAP['code-block']}Icon`;
export const RICH_CODE_BLOCK_CONTENT_CLASS = `${RICH_TYPE_TO_CLASS_NAME_MAP['code-block']}Content`;

export const RICH_EXPANDABLE_BLOCK_TITLE_CLASS = `${RICH_TYPE_TO_CLASS_NAME_MAP['expandable-block']}Title`;
export const RICH_EXPANDABLE_BLOCK_CONTENT_CLASS = `${RICH_TYPE_TO_CLASS_NAME_MAP['expandable-block']}Content`;

export const RICH_SELECTED_ELEMENT_CLASS = 'richSelectedElement';