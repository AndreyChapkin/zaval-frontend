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

export function selectTextInNode(
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

export function findSelectionInfo(): { textNode: Text, startOffset: number, endOffset: number } | null {
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