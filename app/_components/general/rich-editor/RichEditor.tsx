import { createNewSimpleRichElement, findNearestRichParentElement, findSelectedRichElement, fixSuspiciousElements, isEditorEmpty, serializeRichContent, switchSelectedElement, useManageRichCopy, useManageRichRemoval, useManageRichReplace, useManageRichUndoRemoval } from '@/app/_lib/rich-editor/rich-editor-helpers';
import React, { KeyboardEventHandler, MouseEventHandler, useEffect, useMemo, useRef, useState } from 'react';
import { IconButton } from '../icon-button/IconButton';
import { CANCEL_ICON_URL, HELP_ICON_URL, SAVE_ICON_URL } from '@/app/_lib/constants/image-url-constants';
import { decreaseNumberOfCalls } from '@/app/_lib/utils/function-helpers';
import { detectNativeActions, rewriteDefaultBehaviourForSomeInputs, translateEventToEditorCommand, tryToProcessActionEvent } from '@/app/_lib/rich-editor/event-helpers';
import { EditorCommand } from '@/app/_lib/rich-editor/editor-actions/editor-action-general-types';
import { RichText } from '../rich-text/RichText';
import RichEditorShortkeys from './rich-editor-shortkeys/RichEditorShortkeys';

import './RichEditor.scss';

// const
const TEMP_RICH_EDITOR_CONTENT_KEY = `tempRichEditorContent-${window.location.pathname}`;

type RemovedStackElementType = {
	element: HTMLElement;
	relativeToAnchor: 'before' | 'after' | 'inside';
	anchorElement: HTMLElement;
};

interface RichEditorProps {
	content: string;
	className?: string;
	onSave: (content: string) => Promise<void>;
	onCancel: () => void;
}

export const RichEditor: React.FC<RichEditorProps> = ({ className, content: richContent, onSave, onCancel }) => {

	const [effectiveRichContent, setEffectiveRichContent] = useState(richContent);
	const [isPromptShown, setIsPromptShown] = useState(false);
	const richRemovedStackRef = useRef<RemovedStackElementType[]>([]);

	const selectedElementRef = useRef<HTMLElement | null>(null);
	const richContentContainerRef = React.useRef<HTMLDivElement>(null);

	const reserve = useMemo(() => decreaseNumberOfCalls(() => {
		const content = serializeRichContent(richContentContainerRef.current!!);
		localStorage.setItem(TEMP_RICH_EDITOR_CONTENT_KEY, content);
	}, 1500), [richContentContainerRef]);

	let saveHandler = () => {
		const actualContent = serializeRichContent(richContentContainerRef.current!!);
		onSave(actualContent)
			.then(() => {
				localStorage.removeItem(TEMP_RICH_EDITOR_CONTENT_KEY);
			});
	};

	let cancelHandler = () => {
		localStorage.removeItem(TEMP_RICH_EDITOR_CONTENT_KEY);
		onCancel();
	};

	const changeSelectedElement = useMemo(() => () => {
		const prevSelectedElement = selectedElementRef.current;
		const newSelectedElement = findSelectedRichElement(richContentContainerRef.current!!)?.element ?? null;
		switchSelectedElement(prevSelectedElement, newSelectedElement);
		selectedElementRef.current = newSelectedElement;
	}, []);

	const mouseupHandler: MouseEventHandler = (event) => {
		changeSelectedElement();
	};

	const keyupHandler: KeyboardEventHandler = (event) => {
		const nativeAction = detectNativeActions(event);
		if (nativeAction === 'paste') {
			reserve();
			return;
		}
		// Not interfer with existing command shortkey
		const editorCommand = translateEventToEditorCommand(event);
		console.log("@@@ " + richContentContainerRef.current?.innerHTML);
		// Process selected element indication
		if (
			!editorCommand &&
			(event.code === 'ArrowDown' ||
				event.code === 'ArrowUp' ||
				event.code === 'ArrowRight' ||
				event.code === 'ArrowLeft')
		) {
			changeSelectedElement();
		}
	};

	const keydownHandler: KeyboardEventHandler = (event) => {
		// Process global events like save, cancel and etc.
		const editorCommand = translateEventToEditorCommand(event);
		if (editorCommand) {
			manageEditorCommand(editorCommand);
			return;
		}
		// Process content manipulation actions and get new/changed element
		const actionResult = tryToProcessActionEvent(event, selectedElementRef.current, richContentContainerRef.current!!);
		if (actionResult) {
			if (actionResult.elementInfo) {
				const { name: actionName, elementInfo } = actionResult;
				if (actionName === 'created' && elementInfo.richType === 'link') {
					// Delegate logic to assistance handler
				}
			}
			return;
		}
		const rewriteResult = rewriteDefaultBehaviourForSomeInputs(event);
		if (rewriteResult === 'done') {
			return;
		}
	};

	const manageRichCopy = useManageRichCopy(selectedElementRef);
	const manageRichReplace = useManageRichReplace(selectedElementRef);
	const manageRichRemoval = useManageRichRemoval(selectedElementRef, richRemovedStackRef);
	const manageRichUndoRemoval = useManageRichUndoRemoval(richRemovedStackRef);

	function manageEditorCommand(command: EditorCommand) {
		switch (command.name) {
			case 'save':
				saveHandler();
				break;
			case 'copy':
				manageRichCopy();
				break;
			case 'replace':
				manageRichReplace();
				break;
			case 'delete':
				manageRichRemoval();
				break;
			case 'undoDelete':
				manageRichUndoRemoval();
				break;
			case 'upgradeSelection':
				if (selectedElementRef.current) {
					const selectedElement = selectedElementRef.current;
					const container = richContentContainerRef.current!!;
					const parentInfo = findNearestRichParentElement(selectedElement, container);
					if (parentInfo && parentInfo.element !== container) {
						switchSelectedElement(selectedElement, parentInfo.element);
					}
				}
				break;
			case 'help':
				setIsPromptShown(true);
				break;
			case 'cancel':
				cancelHandler();
				break;
		}
	}

	// onMount
	useEffect(() => {
		// Browser can create inappropriate elements during content edition. Mark such elements.
		if (richContentContainerRef.current) {
			// Options for the observer (which mutations to observe)
			const config = { attributes: true, childList: true, subtree: true };
			// Callback function to execute when mutations are observed
			const callback = (mutations: MutationRecord[], _: MutationObserver) => {
				for (const mutation of mutations) {
					if (mutation.type === 'childList' || mutation.type === 'characterData') {
						mutation.addedNodes.forEach((n) => {
							if (n instanceof HTMLElement) {
								fixSuspiciousElements(n);
								reserve();
							}
						});
					}
				}
			};
			// Create an observer instance linked to the callback function
			const observer = new MutationObserver(callback);
			// Start observing the target node for configured mutations
			observer.observe(richContentContainerRef.current, config);

			// Initialize editor content
			const unpersistedContent = localStorage.getItem(TEMP_RICH_EDITOR_CONTENT_KEY);
			if (unpersistedContent) {
				setEffectiveRichContent(unpersistedContent);
			} else if (isEditorEmpty(richContentContainerRef.current)) {
				// fill with default paragraph
				const paragraphElement = createNewSimpleRichElement('paragraph', 'placeholder');
				richContentContainerRef.current.append(paragraphElement);
			}
			richContentContainerRef.current.focus();
			// Listen for changes and make reserve when it is needed
			richContentContainerRef.current.addEventListener('input', reserve);

			return () => observer.disconnect();
		}
	}, []);

	return (
		<div className={`richEditor column ${className}`}>
			<div className="richEditorMenu">
				<IconButton
					iconUrl={SAVE_ICON_URL}
					onClick={saveHandler} />
				<IconButton
					iconUrl={CANCEL_ICON_URL}
					onClick={cancelHandler} />
				<div className="separator" />
				<IconButton
					iconUrl={HELP_ICON_URL}
					onClick={() => setIsPromptShown(prev => !prev)} />
			</div>
			<div
				className="richEditorBody scrollableInColumn"
				contentEditable={true}
				tabIndex={-1}
				onMouseUp={mouseupHandler}
				onKeyUp={keyupHandler}
				onKeyDown={keydownHandler}
			>
				<RichText
					content={effectiveRichContent}
					ref={richContentContainerRef}
					isEditionMode={true} />
			</div>
			{
				isPromptShown &&
				<RichEditorShortkeys onClose={() => setIsPromptShown(false)} />
			}
		</div >
	);
};
