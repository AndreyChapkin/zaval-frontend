import { CANCEL_ICON_URL, HELP_ICON_URL, SAVE_ICON_URL } from '@/app/_lib/constants/image-url-constants';
import React, { KeyboardEventHandler, MouseEventHandler, useEffect, useMemo, useRef, useState } from 'react';
import { IconButton } from '../icon-button/IconButton';
import RichEditorShortkeys from './rich-editor-shortkeys/RichEditorShortkeys';

import { RichElement } from '@/app/_lib/types/rich-text';
import { decreaseNumberOfCalls, readFromClipboard, writeToClipboard } from '@/app/_lib/utils/function-helpers';
import './RichEditor.scss';
import { useRichActionConveyor } from './lib/rich-action-conveyor';
import { RichDeleteAction, RichReplaceAction, asDeleteAction, asReplaceAction, isReservedShortcut, planRichAction } from './lib/rich-action-processors';
import { EditorCommand, translateEventToEditorCommand } from './lib/rich-command-processors';
import { createRichHTMLElement, removeEmptyRichElements, useRichDomManipulator } from './lib/rich-dom-manipulations';
import { RichEditorFulfillment } from './rich-editor-fulfillment/RichEditorFulfillment';

import "../rich-text/rich-fragments/rich-elements.scss";

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
	const actionConveyor = useRichActionConveyor(manipulator);

	// Handle conveyor status
	useEffect(() => {
		if (actionConveyor.status === 'readyToProcess') {
			actionConveyor.processActions();
		}
	}, [actionConveyor.status]);

	const reserve = useMemo(() => decreaseNumberOfCalls(() => {
		const richHtml = richContentContainerRef.current!!.innerHTML;
		localStorage.setItem(TEMP_RICH_EDITOR_CONTENT_KEY, richHtml);
	}, 1500), [richContentContainerRef]);

	let saveHandler = () => {
		let actualRichElements = manipulator?.extractAllRichElements();
		if (actualRichElements) {
			actualRichElements = removeEmptyRichElements(actualRichElements);
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
			actionConveyor.submitDraft(actionDraft);
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
			case 'replace':
				const replaceAction = await manageRichReplace();
				replaceAction
					&& actionConveyor.submitActions([replaceAction]);
				break;
			case 'delete':
				const removeAction = manageRichRemoval();
				removeAction
					&& actionConveyor.submitActions([removeAction]);
				break;
			case 'undoDelete':
				manageRichUndoRemoval();
				break;
			case 'upgradeSelection':
				manipulator?.selectNearestRichParentOfSelectedElement();
				break;
			case 'help':
				setIsPromptShown(true);
				break;
			case 'cancel':
				onCancel();
				break;
		}
	}

	function manageRichCopy() {
		const selectedContent = manipulator?.extractSelectedElementHtml();
		if (selectedContent) {
			writeToClipboard(selectedContent, 'text/html');
		}
	}

	async function manageRichReplace(): Promise<RichReplaceAction | null> {
		if (manipulator?.selectedElementInfo) {
			const selectedElement = manipulator.selectedElementInfo.element;
			const clipboardElements = await readFromClipboard('text/html') as HTMLElement[];
			if (clipboardElements) {
				return asReplaceAction(selectedElement, clipboardElements);
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
						children: [
							{
								type: 'simple',
								text: 'Placeholder',
							}
						],
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
				<RichEditorShortkeys onClose={() => setIsPromptShown(false)} />
			}
			{
				actionConveyor.status === 'needFulfillment' &&
				<RichEditorFulfillment
					draftAction={actionConveyor.info.draft!!}
					onAccept={info => {
						actionConveyor.completeDraft(info);
					}}
					onCancel={() => actionConveyor.discardDraft()} />
			}
		</div >
	);
};
