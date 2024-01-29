import { useRef, useState } from "react";
import { FulfillmentInfo, RichAction, RichActionDraft, doesActionNeedFullfillment, useActionProcessor } from "./rich-action-processors";
import { RichDomManipulator } from "./rich-dom-manipulations";

export type ActionConveyorStatus = 'idle' | 'needFulfillment' | 'readyToProcess';

export interface ActionConveyor {
	history: RichAction[];
	actions: RichAction[];
	draft: RichActionDraft | null;
}

export function useRichActionConveyor(domManipulator: RichDomManipulator | null) {
	const actionConveyorRef = useRef<ActionConveyor>({
		history: [],
		actions: [],
		draft: null,
	});
	const actionConveyor = actionConveyorRef.current;
	const actionProcessor = useActionProcessor(domManipulator);
	const [status, setStatus] = useState<ActionConveyorStatus>('idle');

	function moveStatus() {
		if (actionConveyor.draft) {
			setStatus('needFulfillment');
		} else if (actionConveyor.actions.length > 0) {
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
				actionConveyor.actions.push(completedAction);
			}
		}
		moveStatus();
	}

	function completeDraft(fulfillmentInfo: FulfillmentInfo) {
		if (actionConveyor.draft) {
			const completedAction = actionProcessor.fulfillDraftAction(actionConveyor.draft, fulfillmentInfo);
			if (completedAction) {
				actionConveyor.actions.push(completedAction);
			}
			actionConveyor.draft = null;
			moveStatus();
		}
	}

	function submitActions(actions: RichAction[]) {
		actionConveyor.actions.push(...actions);
		moveStatus();
	}

	function processActions() {
		if (actionConveyor.actions.length > 0) {
			const actions = actionConveyor.actions;
			// process actions
			for (const action of actions) {
				actionProcessor.applyRichAction(action);
			}
			// write to history
			actionConveyor.history.push(...actions);
			// Remember only last 10 actions
			if (actionConveyor.history.length > 10) {
				actionConveyor.history = actionConveyor.history.slice(-10);
			}
			// update actions
			actionConveyor.actions = [];
			moveStatus();
		}
	};

	return  {
		status,
		info: actionConveyor,
		discardDraft,
		submitDraft,
		completeDraft,
		submitActions,
		processActions,
	};
}