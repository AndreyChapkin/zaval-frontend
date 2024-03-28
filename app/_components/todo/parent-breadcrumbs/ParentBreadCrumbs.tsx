import { TodoLightDto } from '@/app/_lib/types/todo-types';
import React from 'react';
import PrimitiveCard from '../primitive-card/PrimitiveCard';
import FRow from '../../general/flex-line/FRow';

type ParentBreadcrumbsProps = {
    parentTodos: TodoLightDto[];
};

export const ParentBreadcrumbs: React.FC<ParentBreadcrumbsProps> = ({ parentTodos }) => {
    return (
        <FRow className="parentBreadcrumbs" scrollableX squeezableX>
            {
                parentTodos.map((parent) => (
                    <PrimitiveCard item={parent} key={parent.id} />
                ))
            }
        </FRow>
    );
};