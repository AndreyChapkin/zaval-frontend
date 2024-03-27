'use client';

import { getPrioritizedListOfTodosWithStatus, getTheMostDatedLightTodos } from "@/app/_lib/calls/todo-calls";
import { All_TODO_STATUSES, TodoLightDto, TodoStatus, TodosListDto } from "@/app/_lib/types/todo-types";
import { useEffect, useState } from "react";

import { IconButton } from "@/app/_components/general/icon-button/IconButton";
import { ParentBreadcrumbs } from "@/app/_components/todo/parent-breadcrumbs/ParentBreadCrumbs";
import TodoCard from "@/app/_components/todo/todo-card/TodoCard";
import { chooseStatusImgUrl, todoStatusFromUrlForm, todoStatusToUrlForm } from "@/app/_lib/utils/todo-helpers";
import './page.scss';
import { useSearchParams } from "next/navigation";
import RecentTodosCard from "@/app/_components/todo/recent-todos-card/RecentTodosCard";
import { useMobileQuery } from "@/app/_lib/utils/hooks";
import FCol from "@/app/_components/general/flex-line/FCol";
import FRow from "@/app/_components/general/flex-line/FRow";

export default function TodoStatusPage() {

    const p = useSearchParams();
    // const params = window !== undefined ? new URLSearchParams(window.location.search) : {} as any;
    const chosenStatus = (p.get('status') ?? "in-progress") as TodoStatus;
    const [todosListWithStatusDto, setTodosListWithStatusDto] = useState<TodosListDto | null>(null);
    const [recentTodos, setRecentTodos] = useState<TodoLightDto[]>([]);
    const { leafTodos, parentBranchesMap } = todosListWithStatusDto || {};

    const isMobile = useMobileQuery();

    useEffect(() => {
        getPrioritizedListOfTodosWithStatus(todoStatusFromUrlForm(chosenStatus)).then(setTodosListWithStatusDto);
        getTheMostDatedLightTodos(10, 'recent').then(setRecentTodos);
    }, []);

    return (
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
                            <FCol className="todos" squeezableX scrollableY fitChildrenX spacing={3}>
                                {
                                    leafTodos.map(todoAndParentBranchIdDto => (
                                        <FCol fitChildrenX>
                                            <TodoCard
                                                todo={todoAndParentBranchIdDto.leafTodo}
                                            />
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
                !isMobile &&
                <FCol className="recentTodos flex1" squeezableY>
                    <div className="title">
                        Recent
                    </div>
                    <RecentTodosCard todos={recentTodos} />
                </FCol>
            }
        </FRow>

    );
}