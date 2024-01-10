import { All_TODO_STATUSES, TodoStatus } from "@/app/_lib/types/todo";
import { chooseStatusColorClass, chooseStatusImgUrl, todoStatusToLabel } from "@/app/_lib/utils/todo-helpers";
import { MouseEventHandler, useCallback, useState } from "react";

import './TodoStatusSelect.scss';

export interface TodoMenuProps {
    currentStatus?: TodoStatus;
    selectHandler: (todoStatus: TodoStatus) => void;
}

export function TodoStatusSelect({ currentStatus = 'BACKLOG', selectHandler }: TodoMenuProps) {

    const otherStatuses = All_TODO_STATUSES.filter((i) => i !== currentStatus);
    const [isOpen, setIsOpen] = useState(false);
    const [optionsY, setOptionsY] = useState(0);

    const openHandler: MouseEventHandler = useCallback((e) => {
        const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
        setOptionsY(rect.bottom + window.scrollY);
        setIsOpen(prev => !prev);
    }, []);

    const innerSelectHandler = useCallback((status: TodoStatus) => {
        console.log('@@@ hello from innerSelectHandler');
        setIsOpen(false);
        selectHandler(status);
    }, [selectHandler]);

    return (
        <div className="todoStatusSelect">
            <div
                onClick={openHandler}
                className={`currentStatus ${chooseStatusColorClass(currentStatus)}`}
            >
                <img
                    src={chooseStatusImgUrl(currentStatus)}
                    alt="img"
                />
                <span>{todoStatusToLabel(currentStatus)}</span>
            </div>
            {isOpen && (
                <div
                    className="optionsPane"
                    style={{ top: `${optionsY}px` }}
                >
                    {otherStatuses.map((status) => (
                        <div
                            className={`optionStatus ${chooseStatusColorClass(status)}`}
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