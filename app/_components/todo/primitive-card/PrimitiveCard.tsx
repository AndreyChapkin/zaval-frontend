import { TODO_COMPLEX_ICON_URL } from '@/app/_lib/constants/image-url-constants';
import { DetailedTodoDto, TodoLightDto } from '@/app/_lib/types/todo';
import { chooseStatusColorClass } from '@/app/_lib/utils/todo-helpers';
import React from 'react';
import './PrimitiveCard.module.scss';

interface PrimitiveCardProps {
    todo: DetailedTodoDto | TodoLightDto;
    externalClass?: string;
    onSelect?: (todo: DetailedTodoDto | TodoLightDto) => void;
    onView?: (todo: DetailedTodoDto | TodoLightDto) => void;
}

const PrimitiveCard: React.FC<PrimitiveCardProps> = ({ todo, externalClass = '', onSelect, onView }) => {
    const statusClass = chooseStatusColorClass(todo.status);

    const viewHandler = (event: React.MouseEvent) => {
        event.preventDefault();
        if (onView) {
            onView(todo);
        }
    };

    const selectHandler = (event: React.MouseEvent) => {
        if (event.ctrlKey && event.button === 0 && onSelect) {
            onSelect(todo);
        }
    };

    return (
        <div className={`primitiveCard ${externalClass}`} onClick={selectHandler}>
            <div className="goToTodo">
                <a href={`/todo/${todo.id}`} onClick={viewHandler}>
                    <div className="linkArea">
                        <img src={TODO_COMPLEX_ICON_URL} alt="composition" />
                    </div>
                </a>
            </div>
            <div className={`todoStatusIndicator ${statusClass}`} />
            <div className="todoInfo">
                <div className="todoName">
                    {todo.name}
                </div>
            </div>
        </div>
    );
};

export default PrimitiveCard;