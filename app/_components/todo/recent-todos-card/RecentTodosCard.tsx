'use client';

import { getTheMostDatedLightTodos } from '@/app/_lib/calls/todo-calls';
import { TodoLightDto } from '@/app/_lib/types/todo-types';
import React, { useEffect, useState } from 'react';
import LoadingIndicator from '../../general/loading-indicator/LoadingIndicator';
import { FPaper } from '../../general/paper-container/FPaper';
import TodoCard from '../todo-card/TodoCard';

type Props = {
    todos?: TodoLightDto[];
    className?: string;
};

const RecentTodosCard: React.FC<Props> = ({ todos, className }) => {

    const [recentTodos, setRecentTodos] = useState<TodoLightDto[]>(todos ?? []);
    const [isLoading, setIsLoading] = useState(!todos);

    // fetch todos if not provided
    useEffect(() => {
        if (!todos) {
            setIsLoading(true);
            getTheMostDatedLightTodos(10, 'recent')
                .then((dtos) => {
                    setRecentTodos(dtos);
                    setIsLoading(false);
                });
        }
    }, []);

    useEffect(() => {
        setRecentTodos(todos ?? []);
    }, [todos]);

    return (
        <FPaper
            lightType='d-3'
            direction='column'
            className={`recentTodosList ${className} p-3`}
            spacing={5}
            scrollableY
            alignItems='stretch'>
            {
                isLoading ?
                    <LoadingIndicator />
                    :
                    recentTodos && recentTodos.map(todo => (
                        <TodoCard key={todo.id} todo={todo} />
                    ))
            }
        </FPaper>
    );
};

export default RecentTodosCard;