'use client';

import { getPrioritizedListOfTodosWithStatus } from "@/app/_lib/calls/todo-calls";
import { All_TODO_STATUSES, TodoStatus } from "@/app/_lib/types/todo-types";
import { useEffect, useState } from "react";

import { IconButton } from "@/app/_components/general/icon-button/IconButton";
import PrimitiveCard from "@/app/_components/todo/primitive-card/PrimitiveCard";
import TodoCard from "@/app/_components/todo/todo-card/TodoCard";
import { TodosListDto } from "@/app/_lib/types/pages-data-types";
import { chooseStatusImgUrl, todoStatusFromUrlForm, todoStatusToUrlForm } from "@/app/_lib/utils/todo-helpers";
import './page.scss';
import { ParentBreadcrumbs } from "@/app/_components/todo/parent-breadcrumbs/ParentBreadCrumbs";

export default function TodoStatusPage() {

    const params = new URLSearchParams(window.location.search);
    const chosenStatus = (params.get('status') ?? "in-progress") as TodoStatus;
    const [todosListWithStatusDto, setTodosListWithStatusDto] = useState<TodosListDto | null>(null);
    const { leafTodos, parentBranchesMap } = todosListWithStatusDto || {};

    useEffect(() => {
        getPrioritizedListOfTodosWithStatus(todoStatusFromUrlForm(chosenStatus)).then(setTodosListWithStatusDto);
    }, []);

    return (
        <div className="page todoStatusPage column">
            <div className="statusSwitcher row">
                {
                    All_TODO_STATUSES.map(status => {
                        const urlStatus = todoStatusToUrlForm(status);
                        return (
                            <a href={`/ui/todo/status?status=${urlStatus}`}>
                                <IconButton
                                    className={`${chosenStatus === urlStatus ? 'chosenStatus' : ''}`}
                                    iconUrl={chooseStatusImgUrl(status)} />
                            </a>
                        );
                    })
                }
            </div>
            {
                leafTodos && parentBranchesMap ?
                    leafTodos.length > 0 ?
                        <div className="todos column scrollableInColumn">
                            {
                                leafTodos.map(todoAndParentBranchIdDto => (
                                    <div className="todoAndParents">
                                        <TodoCard
                                            todo={todoAndParentBranchIdDto.leafTodo}
                                        />
                                        {
                                            todoAndParentBranchIdDto.parentBranchId != null
                                            &&
                                            <ParentBreadcrumbs parentTodos={parentBranchesMap[todoAndParentBranchIdDto.parentBranchId].toReversed()} />
                                        }
                                    </div>
                                ))
                            }
                        </div>
                        :
                        <div className="noTodos">
                            No todos
                        </div>
                    :
                    <div className="loading">
                        Loading...
                    </div>
            }
        </div >

    );
}