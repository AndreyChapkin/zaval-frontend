export function findSelectedElement(): HTMLElement | null {
	let selection = window.getSelection();
	if (selection) {
		if (selection.anchorNode) {
			let curNode = selection.anchorNode as Node | ParentNode | null;
			// go to the nearest HTMLElement node
			while (curNode && !(curNode instanceof HTMLElement)) {
				curNode = curNode.parentNode;
			}
			if (curNode) {
				return curNode;
			}
		}
	}
	return null;
}

export function findSelectedTextNode(): Text | null {
	let selection = window.getSelection();
	if (selection) {
		if (selection.anchorNode) {
			let curNode = selection.anchorNode as Node | ParentNode | null;
			if (curNode && curNode instanceof Text) {
				return curNode as Text;
			}
		}
	}
	return null;
}

export function selectTextInNode(
	element: Node,
	startOffset: number | null = null,
	endOffset: number | null = null,
	position: 'start' | 'end' | null = null,
) {
	const elementText = element instanceof Text ?
		element
		: element.firstChild instanceof Text ?
			element.firstChild
			: null;
	if (elementText) {
		const range = new Range();
		const textLength = elementText.textContent?.length ?? 0;
		if (position) {
			if (position === 'start') {
				range.setStart(elementText, 0);
				range.setEnd(elementText, 0);
			} else {
				range.setStart(elementText, textLength);
				range.setEnd(elementText, textLength);
			}
		} else {
			range.setStart(elementText, startOffset == null ? 0 : startOffset);
			range.setEnd(elementText, endOffset == null ? textLength : endOffset);
		}
		window.getSelection()?.removeAllRanges();
		window.getSelection()?.addRange(range);
	}
}

export interface SelectionInfo {
	textNode: Text;
	startOffset: number;
	endOffset: number;
}

export function findSelectionInfo(): SelectionInfo | null {
	let selection = window.getSelection();
	const range = selection?.getRangeAt(0);
	if (selection && range) {
		if (selection.anchorNode) {
			let curNode = selection.anchorNode as Node | ParentNode | null;
			if (curNode && curNode instanceof Text) {
				return {
					textNode: curNode,
					startOffset: range.startOffset,
					endOffset: range.endOffset,
				}
			}
		}
	}
	return null;
}

export function splitTextWithSelectionInfo(selectionInfo: SelectionInfo): {
	selectedText: Text;
	firstText: Text | null;
	secondText: Text | null;
} {
	const textNode = selectionInfo.textNode;
	const fullText = textNode.textContent ?? '';
	const firstTextPart = fullText.substring(0, selectionInfo.startOffset);
	const secondTextPart = fullText.substring(selectionInfo.endOffset);
	return {
		selectedText: textNode,
		firstText: firstTextPart ? document.createTextNode(firstTextPart) : null,
		secondText: secondTextPart ? document.createTextNode(secondTextPart) : null,
	};
}

export function splitSelectedTextWithCursor(): {
	selectedText: Text;
	firstText: Text | null;
	secondText: Text | null;
} | null {
	const textNode = findSelectedTextNode();
	const selection = window.getSelection();
	const range = selection?.getRangeAt(0);
	if (textNode && selection && range) {
		const fullText = textNode.textContent ?? '';
		const firstTextPart = fullText.substring(0, range.startOffset);
		const secondTextPart = fullText.substring(range.endOffset);
		return {
			selectedText: textNode,
			firstText: firstTextPart ? document.createTextNode(firstTextPart) : null,
			secondText: secondTextPart ? document.createTextNode(secondTextPart) : null,
		};
	}
	return null;
}