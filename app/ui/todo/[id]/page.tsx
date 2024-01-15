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
import { EDIT_ICON_URL, MOVE_ICON_URL } from "@/app/_lib/constants/image-url-constants";
import { IconButton } from "@/app/_components/general/icon-button/IconButton";
import { RichText } from "@/app/_components/general/rich-text/RichText";
import { RichEditor } from "@/app/_components/general/rich-editor/RichEditor";

function TodoItemPage() {

    const params = useParams<{ id: string }>();
    const id = Number(params.id);
    const [todoFamily, setTodoFamily] = useState<TodoFamilyDto>();
    const [description, setDescription] = useState<string>('');
    const [isCreatingTodo, setIsCreatingTodo] = useState(false);
    const [isEditingTodo, setIsEditingTodo] = useState(false);

    const router = useRouter();

    useEffect(() => {
        getTodoFamily(id).then(setTodoFamily);
    }, []);

    return (
        <div className="page todoItemPage column">
            {/* <div>First</div>
            <div>Second</div>
            <div className="column">
                <div className="">Third-one</div>
                <div className="">Third-two</div>
                <div className="scrollableInColumn">
                    {
                        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 11, 1, 1, 11, 1, 1, 11, 1, 1, 11, 1, 1, 1]
                            .map((_, index) => (
                                <div key={index} style={{ margin: "10px" }}>Long text</div>
                            ))
                    }
                </div>
            </div> */}
            {
                todoFamily ?
                    <>
                        <div className="parents">
                            <IconButton iconUrl={MOVE_ICON_URL} onClick={() => { }} />
                            {
                                todoFamily.parents.map((parent) => (
                                    <PrimitiveCard item={parent} key={parent.id} />
                                ))
                            }
                        </div>
                        <div className="mainAndChildren row">
                            <div className="main column">
                                <span className="mainInfo">{todoFamily.name}</span>
                                <div className="additionalInfo">
                                    <span>{todoFamily.status}</span>
                                    <span>{presentDate(todoFamily.interactedOn)}</span>
                                </div>
                                {
                                    isEditingTodo ?
                                        <RichEditor
                                            content={todoFamily.description}
                                            onSave={(content) => Promise.resolve()}
                                            onCancel={() => { setIsEditingTodo(false) }} />
                                        :
                                        <>
                                            <div className="editionMenu">
                                                <IconButton iconUrl={EDIT_ICON_URL} onClick={() => setIsEditingTodo(true)} />
                                            </div>
                                            <RichText content={todoFamily.description} />
                                        </>
                                }
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