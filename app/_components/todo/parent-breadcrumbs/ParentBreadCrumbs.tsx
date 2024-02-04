import { TodoLightDto } from '@/app/_lib/types/todo-types';
import React from 'react';
import PrimitiveCard from '../primitive-card/PrimitiveCard';

type ParentBreadcrumbsProps = {
    parentTodos: TodoLightDto[];
};

export const ParentBreadcrumbs: React.FC<ParentBreadcrumbsProps> = ({ parentTodos }) => {
    return (
        <div className="parentBreadcrumbs rowStartAndCenter gap1 scrollableInColumnHorizontally">
            {
                parentTodos.map((parent) => (
                    <PrimitiveCard item={parent} key={parent.id} />
                ))
            }
        </div>
    );
};