import { SEE_ICON_URL } from '@/app/_lib/constants/image-url-constants';
import { TodoLightDto } from '@/app/_lib/types/todo-types';
import React from 'react';
import { IconButton } from '../../general/icon-button/IconButton';
import { FPaper } from '../../general/paper-container/FPaper';
import TodoStatusIndicator from '../status-indicator/TodoStatusIndicator';
import './PrimitiveCard.scss';

interface PrimitiveCardProps {
    item: TodoLightDto;
    externalClass?: string;
}

const PrimitiveCard: React.FC<PrimitiveCardProps> = ({ item, externalClass = '' }) => {

    return (
        <FPaper className='primitiveCard px-2' direction='row' lightType='d-2' alignItems='center'>
            <a href={`/ui/todo/${item.id}`}>
                <IconButton className='navigation' size='xSmall' iconUrl={SEE_ICON_URL} />
            </a>
            <TodoStatusIndicator status={item.status} />
            <div className="todoName flex1">
                {item.name}
            </div>
        </FPaper>
    );
};

export default PrimitiveCard;