import { TodoStatus } from '@/app/_lib/types/todo-types';
import { chooseStatusColorClass } from '@/app/_lib/utils/todo-helpers';
import React from 'react';

import './TodoStatusIndicator.scss';

type TodoStatusIndicatorProps = {
    className?: string;
    status: TodoStatus;
};

const TodoStatusIndicator: React.FC<TodoStatusIndicatorProps> = ({ status, className = "" }) => {

    const statusClass = chooseStatusColorClass(status);

    return (
        <div className={`todoStatusIndicator ${statusClass} ${className}`} />
    );
};

export default TodoStatusIndicator;