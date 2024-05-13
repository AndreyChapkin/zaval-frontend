'use client';

import { getPrioritizedListOfTodosWithStatus, getTheMostDatedLightTodos, updateTodo } from "@/app/_lib/calls/todo-calls";
import { All_TODO_STATUSES, TodoLeafWithBranchIdDto, TodoLightDto, TodoStatus, TodosListDto } from "@/app/_lib/types/todo-types";
import { useCallback, useEffect, useState } from "react";

import FCol from "@/app/_components/general/flex-line/FCol";
import FRow from "@/app/_components/general/flex-line/FRow";
import { IconButton } from "@/app/_components/general/icon-button/IconButton";
import { ParentBreadcrumbs } from "@/app/_components/todo/parent-breadcrumbs/ParentBreadCrumbs";
import RecentTodosCard from "@/app/_components/todo/recent-todos-card/RecentTodosCard";
import TodoCard from "@/app/_components/todo/todo-card/TodoCard";
import TodoMoveStatus, { generateTodoCardId } from "@/app/_components/todo/todo-move-status/TodoMoveStatus";
import { SEE_ICON_URL, TWO_VERTICAL_ARROWS_ICON_URL } from "@/app/_lib/constants/image-url-constants";
import { useMobileQuery } from "@/app/_lib/utils/hooks";
import { chooseStatusImgUrl, todoStatusFromUrlForm, todoStatusToUrlForm } from "@/app/_lib/utils/todo-helpers";
import { useSearchParams } from "next/navigation";
import './page.scss';

export default function TodoStatusPage() {

    const searchParams = useSearchParams();
    const chosenStatus = (searchParams.get('status') ?? "in-progress") as TodoStatus;
    const [todosListWithStatusDto, setTodosListWithStatusDto] = useState<TodosListDto | null>(null);
    const { parentBranchesMap } = todosListWithStatusDto || {};
    const [recentTodos, setRecentTodos] = useState<TodoLightDto[]>([]);
    const [leafTodos, setLeafTodos] = useState<TodoLeafWithBranchIdDto[]>([]);

    const [reorderableId, setReorderableId] = useState<number | null>(null);
    const isMobile = useMobileQuery();

    useEffect(() => {
        getPrioritizedListOfTodosWithStatus(todoStatusFromUrlForm(chosenStatus)).then(setTodosListWithStatusDto);
        getTheMostDatedLightTodos(10, 'recent').then(setRecentTodos);
    }, []);

    const deepCloneOfLeafTodos = useCallback(() => {
        const str = JSON.stringify(todosListWithStatusDto?.leafTodos || []);
        return JSON.parse(str) as TodoLeafWithBranchIdDto[];
    }, [todosListWithStatusDto]);

    useEffect(() => {
        if (todosListWithStatusDto) {
            setLeafTodos(deepCloneOfLeafTodos());
        }
    }, [todosListWithStatusDto]);

    return (
        <>
            <FRow className="pageContainer todoStatusPage" squeezableX fitChildrenY spacing={4}>
                <FCol className="statusedTodos flex2" squeezableX fitChildrenX>
                    <FRow className="statusSwitcher">
                        {
                            All_TODO_STATUSES.map(status => {
                                const urlStatus = todoStatusToUrlForm(status);
                                return (
                                    <a key={status} href={`/ui/todo/status?status=${urlStatus}`}>
                                        <IconButton
                                            className={`${chosenStatus === urlStatus ? 'chosenStatus' : ''}`}
                                            iconUrl={chooseStatusImgUrl(status)} />
                                    </a>
                                );
                            })
                        }
                    </FRow>
                    {
                        leafTodos && parentBranchesMap ?
                            leafTodos.length > 0 ?
                                <FCol className="todos pr-2" squeezableX scrollableY fitChildrenX spacing={3}>
                                    {
                                        leafTodos.map(todoAndParentBranchIdDto => (
                                            <FCol
                                                fitChildrenX
                                                id={generateTodoCardId(todoAndParentBranchIdDto.leafTodo.id)}
                                                key={todoAndParentBranchIdDto.leafTodo.id}
                                            >
                                                <FRow>
                                                    <TodoCard
                                                        todo={todoAndParentBranchIdDto.leafTodo}
                                                        selected={reorderableId === todoAndParentBranchIdDto.leafTodo.id}
                                                        className="flex1"
                                                    />
                                                    {
                                                        reorderableId === null &&
                                                        <IconButton
                                                            size='medium'
                                                            iconUrl={TWO_VERTICAL_ARROWS_ICON_URL}
                                                            onClick={() => setReorderableId(todoAndParentBranchIdDto.leafTodo.id)} />
                                                    }
                                                </FRow>
                                                {
                                                    todoAndParentBranchIdDto.parentBranchId != null
                                                    &&
                                                    <ParentBreadcrumbs parentTodos={parentBranchesMap[todoAndParentBranchIdDto.parentBranchId].toReversed()} />
                                                }
                                            </FCol>
                                        ))
                                    }
                                </FCol>
                                :
                                <div className="noTodos">
                                    No todos
                                </div>
                            :
                            <div className="loading">
                                Loading...
                            </div>
                    }
                </FCol>
                {
                    reorderableId !== null &&
                    <TodoMoveStatus
                        chosenId={reorderableId}
                        currentDtos={leafTodos}
                        onReorder={(dtos) => setLeafTodos(dtos)}
                        onSave={async (dto) => {
                            await updateTodo(reorderableId, {
                                general: {
                                    priority: dto.leafTodo.priority,
                                    name: dto.leafTodo.name,
                                    status: dto.leafTodo.status
                                }
                            });
                            setReorderableId(null);
                        }}
                        onCancel={() => {
                            setLeafTodos(deepCloneOfLeafTodos());
                            setReorderableId(null);
                        }} />
                }
                {
                    !isMobile &&
                    <FCol className="recentTodos flex1" squeezableY>
                        <RecentTodosCard todos={recentTodos} />
                    </FCol>
                }
            </FRow>
        </>
    );
}