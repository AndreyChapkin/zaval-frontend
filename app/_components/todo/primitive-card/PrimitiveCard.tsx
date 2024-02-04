import { SEE_ICON_URL } from '@/app/_lib/constants/image-url-constants';
import { TodoLightDto } from '@/app/_lib/types/todo-types';
import React from 'react';
import { IconButton } from '../../general/icon-button/IconButton';
import TodoStatusIndicator from '../status-indicator/TodoStatusIndicator';
import './PrimitiveCard.scss';

interface PrimitiveCardProps {
    item: TodoLightDto;
    externalClass?: string;
}

const PrimitiveCard: React.FC<PrimitiveCardProps> = ({ item, externalClass = '' }) => {

    return (
        <div className={`primitiveCard ${externalClass} rowStartAndCenter gap1`}>
            <a href={`/ui/todo/${item.id}`}>
                <IconButton size='small' iconUrl={SEE_ICON_URL} />
            </a>
            <TodoStatusIndicator status={item.status} />
            <div className="todoName flex1">
                {item.name}
            </div>
        </div>
    );
};

export default PrimitiveCard;