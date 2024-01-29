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