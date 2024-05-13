import React, { useCallback, useEffect, useRef } from 'react';
import { FPaper } from '../../general/paper-container/FPaper';

import { TodoLeafWithBranchIdDto } from '@/app/_lib/types/todo-types';
import './TodoMoveStatus.scss';

export function generateTodoCardId(todoId: number) {
    return "todoCard-" + todoId;
}

interface TodoMoveStatusProps {
    currentDtos: TodoLeafWithBranchIdDto[];
    chosenId: number;
    onReorder: (dtos: TodoLeafWithBranchIdDto[]) => void;
    onSave: (dto: TodoLeafWithBranchIdDto) => void;
    onCancel: () => void;
}

const TodoMoveStatus: React.FC<TodoMoveStatusProps> = ({
    currentDtos,
    chosenId,
    onReorder,
    onSave,
    onCancel
}) => {

    const todoCardRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const todoElement = document.getElementById(generateTodoCardId(chosenId));
        if (todoElement) {
            todoCardRef.current = todoElement;
        }
    }, [chosenId]);

    useEffect(() => {
        if (todoCardRef.current) {
            todoCardRef.current.scrollIntoView({ block: "center", behavior: "smooth" });
        }
    }, [currentDtos]);

    const handleWheel = useCallback((e: WheelEvent) => {
        if (currentDtos.length > 0) {
            const currentTodoIndex = currentDtos.findIndex(todo => todo.leafTodo.id === chosenId) as number;
            const currentTodo = currentDtos[currentTodoIndex];
            let swapWithTodoIndex = currentTodoIndex;
            let priorityChangeDirection: 'increase' | 'decrease' = 'increase';
            if (e.deltaY > 0) {
                // Handle scroll down
                if (currentTodoIndex < currentDtos.length - 1) {
                    swapWithTodoIndex = currentTodoIndex + 1;
                    priorityChangeDirection = 'decrease';
                }
            } else {
                // Handle scroll up
                if (currentTodoIndex > 0) {
                    swapWithTodoIndex = currentTodoIndex - 1;
                }
            }
            if (swapWithTodoIndex != currentTodoIndex) {
                // Swap todos
                const swapWithTodo = currentDtos[swapWithTodoIndex];
                let newPriority = priorityChangeDirection === 'increase'
                    ? swapWithTodo.leafTodo.priority + 10
                    : swapWithTodo.leafTodo.priority - 10;
                newPriority = Math.max(0, newPriority);
                currentDtos[currentTodoIndex] = swapWithTodo;
                currentDtos[swapWithTodoIndex] = currentTodo;
                // change priority of currentTodo
                currentTodo.leafTodo.priority = newPriority;
                onReorder([...currentDtos]);
            }
        }
    }, [currentDtos, chosenId, onReorder]);

    const handleClick = useCallback(async (e: MouseEvent) => {
        if (e.button === 0) {
            // if left button is clicked
            if (currentDtos.length > 0) {
                const movedTodo = currentDtos.find(todoAndParentBranchIdDto => todoAndParentBranchIdDto.leafTodo.id === chosenId);
                if (movedTodo) {
                    onSave(movedTodo);
                }
            }
        } else if (e.button === 2) {
            // right button is clicked
            onCancel();
            // to cancel the context menu with right click
            // need to disable context menu for the whole document
            // because component is unmounted before mouseup event
            const globalPreventContextMenu = (e: MouseEvent) => {
                e.preventDefault();
                document.body.removeEventListener('contextmenu', globalPreventContextMenu);
            };
            document.body.addEventListener('contextmenu', globalPreventContextMenu);
        }
    }, [currentDtos, chosenId, onSave, onCancel]);

    return (
        <FPaper
            direction='column'
            outlineLightType='l-2'
            lightType='none'
            interactive
            secondary
            outline={2}
            alignItems='center'
            justifyContent='center'
            className="todoMoveStatus p-3 screen-w-20"
            onMouseUp={handleClick}
            // onMouseDown={preventContextMenu}
            onWheel={handleWheel}
        >
            <p>Scroll here to move</p>
            <p>Left button = save</p>
            <p>Right button = cancel</p>
        </FPaper>
    );
};

export default TodoMoveStatus;