'use client';

import { ActionButton } from "@/app/_components/general/action-button/ActionButton";
import PrimitiveCard from "@/app/_components/todo/primitive-card/PrimitiveCard";
import { deleteTodo, getLightTodo, getTodoFamily, updateTodo } from "@/app/_lib/calls/todo-calls";
import { TodoFamilyDto, TodoLightDto } from "@/app/_lib/types/todo-types";
import { presentDate } from "@/app/_lib/utils/presentation-helpers";
import { redirect, useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { IconButton } from "@/app/_components/general/icon-button/IconButton";
import { RichEditor } from "@/app/_components/general/rich-editor/RichEditor";
import { RichText } from "@/app/_components/general/rich-text/RichText";
import { EditTodoModal } from "@/app/_components/todo/edit-todo-modal/EditTodoModal";
import TodoStatusIndicator from "@/app/_components/todo/status-indicator/TodoStatusIndicator";
import { EDIT_ICON_URL, REMOVE_ICON_URL } from "@/app/_lib/constants/image-url-constants";
import './page.scss';
import TodoPriority from "@/app/_components/todo/todo-priority/TodoPriority";
import { ParentBreadcrumbs } from "@/app/_components/todo/parent-breadcrumbs/ParentBreadCrumbs";
import { RemoveModal } from "@/app/_components/general/remove-modal/RemoveModal";
import CreateTodo from "@/app/_components/todo/create-todo-modal/CreateTodoModal";

function TodoItemPage() {

    const params = useParams<{ id: string }>();
    const id = Number(params.id);
    const [todoFamily, setTodoFamily] = useState<TodoFamilyDto | null>();
    const descriptionElements = useMemo(() => {
        return todoFamily?.description ? JSON.parse(todoFamily.description) : [];
    }, [todoFamily]);
    const [isEditDescription, setIsEditDescription] = useState(false);
    const [isEditMenuOpen, setIsEditMenuOpen] = useState(false);
    const [isRemoveOpen, setIsRemoveOpen] = useState(false);
    const [todoLightDto, setTodoLightDto] = useState<TodoLightDto | null>();
    const [isCreatChild, setIsCreateChild] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const removeHandler = () => {
        const parentId = todoFamily?.parents[0]?.id;
        const redirectUrl = parentId ? `/ui/todo/${parentId}` : '/ui/todo/status';
        deleteTodo(id).then(() => window.location.href = redirectUrl);
    };

    useEffect(() => {
        getTodoFamily(id).then(setTodoFamily);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (isEditMenuOpen) {
            getLightTodo(id).then(setTodoLightDto);
        }
    }, [todoFamily?.id, isEditMenuOpen]);

    return (
        <div className="page todoItemPage columnStart gap1">
            {
                todoFamily ?
                    <>
                        <ParentBreadcrumbs parentTodos={todoFamily.parents} />
                        <div className="mainAndChildren row gap2 flex1">
                            <div className="main column gap1">
                                <div className="mainGeneral column gap1">
                                    <div className="namePanel scrollableInColumn">
                                        {todoFamily.name}
                                    </div>
                                    <div className="additionalPanel rowJustify">
                                        <div className="additionalInfo rowStartAndCenter gap2">
                                            <TodoStatusIndicator status={todoFamily.status} />
                                            <span>{presentDate(todoFamily.interactedOn)}</span>
                                            <TodoPriority priority={todoFamily.priority} />
                                        </div>
                                        <div className="controlPanel rowStartAndStart gap4">
                                            <IconButton iconUrl={EDIT_ICON_URL} onClick={() => setIsEditMenuOpen(true)} />
                                            <IconButton iconUrl={REMOVE_ICON_URL} onClick={() => setIsRemoveOpen(true)} />
                                        </div>
                                    </div>
                                </div>
                                <div className="discriptionPanel rowStartAndStretch">
                                    {
                                        isEditDescription ?
                                            <RichEditor
                                                className="flex1"
                                                richContent={todoFamily.description ?? ''}
                                                onSave={
                                                    (content) => updateTodo(id, { description: content })
                                                        .then(() => window.location.reload())
                                                }
                                                onCancel={() => setIsEditDescription(false)} />
                                            :
                                            <>
                                                <IconButton iconUrl={EDIT_ICON_URL} onClick={() => setIsEditDescription(true)} />
                                                <RichText richElements={descriptionElements} />
                                            </>
                                    }
                                </div>
                            </div>
                            <div className="children column gap1">
                                <ActionButton label="Add children" onClick={() => setIsCreateChild(true)} />
                                {
                                    todoFamily.children.length > 0
                                    &&
                                    todoFamily.children.map((child) => (
                                        <PrimitiveCard item={child} key={child.id} />
                                    ))
                                }
                            </div>
                        </div>
                    </>
                    :
                    isLoading ?
                        "Loading..."
                        :
                        "No such todo"
            }
            {isEditMenuOpen && todoLightDto && (
                <EditTodoModal
                    todo={todoLightDto}
                    onSave={() => window.location.reload()}
                    onClose={() => setIsEditMenuOpen(false)} />
            )}
            {
                isRemoveOpen &&
                <RemoveModal onAccept={removeHandler} onCancel={() => setIsRemoveOpen(false)} />
            }
            {
                isCreatChild &&
                <CreateTodo
                    onSuccess={() => window.location.reload()}
                    parentId={id}
                    onCancel={() => setIsCreateChild(false)} />
            }
        </div>
    );
}

export default TodoItemPage;