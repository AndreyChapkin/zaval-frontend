export function selectTextInElement(
	element: Node,
	startOffset: number | null = null,
	endOffset: number | null = null
) {
	const elementText = element instanceof Text ? element : element.firstChild;
	if (elementText) {
		const range = new Range();
		range.setStart(elementText, startOffset == null ? 0 : startOffset);
		const textLength = elementText.textContent?.length ?? 0;
		range.setEnd(elementText, endOffset == null ? textLength : endOffset);
		window.getSelection()?.removeAllRanges();
		window.getSelection()?.addRange(range);
	}
}

export function selectText(
	textNode: Text,
	startOffset: number | null = null,
	endOffset: number | null = null
) {
	const range = new Range();
	range.setStart(textNode, startOffset == null ? 0 : startOffset);
	const textLength = textNode.textContent?.length ?? 0;
	range.setEnd(textNode, endOffset == null ? textLength : endOffset);
	window.getSelection()?.removeAllRanges();
	window.getSelection()?.addRange(range);
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

export function getSelectedText(): string | null {
	const textNode = findSelectedTextNode();
	const selection = window.getSelection();
	const range = selection?.getRangeAt(0);
	if (textNode && selection && range) {
		const fullText = textNode.textContent ?? '';
		const selectedText = fullText.substring(range.startOffset, range.endOffset);
		return selectedText;
	}
	return null;
}

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

export function findNearestParentElement(childElement: Node): HTMLElement | null {
	let curNode = childElement.parentNode;
	// go to the nearest HTMLElement node
	while (curNode && !(curNode instanceof HTMLElement)) {
		curNode = curNode.parentNode;
	}
	if (curNode) {
		return curNode;
	}
	return null;
}

export function pasteTextInSelection(pastedText: string) {
	const textNode = findSelectedTextNode();
	const selection = window.getSelection();
	const range = selection?.getRangeAt(0);
	if (textNode && selection && range) {
		const fullText = textNode.textContent ?? '';
		const firstTextPart = fullText.substring(0, range.startOffset);
		const secondTextPart = fullText.substring(range.endOffset);
		textNode.textContent = `${firstTextPart}${pastedText}${secondTextPart}`;
		const newRange = new Range();
		newRange.setStart(textNode, firstTextPart.length + pastedText.length);
		newRange.setEnd(textNode, firstTextPart.length + pastedText.length);
		window.getSelection()?.removeAllRanges();
		window.getSelection()?.addRange(newRange);
	}
}

export function setCaretWithinNode(node: Node): 'set' | null {
	if (node instanceof Text) {
		selectTextInElement(node, 0, 0);
		return 'set';
	} else {
		for (let childNode of node.childNodes) {
			const result = setCaretWithinNode(childNode);
			if (result) {
				return result;
			}
		}
	}
	return null;
}

// deprecated
export function pasteEnterInSelection() {
	const textNode = findSelectedTextNode();
	let selection = window.getSelection();
	if (selection && textNode) {
		const range = selection.getRangeAt(0);
		if (range) {
			const textOffset = range.startOffset;
			if (range.startOffset >= textNode.textContent!!.length) {
				textNode.after("\r\n\r\n");
				selectText(textNode.nextSibling as Text, 2, 2);
			} else {
				const prevText = textNode.textContent ?? '';
				const newText = prevText.substring(0, textOffset) + '\r\n' + prevText.substring(textOffset);
				textNode.textContent = newText;
				selectText(textNode, textOffset + 2, textOffset + 2);
			}
		}
	}
}

// deprecated
export function pasteSpacesInSelection() {
	const textNode = findSelectedTextNode();
	let selection = window.getSelection();
	if (selection && textNode) {
		const range = selection.getRangeAt(0);
		if (range) {
			const textOffset = range.startOffset;
			const prevText = textNode.textContent ?? '';
			const newText = prevText.substring(0, textOffset) + '  ' + prevText.substring(textOffset);
			textNode.textContent = newText;
			selectText(textNode, textOffset + 2, textOffset + 2);
		}
	}
}

export function pasteElementsInSelection(elements: (string | Node)[]) {
	const textNode = findSelectedTextNode();
	const selection = window.getSelection();
	const range = selection?.getRangeAt(0);
	if (textNode && selection && range) {
		const fullText = textNode.textContent ?? '';
		const firstTextPart = fullText.substring(0, range.startOffset);
		const secondTextPart = fullText.substring(range.endOffset);
		textNode.replaceWith(firstTextPart, ...elements, secondTextPart);
	}
}