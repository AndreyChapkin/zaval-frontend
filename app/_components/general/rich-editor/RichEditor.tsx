import { CANCEL_ICON_URL, HELP_ICON_URL, SAVE_ICON_URL } from '@/app/_lib/constants/image-url-constants';
import React, { KeyboardEventHandler, MouseEventHandler, useEffect, useMemo } from 'react';
import { IconButton } from '../icon-button/IconButton';
import RichEditorShortkeys from './rich-editor-shortkeys/RichEditorShortkeys';

import { RichElement } from '@/app/_lib/types/rich-text';
import './RichEditor.scss';
import { doesActionNeedFullfillment, isReservedShortcut, planRichAction, useActionProcessor } from './lib/rich-action-processors';
import { createRichHTMLElement, useRichDomManipulator } from './lib/rich-dom-manipulations';
import { toActionApplyingState, toActionFillingState, toNativeEditionState, toPromptShowingState, toWaitingForActionFillingState, useRichEditorStateManager } from './lib/rich-editor-state';
import { RichEditorFulfillment } from './rich-editor-fulfillment/RichEditorFulfillment';

// const
const TEMP_RICH_EDITOR_CONTENT_KEY = `tempRichEditorContent-${window.location.pathname}`;

interface RichEditorProps {
	richContent: string;
	className?: string;
	onSave: (content: string) => Promise<void>;
	onCancel: () => void;
}

export const RichEditor: React.FC<RichEditorProps> = ({ className, richContent, onSave, onCancel }) => {

	const richContentContainerRef = React.useRef<HTMLDivElement>(null);
	const { currentState, previousState, switchToState, switchToPreviousState } = useRichEditorStateManager(toNativeEditionState());
	const manipulator = useRichDomManipulator(richContentContainerRef);
	const actionProcessor = useActionProcessor(manipulator);

	// Handle editor state transitions
	useEffect(() => {
		switch (currentState.name) {
			case 'actionFilling':
				if (previousState?.name === 'waitingForActionFilling') {
					const action = actionProcessor.fulfillDraftAction(previousState.draftAction, currentState.fulfillmentInfo);
					if (action) {
						// Switch to next state
						switchToState(toActionApplyingState([action]));
					}
				}
				break;
			case 'actionApplying':
				// process current state
				for (let action of currentState.actions) {
					actionProcessor.applyRichAction(action);
				}
				// Switch to next state
				switchToState(toNativeEditionState());
				break;
		}
	}, [currentState]);


	// const reserve = useMemo(() => decreaseNumberOfCalls(() => {
	// 	const content = serializeRichContent(richContentContainerRef.current!!);
	// 	localStorage.setItem(TEMP_RICH_EDITOR_CONTENT_KEY, content);
	// }, 1500), [richContentContainerRef]);

	let saveHandler = () => {
		// const actualContent = serializeRichContent(richContentContainerRef.current!!);
		// onSave(actualContent)
		// 	.then(() => {
		// 		localStorage.removeItem(TEMP_RICH_EDITOR_CONTENT_KEY);
		// 	});
	};

	let cancelHandler = () => {
		// localStorage.removeItem(TEMP_RICH_EDITOR_CONTENT_KEY);
		// onCancel();
	};

	const mouseupHandler: MouseEventHandler = (event) => {
		manipulator?.findSelectedRichElement();
	};

	const keyupHandler: KeyboardEventHandler<HTMLElement> = (event) => {
		// Process selected element indication
		if (!isReservedShortcut(event)) {
			if (event.code === 'ArrowDown' ||
				event.code === 'ArrowUp' ||
				event.code === 'ArrowRight' ||
				event.code === 'ArrowLeft') {
				manipulator?.findSelectedRichElement();
			}
		}
	};

	let keydownHandler: KeyboardEventHandler<HTMLElement> = (event) => {
		// Process global editor commands
		// TODO: process
		// Process content manipulation actions
		const actionDraft = planRichAction(event);
		if (actionDraft) {
			if (doesActionNeedFullfillment(actionDraft)) {
				switchToState(toWaitingForActionFillingState(actionDraft));
			} else {
				const action = actionProcessor.fulfillDraftAction(actionDraft);
				if (action) {
					switchToState(toActionApplyingState([action]));
				}
			}
		}
	};

	const richContentHtml = useMemo(() => {
		const storedRichContentHtml = localStorage.getItem(TEMP_RICH_EDITOR_CONTENT_KEY);
		if (storedRichContentHtml) {
			return storedRichContentHtml;
		}
		return "";
	}, []);

	useEffect(() => {
		const container = richContentContainerRef.current!!;
		container.innerHTML = "";	// clear previous content to escape conflicts
		if (richContentHtml) {
			container.innerHTML = richContentHtml;
		} else {
			let richElements: RichElement[] = richContent && JSON.parse(richContent) || [];
			if (richElements.length < 1) {
				richElements = [
					{
						type: 'simple',
						text: "Placeholder",
					}
				];
			}
			const richHtmlElements = richElements.map(createRichHTMLElement);
			container.append(...richHtmlElements);
		}
	}, []);

	return (
		<div className={`richEditor column ${className}`}>
			<div className="richEditorMenu rowStartAndCenter">
				<IconButton
					iconUrl={SAVE_ICON_URL}
					onClick={saveHandler} />
				<IconButton
					iconUrl={CANCEL_ICON_URL}
					onClick={cancelHandler} />
				<div className="separator" />
				<IconButton
					iconUrl={HELP_ICON_URL}
					onClick={() => switchToState(toPromptShowingState())} />
			</div>
			<div
				onMouseUp={mouseupHandler}
				onKeyUp={keyupHandler}
				onKeyDown={keydownHandler}
				ref={richContentContainerRef}
				className="richEditorBody scrollableInColumn"
				contentEditable={true}
			// dangerouslySetInnerHTML={{ __html: richContentHtml }}
			/>
			{
				currentState.name === 'promptShowing' &&
				<RichEditorShortkeys onClose={() => switchToPreviousState()} />
			}
			{
				currentState.name === 'waitingForActionFilling' &&
				<RichEditorFulfillment
					draftAction={currentState.draftAction}
					onAccept={info => {
						switchToState(toActionFillingState(info))
					}}
					onCancel={() => switchToPreviousState()} />
			}
		</div >
	);
};
