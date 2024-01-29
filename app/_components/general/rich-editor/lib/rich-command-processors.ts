export interface EditorCommand {
    name: 'save' | 'copy' | 'replace' | 'delete' | 'undoDelete' | 'upgradeSelection' | 'help' | 'cancel';
}

const KEY_TO_EDITION_COMMAND_MAP: Record<string, EditorCommand> = {
	'Alt+KeyS': {
		name: 'save',
	},
	'Alt+KeyC': {
		name: 'copy',
	},
	'Alt+Shift+KeyC': {
		name: 'replace',
	},
	'Alt+KeyH': {
		name: 'help',
	},
	'Alt+Shift+ArrowLeft': {
		name: 'upgradeSelection',
	},
	'Alt+Delete': {
		name: 'delete',
	},
	'Alt+Shift+Delete': {
		name: 'undoDelete',
	},
	'Esc': {
		name: 'cancel'
	},
};

export function translateEventToEditorCommand(event: React.KeyboardEvent<HTMLElement>): EditorCommand | null {
	let combination = event.code;
	if (event.shiftKey) {
		combination = `Shift+${combination}`;
	}
	if (event.altKey) {
		combination = `Alt+${combination}`;
	}
	return KEY_TO_EDITION_COMMAND_MAP[combination] ?? null;
}