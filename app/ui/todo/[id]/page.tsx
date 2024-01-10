'use client';

import { ActionButton } from "@/app/_components/general/action-button/ActionButton";
import CreateTodo from "@/app/_components/todo/create-todo/CreateTodo";
import PrimitiveCard from "@/app/_components/todo/primitive-card/PrimitiveCard";
import { resolveTodoUrl } from "@/app/_lib/calls/resolvers/todo-url-resolvers";
import { getTodoFamily } from "@/app/_lib/calls/todo-calls";
import { TodoFamilyDto } from "@/app/_lib/types/todo";
import { presentDate } from "@/app/_lib/utils/presentation-helpers";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import './page.scss';
import { MOVE_ICON_URL } from "@/app/_lib/constants/image-url-constants";

function TodoItemPage() {

    const params = useParams<{ id: string }>();
    const id = Number(params.id);
    const [todoFamily, setTodoFamily] = useState<TodoFamilyDto>();
    const [isCreatingTodo, setIsCreatingTodo] = useState(false);

    const router = useRouter();

    useEffect(() => {
        getTodoFamily(id).then(setTodoFamily);
    }, []);

    return (
        <div className="page todoItemPage">
            {
                todoFamily ?
                    <>
                        <div className="parents">
                            <img src={MOVE_ICON_URL} alt="move" />
                            {
                                todoFamily.parents.map((parent) => (
                                    <PrimitiveCard item={parent} key={parent.id} />
                                ))
                            }
                        </div>
                        <div className="mainAndChildren">
                            <div className="main">
                                <span>{todoFamily.name}</span>
                                <div className="additionalInfo">
                                    <span>{todoFamily.status}</span>
                                    <span>{presentDate(todoFamily.interactedOn)}</span>
                                </div>
                            </div>
                            {
                                <div className="children">
                                    {
                                        todoFamily.children.length > 0 ?
                                            todoFamily.children.map((child) => (
                                                <PrimitiveCard item={child} key={child.id} />
                                            ))
                                            :
                                            <ActionButton label="Add children" />
                                    }
                                </div>
                            }

                        </div>
                    </>
                    :
                    <button
                        onClick={() => setIsCreatingTodo(true)}>
                        Create todo
                    </button>
            }{
                isCreatingTodo &&
                <CreateTodo
                    cancelHandler={() => setIsCreatingTodo(false)}
                    successHandler={(todo) => {
                        router.push(resolveTodoUrl(todo.id));
                    }} />
            }
        </div>

    );
}

export default TodoItemPage;