import { TODO_COMPLEX_ICON_URL } from '@/app/_lib/constants/image-url-constants';
import { TodoLightDto } from '@/app/_lib/types/todo';
import { chooseStatusColorClass } from '@/app/_lib/utils/todo-helpers';
import React from 'react';
import './PrimitiveCard.scss';

interface PrimitiveCardProps {
    item: TodoLightDto;
    externalClass?: string;
    onSelect?: (todo: TodoLightDto) => void;
    onView?: (todo: TodoLightDto) => void;
}

const PrimitiveCard: React.FC<PrimitiveCardProps> = ({ item, externalClass = '', onSelect, onView }) => {
    const statusClass = chooseStatusColorClass(item.status);

    const viewHandler = (event: React.MouseEvent) => {
        event.preventDefault();
        if (onView) {
            onView(item);
        }
    };

    const selectHandler = (event: React.MouseEvent) => {
        if (event.ctrlKey && event.button === 0 && onSelect) {
            onSelect(item);
        }
    };

    return (
        <div className={`primitiveCard ${externalClass}`} onClick={selectHandler}>
            <div className="goToTodo">
                <a href={`/todo/${item.id}`} onClick={viewHandler}>
                    <div className="linkArea">
                        <img src={TODO_COMPLEX_ICON_URL} alt="composition" />
                    </div>
                </a>
            </div>
            <div className={`todoStatusIndicator ${statusClass}`} />
            <div className="todoInfo">
                <div className="todoName">
                    {item.name}
                </div>
            </div>
        </div>
    );
};

export default PrimitiveCard;