import { RichElement, RichElementParent, RichListElement, RichListItemElement, RichSimpleElement, RichTitleElement } from "@/app/_lib/types/rich-text";

const LIST_ITEM_LINE_PATTERN = /^\s*- /;

const ElementToToken = {
	'title-1': '#',
	'title-2': '##',
	'title-3': '###',
	'title-4': '####',
	'linkBegin': "[[",
	'linkEnd': "]]",
	'linkSeparator': '||',
	'strongBegin': '**',
	'strongEnd': '**',
} as const;

type LineParseResult = ({
	type: 'paragraphChildren';
	elements: RichElement[];
} | {
	type: 'title';
	element: RichTitleElement;
} | {
	type: 'list';
	element: RichListElement;
} | {
	type: 'list-item';
	element: RichListItemElement;
}) & { intentation: number };

type ParserContext = {
	parents: RichElementParent[];
};

class RichEditorParser {
	parents: RichElementParent[] = [];
	intentation = 0;
	result: RichElement[] = [];

	currentParent(): RichElementParent | null {
		return this.parents[this.parents.length - 1] || null;
	}

	enterNewParent(parent: RichElementParent) {
		if (parent.type === 'list-item') {
			this.intentation = 2;
		} else {
			const currentParent = this.currentParent();
			if (currentParent?.type === 'list') {
				this.leaveCurrentParent();
			}
		}
		this.parents.push(parent);
	}

	leaveCurrentParent() {
		const leavedParent = this.parents.pop();
		if (leavedParent?.type === 'list-item') {
			this.intentation = Math.max(0, this.intentation - 2);
		}
	}

	appendToCorrectLevel(richElement: RichElement) {
		const currentParent = this.currentParent();
		if (currentParent) {
			currentParent.children.push(richElement);
		} else {
			this.result.push(richElement);
		}
	};

	leaveAllParents() {
		this.parents = [];
		this.intentation = 0;
	}

	parseTitleLine(line: string): RichTitleElement | null {
		if (line.startsWith('#')) {
			return {
				type: 'title-1',
				name: line.substring(1),
			};
		} else if (line.startsWith('##')) {
			return {
				type: 'title-2',
				name: line.substring(2),
			};
		} else if (line.startsWith('###')) {
			return {
				type: 'title-3',
				name: line.substring(3),
			};
		} else if (line.startsWith('####')) {
			return {
				type: 'title-4',
				name: line.substring(4),
			};
		}
		return null;
	}

	parseListItemLine(line: string): RichListItemElement | null {
		const listItemStartMatchArray = line.match(LIST_ITEM_LINE_PATTERN);
		if (listItemStartMatchArray) {
			const parseResult = this.parseLine(line.substring(listItemStartMatchArray[0].length));
            const children = parseResult.type === 'paragraphChildren' ? parseResult.elements : [parseResult.element];
			return {
				type: 'list-item',
				children,
			};
		}
		return null;
	}

	convertToSimpleRichElement(lines: string[]): RichSimpleElement {
		return {
			type: 'simple',
			text: lines.join('\n'),
		};
	}

	splitParagraphLine(line: string) {
		const containAtLeastOneLink = line.indexOf(ElementToToken['linkBegin']) > -1 && line.indexOf(ElementToToken['linkEnd']) > -1;
		const containAtLeastOneStrong = line.indexOf(ElementToToken['strongBegin']) > -1 && line.indexOf(ElementToToken['strongEnd']) > -1;
		if (!containAtLeastOneLink && !containAtLeastOneStrong) {
			const simpleElement = this.convertToSimpleRichElement([line]);
			return simpleElement ? [simpleElement] : [];
		}
		const resultChildElements: RichElement[] = [];
		let tailIndex = 0;
		let headIndex = 0;
		for (headIndex = 0; headIndex < line.length + 1; headIndex++) {
			const fragment = line.substring(headIndex, headIndex + 2);
			if (fragment === ElementToToken['linkBegin']) {
				const prevSimpleContent = line.substring(tailIndex, headIndex);
				if (prevSimpleContent) {
					resultChildElements.push({
						type: 'simple',
						text: prevSimpleContent,
					});
				}
				// link zone
				headIndex += 2;
				const linkEnd = line.indexOf(ElementToToken['linkEnd'], headIndex);
				const linkContent = line.substring(headIndex, linkEnd);
				resultChildElements.push({
					type: 'link',
					name: linkContent,
					href: linkContent,
				});
				headIndex = linkEnd + 2;
				tailIndex = headIndex;
			}
			if (fragment === ElementToToken['strongBegin']) {
				const prevSimpleContent = line.substring(tailIndex, headIndex);
				if (prevSimpleContent) {
					resultChildElements.push({
						type: 'simple',
						text: prevSimpleContent,
					});
				}
				// link zone
				headIndex += 2;
				const linkEnd = line.indexOf(ElementToToken['linkEnd'], headIndex);
				const strongContent = line.substring(headIndex, linkEnd);
				resultChildElements.push({
					type: 'strong',
					text: strongContent,
				});
				headIndex = linkEnd + 2;
				tailIndex = headIndex;
			}
		}
		const restSimpleContent = line.substring(tailIndex, headIndex);
		if (restSimpleContent) {
			resultChildElements.push({
				type: 'simple',
				text: line.substring(tailIndex, headIndex),
			});
		}
		return resultChildElements
	}

	manageMergeOrNewParagraph(newChildren: RichElement[]): 'merged' | 'new' {
		const modifiedNewChildren = [...newChildren];
		const currentParent = this.currentParent();
		if (currentParent && currentParent.type === 'paragraph') {
			//try to merge adjacent simple elements
			const previousLastChild = currentParent.children[currentParent.children.length - 1];
			const firstOfNewChildren = newChildren[0];
			if (previousLastChild?.type === 'simple' && firstOfNewChildren?.type === 'simple') {
				const previousLastChildSimple = previousLastChild as RichSimpleElement;
				const firstOfNewChildrenSimple = firstOfNewChildren as RichSimpleElement;
				previousLastChildSimple.text += '\n' + firstOfNewChildrenSimple.text;
				modifiedNewChildren.shift();
			}
			// merge rest of the new children
			currentParent.children.push(...modifiedNewChildren);
			return 'merged';
		}
		this.enterNewParent({
			type: 'paragraph',
			children: newChildren,
		});
		return 'new';
	}

	cutIntentation(line: string): { line: string; intentation: number } {
		let count = 0;
		for (const char of line) {
			if (char === ' ') {
				count++;
			} else {
				break;
			}
		}
		return {
			line: line.substring(count),
			intentation: count,
		};
	}

	parseLine(line: string): LineParseResult {
		const cuttedLineDesc = this.cutIntentation(line);
		let result: RichElement | null = this.parseTitleLine(cuttedLineDesc.line);
		if (result) {
			return {
				type: 'title',
				element: result,
				intentation: cuttedLineDesc.intentation,
			};
		}
		// List item line
		result = this.parseListItemLine(cuttedLineDesc.line);
		if (result) {
			return {
				type: 'list-item',
				element: result,
				intentation: cuttedLineDesc.intentation,
			};
		}
		// paragraph line
		const paragraphChildren = this.splitParagraphLine(line);
		return {
			type: 'paragraphChildren',
			elements: paragraphChildren,
			intentation: cuttedLineDesc.intentation,
		};
	}

    // TODO: finish this
	parseText(text: string) {
		const lines = text.split('\n');
		for (const line of lines) {
			// Skip lines not for rendering
			if (!line) {
				continue;
			}
			const lineParseResult = this.parseLine(line);
			// try to close previous parent
			if (this.currentParent()?.type === 'list-item') {
				while (this.currentParent()?.type === 'list-item') {
					if (lineParseResult.intentation < this.intentation) {
						this.leaveCurrentParent();
						// one extra leave if we are in list
						if (this.currentParent()?.type === 'list') {
							this.leaveCurrentParent();
						}
					}
				}
			} else if (lineParseResult.type === 'title') {
				this.leaveAllParents();
			}
			// add new elements
			if (lineParseResult.type === 'list-item') {
				// ensure that list item is within a list
				const listItemElement = lineParseResult.element;
				if (this.currentParent()?.type === 'list') {
					this.currentParent()?.children.push(listItemElement);
				} else {
					// Append new list element
					const listElement: RichListElement = {
						type: 'list',
						children: [listItemElement],
					};
					this.enterNewParent(listElement);
					this.enterNewParent(listItemElement);
				}
			}
            // Add elements to result
			//this.appendToCorrectLevel(lineParseResult.elements);
		}
	}
}