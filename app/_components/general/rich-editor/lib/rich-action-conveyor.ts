import { useRef, useState } from "react";
import { FulfillmentInfo, RichAction, RichActionDraft, doesActionNeedFullfillment, useActionProcessor } from "./rich-action-processors";
import { RichDomManipulator } from "./rich-dom-manipulations";

export type ActionConveyorStatus = 'idle' | 'needFulfillment' | 'readyToProcess';

export interface ActionHistoryRecord {
	action: RichAction;
	reverseAction: RichAction;
}

export interface ActionConveyor {
	history: ActionHistoryRecord[];
	action: RichAction | null;
	draft: RichActionDraft | null;
}

export function useRichActionConveyorHarness(domManipulator: RichDomManipulator | null) {
	const actionConveyorRef = useRef<ActionConveyor>({
		history: [],
		action: null,
		draft: null,
	});
	const actionConveyor = actionConveyorRef.current;
	const actionProcessor = useActionProcessor(domManipulator);
	const [status, setStatus] = useState<ActionConveyorStatus>('idle');

	function moveStatus() {
		if (actionConveyor.draft) {
			setStatus('needFulfillment');
		} else if (actionConveyor.action) {
			setStatus('readyToProcess');
		} else {
			setStatus('idle');
		}
	}

	function discardDraft() {
		if (actionConveyor.draft) {
			actionConveyor.draft = null;
			moveStatus();
		}
	}

	function submitDraft(draft: RichActionDraft) {
		if (doesActionNeedFullfillment(draft)) {
			actionConveyor.draft = draft;
		} else {
			const completedAction = actionProcessor.fulfillDraftAction(draft);
			if (completedAction) {
				actionConveyor.action = completedAction;
			}
		}
		moveStatus();
	}

	function completeDraft(fulfillmentInfo: FulfillmentInfo) {
		if (actionConveyor.draft) {
			const completedAction = actionProcessor.fulfillDraftAction(actionConveyor.draft, fulfillmentInfo);
			if (completedAction) {
				actionConveyor.action = completedAction;
			}
			actionConveyor.draft = null;
			moveStatus();
		}
	}

	function submitAction(action: RichAction) {
		actionConveyor.draft = null;
		actionConveyor.action = action;
		moveStatus();
	}

	function processAction() {
		if (actionConveyor.action) {
			// process action
			const reverseAction = actionProcessor.applyRichAction(actionConveyor.action);
			// write to history
			actionConveyor.history.push({
				action: actionConveyor.action,
				reverseAction,
			});
			// Remember only last 10 actions
			if (actionConveyor.history.length > 10) {
				actionConveyor.history = actionConveyor.history.slice(-10);
			}
			// update action
			actionConveyor.action = null;
			moveStatus();
		}
	};

	function getLastHistoryRecord(): ActionHistoryRecord | null {
		return actionConveyor.history.length > 0 ?
			actionConveyor.history[actionConveyor.history.length - 1]
			: null;
	}

	return {
		status,
		conveyor: actionConveyor,
		discardDraft,
		submitDraft,
		completeDraft,
		submitAction,
		processAction,
		getLastHistoryRecord,
	};
}