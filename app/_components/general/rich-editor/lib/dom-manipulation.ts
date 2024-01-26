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