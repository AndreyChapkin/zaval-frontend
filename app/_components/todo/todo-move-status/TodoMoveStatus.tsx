import React, { useEffect, useRef } from 'react';
import { ActionButton } from '../../general/action-button/ActionButton';
import { FPaper } from '../../general/paper-container/FPaper';

import { TodoLeafWithBranchIdDto } from '@/app/_lib/types/todo-types';
import FCol from '../../general/flex-line/FCol';
import './TodoMoveStatus.scss';

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
        const todoElement = document.getElementById("todoCard-" + chosenId);
        if (todoElement) {
            todoCardRef.current = todoElement;
        }
    }, [chosenId]);

    useEffect(() => {
        if (todoCardRef.current) {
            console.log("scrolling into view");
            todoCardRef.current.scrollIntoView({block: "center", behavior: "smooth"});
        }
    }, [currentDtos]);

    const handleWheel = (e: WheelEvent) => {
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
    };

    const innerOnSave = async () => {
        if (currentDtos.length > 0) {
            const movedTodo = currentDtos.find(todoAndParentBranchIdDto => todoAndParentBranchIdDto.leafTodo.id === chosenId);
            if (movedTodo) {
                onSave(movedTodo);
            }
        }
    };

    const innerOnCancel = () => {
        onCancel();
    };

    return (
        <FPaper
            direction='column'
            outlineLightType='l-2'
            lightType='none'
            interactive
            secondary
            outline={2}
            alignItems='stretch'
            className="todoMoveStatus p-3 screen-w-20"

        >
            <ActionButton type='standard' label='Save' onClick={innerOnSave} />
            <ActionButton type='standard' label='Cancel' onClick={innerOnCancel} />
            <FCol
                className='flex1'
                alignItems='center'
                justifyContent='center'
                onWheel={handleWheel}
            >
                <p className='mt-10'>Scroll here to move</p>
            </FCol>
        </FPaper>
    );
};

export default TodoMoveStatus;