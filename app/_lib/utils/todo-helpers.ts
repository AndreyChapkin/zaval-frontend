import { BACKLOG_MENU_ICON_URL, DONE_MENU_ICON_URL, IN_PROGRESS_MENU_ICON_URL, NEXT_TO_TAKE_MENU_ICON_URL, PING_ME_MENU_ICON_URL, TODO_STATUS_IN_PROGRESS_ICON_URL, TODO_STATUS_NEED_ATTENTION_ICON_URL, TODO_STATUS_ON_HOLD_ICON_URL, WILL_BE_BACK_MENU_ICON_URL } from "../constants/image-url-constants";
import { TodoStatus } from "../types/todo";

// helpers
export function statusImageUrl(status: TodoStatus): string {
	switch (status) {
		case 'IN_PROGRESS':
			return TODO_STATUS_IN_PROGRESS_ICON_URL;
		case 'BACKLOG':
			return TODO_STATUS_NEED_ATTENTION_ICON_URL;
		default:
			return TODO_STATUS_ON_HOLD_ICON_URL;
	}
}

export function todoStatusFromUrlForm(value: string): TodoStatus {
	return value.replaceAll('-', '_').toUpperCase() as TodoStatus;
}

export function todoStatusToUrlForm(status: TodoStatus): TodoStatus {
	return status.replaceAll('_', '-').toLowerCase() as TodoStatus;
}

export function todoStatusToLabel(status: TodoStatus): string {
	return status.replaceAll('_', ' ');
}

export function chooseStatusImgUrl(status: TodoStatus): string {
	switch (status) {
		case 'DONE':
			return DONE_MENU_ICON_URL;
		case 'BACKLOG':
			return BACKLOG_MENU_ICON_URL;
		case 'WILL_BE_BACK':
			return WILL_BE_BACK_MENU_ICON_URL;
		case 'PING_ME':
			return PING_ME_MENU_ICON_URL;
		case 'NEXT_TO_TAKE':
			return NEXT_TO_TAKE_MENU_ICON_URL;
		case 'IN_PROGRESS':
			return IN_PROGRESS_MENU_ICON_URL;
	}
}

export function chooseStatusClass(status: TodoStatus): string {
	switch (status) {
		case 'DONE':
			return 'done-status';
		case 'BACKLOG':
			return 'backlog-status';
		case 'WILL_BE_BACK':
			return 'will-be-back-status';
		case 'PING_ME':
			return 'ping-me-status';
		case 'NEXT_TO_TAKE':
			return 'next-to-take-status';
		case 'IN_PROGRESS':
			return 'in-progress-status';
	}
}

export function chooseStatusColorClass(status: TodoStatus): string {
	switch (status) {
		case 'DONE':
			return 'done-status-color';
		case 'BACKLOG':
			return 'backlog-status-color';
		case 'WILL_BE_BACK':
			return 'will-be-back-status-color';
		case 'PING_ME':
			return 'ping-me-status-color';
		case 'NEXT_TO_TAKE':
			return 'next-to-take-status-color';
		case 'IN_PROGRESS':
			return 'in-progress-status-color';
	}
}
