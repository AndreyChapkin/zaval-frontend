import { useState } from "react";
import { FulfillmentInfo, RichAction, RichActionDraft } from "./rich-action-processors";

export type RichEditorState = {
	name: "nativeEdition",
} | {
	name: "promptShowing",
} | {
	name: "waitingForActionFilling",
	draftAction: RichActionDraft,
} | {
	name: "actionFilling",
	fulfillmentInfo: FulfillmentInfo,
} | {
	name: "actionApplying",
	actions: RichAction[],
};

export function toNativeEditionState(): RichEditorState {
	return { name: 'nativeEdition' };
}

export function toPromptShowingState(): RichEditorState {
	return { name: 'promptShowing' };
}

export function toWaitingForActionFillingState(draftAction: RichActionDraft): RichEditorState {
	return { name: 'waitingForActionFilling', draftAction };
}

export function toActionFillingState(fulfillmentInfo: FulfillmentInfo): RichEditorState {
	return { name: 'actionFilling', fulfillmentInfo };
}

export function toActionApplyingState(actions: RichAction[]): RichEditorState {
	return { name: 'actionApplying', actions };
}

export function useRichEditorStateManager(initialState: RichEditorState): {
	currentState: RichEditorState,
	previousState: RichEditorState | null,
	switchToState: (newRichEditorState: RichEditorState) => void,
	switchToPreviousState: () => void,
} {
	const [richEditorState, setRichEditorState] = useState<RichEditorState>(initialState);
	const [history, setHistory] = useState<RichEditorState[]>([]);
	return {
		currentState: richEditorState,
		previousState: history[history.length - 1] ?? null,
		switchToState(newRichEditorState: RichEditorState) {
			let newHistory = [...history, richEditorState];
			if (newHistory.length > 10) {
				// Remember only 10 last states
				newHistory = newHistory.slice(-10);
			}
			setHistory(newHistory);
			setRichEditorState(newRichEditorState);
		},
		switchToPreviousState() {
			if (history.length > 0) {
				setRichEditorState(history[history.length - 1]);
				setHistory(history.slice(0, -1));
			}
		},
	};
}