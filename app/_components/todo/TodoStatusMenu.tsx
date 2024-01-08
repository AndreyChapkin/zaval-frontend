import { All_TODO_STATUSES, TodoStatus } from "@/app/_lib/types/todo";
import { chooseStatusColorClass, chooseStatusImgUrl, todoStatusToLabel } from "@/app/_lib/utils/todo-helpers";
import { MouseEventHandler, useCallback, useState } from "react";

export interface TodoMenuProps {
    currentStatus?: TodoStatus;
    selectHandler: (todoStatus: TodoStatus) => void;
}

export function TodoStatusMenu({ currentStatus = 'BACKLOG', selectHandler }: TodoMenuProps) {

    const otherStatuses = All_TODO_STATUSES.filter((i) => i !== currentStatus);
    const [isOpen, setIsOpen] = useState(false);
    const [optionsY, setOptionsY] = useState(0);

    const openHandler: MouseEventHandler = useCallback((e) => {
        const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
        setOptionsY(rect.bottom + window.scrollY);
        setIsOpen(prev => !prev);
    }, []);

    const innerSelectHandler = useCallback((status: TodoStatus) => () => {
        setIsOpen(false);
        selectHandler(status);
    }, [selectHandler]);

    return (
        <div className="todo-status-menu">
            <div
                onClick={openHandler}
                className={`current-status ${chooseStatusColorClass(currentStatus)}`}
            >
                <img
                    src={chooseStatusImgUrl(currentStatus)}
                    alt="img"
                />
                <span>{todoStatusToLabel(currentStatus)}</span>
            </div>
            {isOpen && (
                <div
                    className="options-pane"
                    style={{ top: `${optionsY}px` }}
                >
                    {otherStatuses.map((status) => (
                        <div
                            className={`option-status ${chooseStatusColorClass(status)}`}
                            onClick={() => innerSelectHandler(status)}
                            key={status}
                        >
                            <img
                                src={chooseStatusImgUrl(status)}
                                alt="img"
                            />
                            {todoStatusToLabel(status)}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}