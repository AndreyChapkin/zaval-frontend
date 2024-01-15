export function checkTextModification(event: KeyboardEvent): boolean {
	if (event.ctrlKey) {
		if (event.code === 'KeyV' || event.code === 'KeyX' || event.code === 'KeyZ') {
			return true;
		}
	}
	return false;
}