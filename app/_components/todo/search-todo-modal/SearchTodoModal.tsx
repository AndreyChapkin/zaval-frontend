import React, { useEffect, useMemo, useState } from 'react';
import { ModalWindow } from '../../general/modal-window/ModalWindow';
import { StandardInput } from '../../general/standard-input/StandardInput';
import LoadingIndicator from '../../general/loading-indicator/LoadingIndicator';
import { decreaseNumberOfCalls } from '@/app/_lib/utils/function-helpers';
import { findTodosWithNameFragment } from '@/app/_lib/calls/todo-calls';
import { TodoLightDto } from '@/app/_lib/types/todo-types';

import './SearchTodoModal.scss';
import TodoCard from '../todo-card/TodoCard';

type SearchTodoModalProps = {
    onClose: () => void;
};

export const SearchTodoModal: React.FC<SearchTodoModalProps> = ({ onClose }) => {

    const [searchValue, setSearchValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [foundTodos, setFoundTodos] = useState<TodoLightDto[]>([]);

    const searchTodos = useMemo(() => decreaseNumberOfCalls((value: string) => {
        if (value) {
            setIsLoading(true);
            findTodosWithNameFragment(value).then((data) => {
                setIsLoading(false);
                setFoundTodos(data);
            });
        } else {
            setFoundTodos([]);
        }
    }, 500), []);

    useEffect(() => {
        searchTodos(searchValue);
    }, [searchValue]);

    return (
        <ModalWindow onClose={onClose}>
            <div className="searchTodoModal columnStartAndStretch gap2">
                <StandardInput
                    autofocus
                    value={searchValue}
                    onChange={setSearchValue}
                />
                {
                    isLoading ?
                        <LoadingIndicator />
                        :
                        <div className="foundTodos column scrollableInColumn gap2">
                            {
                                foundTodos.map((todo) => {
                                    return (
                                        <TodoCard key={todo.id} todo={todo} />
                                    );
                                })
                            }
                        </div>
                }
            </div>
        </ModalWindow>
    );
};