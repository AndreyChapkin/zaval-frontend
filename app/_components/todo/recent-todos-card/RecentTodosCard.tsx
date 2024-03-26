'use client';

import { getTheMostDatedLightTodos } from '@/app/_lib/calls/todo-calls';
import { TodoLightDto } from '@/app/_lib/types/todo-types';
import React, { useEffect, useState } from 'react';
import FlexLine from '../../general/flex-line/FlexLine';
import LoadingIndicator from '../../general/loading-indicator/LoadingIndicator';
import TodoCard from '../todo-card/TodoCard';
import { FPaper } from '../../general/paper-container/FPaper';

type Props = {
    todos?: TodoLightDto[];
    className?: string;
};

const RecentTodosCard: React.FC<Props> = ({ todos }) => {

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
            lightType='dark-2'
            direction='column'
            className="recentTodosList scrollableInLine p-3"
            spacing={2}
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