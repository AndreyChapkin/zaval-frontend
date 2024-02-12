import { CANCEL_ICON_URL, HELP_ICON_URL, SAVE_ICON_URL } from '@/app/_lib/constants/image-url-constants';
import React, { KeyboardEventHandler, MouseEventHandler, useEffect, useMemo, useRef, useState } from 'react';
import { IconButton } from '../icon-button/IconButton';
import RichEditorPrompt from './rich-editor-shortkeys/RichEditorPrompt';

import { RichElement, RichType } from '@/app/_lib/types/rich-text-types';
import { decreaseNumberOfCalls, readFromClipboard, writeToClipboard } from '@/app/_lib/utils/function-helpers';
import './RichEditor.scss';
import { useRichActionConveyorHarness } from './lib/rich-action-conveyor';
import { RichCreateAction, RichDeleteAction, RichReplaceAction, asCreateAction, asDeleteAction, asReplaceAction, getNodeFromTouchedNodeInfo, isReservedShortcut, planRichAction } from './lib/rich-action-processors';
import { EditorCommand, translateEventToEditorCommand } from './lib/rich-command-processors';
import { createRichHTMLElement, createTextNode, mergeAdjacentTextElements, removeEmptyRichElements, useRichDomManipulator } from './lib/rich-dom-manipulations';
import { RichEditorFulfillment } from './rich-editor-fulfillment/RichEditorFulfillment';

import "../rich-text/rich-fragments/rich-elements.scss";
import { SelectionInfo, findSelectionInfo, selectTextInNode, splitSelectedTextWithCursor, splitTextWithSelectionInfo } from './lib/dom-selections';

interface RichEditorProps {
	richContent: string;
	className?: string;
	onSave: (content: string) => Promise<void>;
	onCancel: () => void;
}

export const RichEditor: React.FC<RichEditorProps> = ({ className, richContent, onSave, onCancel }) => {

	// const
	const TEMP_RICH_EDITOR_CONTENT_KEY = `tempRichEditorContent-${window.location.pathname}`;

	const [isPromptShown, setIsPromptShown] = useState(false);
	const richContentContainerRef = useRef<HTMLDivElement>(null);
	const manipulator = useRichDomManipulator(richContentContainerRef);
	const conveyorHarness = useRichActionConveyorHarness(manipulator);
	const selectionInfoRef = useRef<SelectionInfo | null>(null);
	const showFulfillment = conveyorHarness.status === 'needFulfillment';

	// before render changes
	if (showFulfillment) {
		selectionInfoRef.current = findSelectionInfo();
	}

	// Handle conveyor status
	useEffect(() => {
		if (conveyorHarness.status === 'readyToProcess') {
			// check if trying to create a link element
			const createAction = conveyorHarness.conveyor.action?.name === 'create' ?
				conveyorHarness.conveyor.action as RichCreateAction
				: null;
			const ifCreateLinkAction = !!createAction?.payload?.newElements?.find(element => element.type === 'link');
			// split current selected text node
			if (ifCreateLinkAction) {
				const createLinkAction = createAction as RichCreateAction;
				const linkElement = createLinkAction.payload.newElements[0];
				if (linkElement.type === 'link' && selectionInfoRef.current) {
					const splitInfo = splitTextWithSelectionInfo(selectionInfoRef.current);
					if (splitInfo && (splitInfo.firstText || splitInfo.secondText)) {
						const newElements: ChildNode[] = [];
						if (splitInfo.firstText) {
							newElements.push(splitInfo.firstText);
						}
						newElements.push(createTextNode(' '));
						newElements.push(linkElement.element);
						newElements.push(createTextNode(' '));
						if (splitInfo.secondText) {
							newElements.push(splitInfo.secondText);
						}
						const replaceAction: RichReplaceAction = asReplaceAction(
							[splitInfo.selectedText],
							newElements,
						);
						conveyorHarness.submitAction(replaceAction);
					}
				}
			}
			conveyorHarness.processAction();
		}
	}, [conveyorHarness.status]);

	useEffect(() => {
		// select text in new created node
		if (conveyorHarness.status === 'idle') {
			if (selectionInfoRef.current) {
				const lastHistoryRecord = conveyorHarness.getLastHistoryRecord();
				if (lastHistoryRecord) {
					if (lastHistoryRecord.action.name === 'create') {
						const newElements = lastHistoryRecord.action.payload.newElements;
						const lastNewNode = getNodeFromTouchedNodeInfo(newElements[newElements.length - 1]);
						if (lastNewNode) {
							console.log("@@@ create lastNewNode", lastNewNode)
							selectTextInNode(lastNewNode);
						}
					} else if (lastHistoryRecord.action.name === 'replace') {
						const newElements = lastHistoryRecord.action.payload.newElements;
						if (newElements) {
							console.log("@@@ replace newElements", newElements)
							selectTextInNode(newElements[newElements.length - 1], null, null, 'start');
						}
					}
					
				}
			}
		}
	}, [conveyorHarness.status]);

	const reserve = useMemo(() => decreaseNumberOfCalls(() => {
		const richHtml = richContentContainerRef.current!!.innerHTML;
		localStorage.setItem(TEMP_RICH_EDITOR_CONTENT_KEY, richHtml);
	}, 1500), [richContentContainerRef]);

	let saveHandler = () => {
		let actualRichElements = manipulator?.extractAllRichElements();
		if (actualRichElements) {
			actualRichElements = removeEmptyRichElements(actualRichElements);
			mergeAdjacentTextElements(actualRichElements);
		}
		onSave(JSON.stringify(actualRichElements))
			.then(() => {
				localStorage.removeItem(TEMP_RICH_EDITOR_CONTENT_KEY);
			});
	};

	let cancelHandler = () => {
		localStorage.removeItem(TEMP_RICH_EDITOR_CONTENT_KEY);
		onCancel();
	};

	const mouseupHandler: MouseEventHandler = (event) => {
		const selectedElementInfo = manipulator?.findSelectedRichElement();
		if (selectedElementInfo) {
			manipulator?.setAsSelectedElement(selectedElementInfo.element, selectedElementInfo.richType);
		}
	};

	const keyupHandler: KeyboardEventHandler<HTMLElement> = (event) => {
		// Process selected element indication
		if (!isReservedShortcut(event)) {
			if (event.code === 'ArrowDown' ||
				event.code === 'ArrowUp' ||
				event.code === 'ArrowRight' ||
				event.code === 'ArrowLeft') {
				const selectedElementInfo = manipulator?.findSelectedRichElement();
				if (selectedElementInfo) {
					manipulator?.setAsSelectedElement(selectedElementInfo.element, selectedElementInfo.richType);
				}
			}
		}
		// reserve content
		reserve();
	};

	let keydownHandler: KeyboardEventHandler<HTMLElement> = (event) => {
		// Process global editor commands
		const command = translateEventToEditorCommand(event);
		if (command) {
			manageEditorCommand(command);
			return;
		}
		// Process content manipulation actions
		const actionDraft = planRichAction(event);
		if (actionDraft) {
			conveyorHarness.submitDraft(actionDraft);
			return;
		}
	};

	let manageEditorCommand = async (command: EditorCommand) => {
		switch (command.name) {
			case 'save':
				saveHandler();
				break;
			case 'copy':
				manageRichCopy();
				break;
			case 'paste':
				const createAction = await manageRichPaste();
				createAction
					&& conveyorHarness.submitAction(createAction);
				break;
			case 'replace':
				const replaceAction = await manageRichReplace();
				replaceAction
					&& conveyorHarness.submitAction(replaceAction);
				break;
			case 'delete':
				const removeAction = manageRichRemoval();
				removeAction
					&& conveyorHarness.submitAction(removeAction);
				break;
			case 'undoDelete':
				manageRichUndoRemoval();
				break;
			case 'upgradeSelection':
				manageSelectionUpgrade();
				break;
			case 'help':
				setIsPromptShown(true);
				break;
			case 'cancel':
				onCancel();
				break;
		}
	}

	function manageSelectionUpgrade() {
		const selectedElement = manipulator?.selectedElementInfo?.element;
		if (selectedElement) {
			const richParentInfo = manipulator?.findNearestRichElement(selectedElement);
			if (richParentInfo && richParentInfo.type !== 'container') {
				manipulator?.setAsSelectedElement(richParentInfo.element, richParentInfo.type);
			}
		}
	}

	function manageRichCopy() {
		const selectedContent = manipulator?.extractSelectedElementHtml();
		if (selectedContent) {
			writeToClipboard(selectedContent, 'text/html');
		}
	}

	async function manageRichPaste() {
		if (manipulator?.selectedElementInfo) {
			const selectedElement = manipulator.selectedElementInfo.element;
			const clipboardElements = await readFromClipboard('text/html') as HTMLElement[];
			if (clipboardElements) {
				return asCreateAction(clipboardElements, {
					element: selectedElement,
					position: 'after',
				});
			}
		}
		return null;
	}

	async function manageRichReplace(): Promise<RichReplaceAction | null> {
		if (manipulator?.selectedElementInfo) {
			const selectedElement = manipulator.selectedElementInfo.element;
			const clipboardElements = await readFromClipboard('text/html') as HTMLElement[];
			if (clipboardElements) {
				return asReplaceAction([selectedElement], clipboardElements);
			}
		}
		return null;
	}

	function manageRichRemoval(): RichDeleteAction | null {
		if (manipulator?.selectedElementInfo) {
			const selectedElement = manipulator.selectedElementInfo.element;
			return asDeleteAction(selectedElement);
		}
		return null;
	}

	function manageRichUndoRemoval() {
		// TODO: implement
	}

	// read persisted content
	const richContentHtml = useMemo(() => {
		const storedRichContentHtml = localStorage.getItem(TEMP_RICH_EDITOR_CONTENT_KEY);
		if (storedRichContentHtml) {
			return storedRichContentHtml;
		}
		return "";
	}, []);

	// update rich content
	useEffect(() => {
		const container = richContentContainerRef.current!!;
		container.innerHTML = "";	// clear previous content to escape conflicts
		if (richContentHtml) {
			container.innerHTML = richContentHtml;
		} else {
			let richElements: RichElement[] = richContent && JSON.parse(richContent) || [];
			// default content
			if (richElements.length < 1) {
				richElements = [
					{
						type: 'paragraph',
						textFragments: ['Placeholder'],
					},
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
					onClick={() => setIsPromptShown(true)} />
			</div>
			<div
				onMouseUp={mouseupHandler}
				onKeyUp={keyupHandler}
				onKeyDown={keydownHandler}
				ref={richContentContainerRef}
				className="richEditorBody scrollableInColumn"
				contentEditable={true}
			/>
			{
				isPromptShown &&
				<RichEditorPrompt onClose={() => setIsPromptShown(false)} />
			}
			{
				showFulfillment &&
				<RichEditorFulfillment
					draftAction={conveyorHarness.conveyor.draft!!}
					onAccept={info => {
						conveyorHarness.completeDraft(info);
					}}
					onCancel={() => conveyorHarness.discardDraft()} />
			}
		</div >
	);
};
