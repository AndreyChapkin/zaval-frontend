import { findTodosWithNameFragment, moveTodo, updateTodo } from '@/app/_lib/calls/todo-calls';
import { CHOOSE_ICON_URL } from '@/app/_lib/constants/image-url-constants';
import { TodoLightDto } from '@/app/_lib/types/todo-types';
import { decreaseNumberOfCalls } from '@/app/_lib/utils/function-helpers';
import React, { useEffect, useMemo, useState } from 'react';
import { ActionButton } from '../../general/action-button/ActionButton';
import { IconButton } from '../../general/icon-button/IconButton';
import LoadingIndicator from '../../general/loading-indicator/LoadingIndicator';
import { ModalWindow } from '../../general/modal-window/ModalWindow';
import { StandardInput } from '../../general/standard-input/StandardInput';
import TodoPriority from '../todo-priority/TodoPriority';
import { TodoStatusSelect } from '../todo-status-select/TodoStatusSelect';

import FCol from '../../general/flex-line/FCol';
import FLine from '../../general/flex-line/FLine';
import './EditTodoModal.scss';
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
        <ModalWindow
            width={80}
            height={80}
            direction='column'
            alignItems='stretch'
            onClose={onClose}
            spacing={0}
        >
            <FPaper lightType='dark-1' direction='column' spacing={3} alignItems='stretch' className='p-2'>
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
                <FLine scrollableX direction='row' className='controlPanel shrink0'>
                    <ActionButton label="Save" onClick={onSaveWrapper} />
                    <ActionButton label='Cancel' onClick={onClose} />
                </FLine>
            </FPaper>
            <MoveTodo todo={todo} />
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
        <FLine direction='column' className='p-2' alignItems='stretch' squeezeY>
            <FLine direction='row' className="controlPanel" alignItems='center' spacing={3}>
                <ActionButton label="To root" onClick={toRootHandler} />
                <StandardInput
                    className='flex1'
                    value={searchValue}
                    onChange={(value) => setSearchValue(value)} />
            </FLine>
            {
                isLoading ?
                    <LoadingIndicator />
                    :
                    <FLine scrollableY direction='column' className="foundTodo" spacing={2}>
                        {
                            foundTodos.map((todo) => (
                                <MoveTodoCard
                                    key={todo.id}
                                    todo={todo}
                                    onSelect={selectHandler}
                                />
                            ))
                        }
                    </FLine>
            }
        </FLine>
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
        <FLine direction='row' alignItems='center' className='editPriority'>
            <label className='mr-2'>Priority</label>
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
        </FLine>
    );
};

export const MoveTodoCard: React.FC<{ todo: TodoLightDto, onSelect: (todo: TodoLightDto) => void }> = ({
    todo,
    onSelect
}) => {
    return (
        <FPaper direction='row' className="moveTodoCard p-1" spacing={2} alignItems='center'>
            <div className="todoName">
                {todo.name}
            </div>
            <IconButton iconUrl={CHOOSE_ICON_URL} onClick={() => onSelect(todo)} />
        </FPaper>
    );
};