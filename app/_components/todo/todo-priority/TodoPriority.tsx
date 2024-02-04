import React from 'react';

import './TodoPriority.scss';

interface TodoPriorityProps {
    priority: number;
}

const TodoPriority: React.FC<TodoPriorityProps> = ({ priority }) => {

    let priorityValue: 'low' | 'medium' | 'high';
    let priorityClass: string;
    if (priority < 100) {
        priorityValue = 'low';
        priorityClass = 'lowPriority';
    } else if (priority < 500) {
        priorityValue = 'medium';
        priorityClass = 'mediumPriority';
    } else {
        priorityValue = 'high';
        priorityClass = 'highPriority';
    }

    return (
        <div className={`todoPriority ${priorityClass}`}>
            {priorityValue}
        </div>
    );
};

export default TodoPriority;
