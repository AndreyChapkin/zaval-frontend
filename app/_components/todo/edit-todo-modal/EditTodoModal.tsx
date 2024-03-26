import { findTodosWithNameFragment, moveTodo, updateTodo } from '@/app/_lib/calls/todo-calls';
import { TodoLightDto } from '@/app/_lib/types/todo-types';
import { decreaseNumberOfCalls } from '@/app/_lib/utils/function-helpers';
import React, { useEffect, useMemo, useState } from 'react';
import { ActionButton } from '../../general/action-button/ActionButton';
import LoadingIndicator from '../../general/loading-indicator/LoadingIndicator';
import { ModalWindow } from '../../general/modal-window/ModalWindow';
import { TodoStatusSelect } from '../todo-status-select/TodoStatusSelect';
import { StandardInput } from '../../general/standard-input/StandardInput';
import TodoPriority from '../todo-priority/TodoPriority';
import { IconButton } from '../../general/icon-button/IconButton';
import { CHOOSE_ICON_URL } from '@/app/_lib/constants/image-url-constants';

import './EditTodoModal.scss';
import { StandardLabel } from '../../general/standard-label/StandardLabel';
import FCol from '../../general/flex-line/FCol';
import { FPaper } from '../../general/paper-container/FPaper';

export type EditTodoModalProps = {
    todo: TodoLightDto;
    onSave: (todo: TodoLightDto) => void;
    onClose: () => void;
};

export const EditTodoModal: React.FC<EditTodoModalProps> = ({ todo, onSave, onClose }) => {

    const [editStatus, setEditStatus] = useState(todo.status);
    const [editName, setEditName] = useState(todo.name);
    const [editPriority, setEditPriority] = useState(todo.priority);

    const onSaveWrapper = async () => {
        const updatedTodo = await updateTodo(todo.id, {
            general: {
                name: editName,
                status: editStatus,
                priority: editPriority
            },
        });
        onSave(updatedTodo);
    };

    return (
        <ModalWindow width={80} height={80} onClose={onClose}>
            <FCol alignItems='stretch' className='p-4 flex1'>
                <FCol spacing={3} alignItems='stretch'>
                    <TodoStatusSelect
                        currentStatus={editStatus}
                        onSelect={(status) => setEditStatus(status)}
                    />
                    <StandardInput
                        className='editName'
                        value={editName}
                        onChange={(value) => setEditName(value)} />
                    <EditPriority
                        priority={editPriority}
                        onChange={(value) => setEditPriority(value)} />
                </FCol>
                <div className='controlPanel row gap1 my-2'>
                    <ActionButton label="Save" onClick={onSaveWrapper} />
                    <ActionButton label='Cancel' onClick={onClose} />
                </div>
                <MoveTodo todo={todo} className='flex1' />
            </FCol>
        </ModalWindow>
    );
};

export type MoveTodoProps = {
    todo: TodoLightDto;
    className?: string;
};

export const MoveTodo: React.FC<MoveTodoProps> = ({ todo, className = "" }) => {

    const [searchValue, setSearchValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [foundTodos, setFoundTodos] = useState<TodoLightDto[]>([]);

    const toRootHandler = async () => {
        await moveTodo({
            todoId: todo.id,
            parentId: null,
        });
        location.href = `/ui/todo/${todo.id}`;
    };

    const selectHandler = async (parentTodo: TodoLightDto) => {
        await moveTodo({
            todoId: todo.id,
            parentId: parentTodo.id
        });
        location.href = `/ui/todo/${parentTodo.id}`;
    };

    const searchTodos = useMemo(() => decreaseNumberOfCalls((value: string) => {
        setIsLoading(true);
        findTodosWithNameFragment(value).then((data) => {
            setIsLoading(false);
            setFoundTodos(data);
        });
    }, 500), []);

    useEffect(() => {
        if (searchValue) {
            searchTodos(searchValue);
        }
    }, [searchValue]);

    return (
        <FPaper direction='column' alignItems='stretch' lightType='dark-3' className={`moveTodo ${className} p-3`}>
            <div className="controlPanel row gap2">
                <ActionButton label="To root" onClick={toRootHandler} />
                <StandardInput
                    className='flex1'
                    value={searchValue}
                    onChange={(value) => setSearchValue(value)} />
            </div>
            {
                isLoading ?
                    <LoadingIndicator />
                    :
                    <FCol className="foundTodo scrollableInLine" spacing={6}>
                        {
                            foundTodos.map((todo) => (
                                <MoveTodoCard
                                    key={todo.id}
                                    todo={todo}
                                    onSelect={selectHandler}
                                />
                            ))
                        }
                    </FCol>
            }
        </FPaper>
    );
};

export type EditPriorityProps = {
    priority: number;
    onChange: (value: number) => void;
};

export const EditPriority: React.FC<EditPriorityProps> = ({ priority, onChange }) => {

    const setNewPriorityStr = (newPriorityStr: string) => {
        let parsedPriority = parseInt(newPriorityStr);
        parsedPriority = isNaN(parsedPriority) ? 0 : parsedPriority;
        onChange(parsedPriority);
    };

    const setNewPriority = (newPriority: number, delta: number) => {
        const resultPriority = Math.max(0, newPriority + delta);
        onChange(resultPriority);
    };

    return (
        <StandardLabel label='Priority' labelPosition='left'>
            <div className='editPriority rowStartAndCenter gap2'>
                <StandardInput
                    value={String(priority)}
                    onChange={(value) => setNewPriorityStr(value)} />
                <ActionButton
                    label="+"
                    type='standard'
                    onClick={() => setNewPriority(priority, 200)} />
                <ActionButton
                    label="-"
                    type='standard'
                    onClick={() => setNewPriority(priority, -100)} />

                <TodoPriority priority={priority} />
            </div>
        </StandardLabel>
    );
};

export const MoveTodoCard: React.FC<{ todo: TodoLightDto, onSelect: (todo: TodoLightDto) => void }> = ({
    todo,
    onSelect
}) => {
    return (
        <div className="moveTodoCard rowStartAndCenter gap1">
            <div className="todoName">
                {todo.name}
            </div>
            <IconButton iconUrl={CHOOSE_ICON_URL} onClick={() => onSelect(todo)} />
        </div>
    );
};