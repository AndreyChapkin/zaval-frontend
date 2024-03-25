import { SEE_ICON_URL } from '@/app/_lib/constants/image-url-constants';
import { TodoLightDto } from '@/app/_lib/types/todo-types';
import React from 'react';
import { IconButton } from '../../general/icon-button/IconButton';
import TodoStatusIndicator from '../status-indicator/TodoStatusIndicator';
import './PrimitiveCard.scss';
import FlexLine from '../../general/flex-line/FlexLine';
import { PaperContainer } from '../../general/paper-container/PaperContainer';

interface PrimitiveCardProps {
    item: TodoLightDto;
    externalClass?: string;
}

const PrimitiveCard: React.FC<PrimitiveCardProps> = ({ item, externalClass = '' }) => {

    return (
        <PaperContainer lightType='dark-2' className={`primitiveCard ${externalClass} p-1 pr-3`}>
            <FlexLine direction='row' alignItems='center'>
                <a href={`/ui/todo/${item.id}`}>
                    <IconButton className='navigation' size='xSmall' iconUrl={SEE_ICON_URL} />
                </a>
                <TodoStatusIndicator status={item.status} />
                <div className="todoName flex1">
                    {item.name}
                </div>
            </FlexLine>
        </PaperContainer>
    );
};

export default PrimitiveCard;