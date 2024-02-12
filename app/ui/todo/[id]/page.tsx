'use client';

import { ActionButton } from "@/app/_components/general/action-button/ActionButton";
import PrimitiveCard from "@/app/_components/todo/primitive-card/PrimitiveCard";
import { deleteTodo, getLightTodo, getTodoFamily, updateTodo } from "@/app/_lib/calls/todo-calls";
import { TodoFamilyDto, TodoLightDto } from "@/app/_lib/types/todo-types";
import { presentDate } from "@/app/_lib/utils/presentation-helpers";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { IconButton } from "@/app/_components/general/icon-button/IconButton";
import { RemoveModal } from "@/app/_components/general/remove-modal/RemoveModal";
import { RichEditor } from "@/app/_components/general/rich-editor/RichEditor";
import { RichText } from "@/app/_components/general/rich-text/RichText";
import CreateTodo from "@/app/_components/todo/create-todo-modal/CreateTodoModal";
import { EditTodoModal } from "@/app/_components/todo/edit-todo-modal/EditTodoModal";
import { ParentBreadcrumbs } from "@/app/_components/todo/parent-breadcrumbs/ParentBreadCrumbs";
import TodoStatusIndicator from "@/app/_components/todo/status-indicator/TodoStatusIndicator";
import TodoPriority from "@/app/_components/todo/todo-priority/TodoPriority";
import { EDIT_ICON_URL, REMOVE_ICON_URL } from "@/app/_lib/constants/image-url-constants";
import './page.scss';

function TodoItemPage() {

    const params = useParams<{ id: string }>();
    const id = Number(params.id);
    const [todoFamily, setTodoFamily] = useState<TodoFamilyDto | null>(null);
    const [isEditDescription, setIsEditDescription] = useState(false);
    const [isEditMenuOpen, setIsEditMenuOpen] = useState(false);
    const [isRemoveOpen, setIsRemoveOpen] = useState(false);
    const [todoLightDto, setTodoLightDto] = useState<TodoLightDto | null>();
    const [isCreatChild, setIsCreateChild] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [areDoneChildrenShown, setAreDoneChildrenShown] = useState(false);
    const todoChildren = useMemo(() => {
        const rawChildren = (
            areDoneChildrenShown ?
                todoFamily?.children
                : todoFamily?.children.filter(child => child.status !== "DONE")
        ) ?? [];
        // descending order
        return rawChildren.toSorted((a, b) => b.priority - a.priority);
    }, [todoFamily, areDoneChildrenShown]);

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
                        <div className="mainAndChildren row gap4 flex1">
                            <div className="main column gap1">
                                <div className="mainGeneral row gap3">
                                    <div className="informationPanel flex1 column gap1">
                                        <div className="namePanel scrollableInColumn">
                                            {todoFamily.name}
                                        </div>
                                        <div className="additionalPanel rowJustify">
                                            <div className="additionalInfo rowStartAndCenter gap2">
                                                <TodoStatusIndicator status={todoFamily.status} />
                                                <span>{presentDate(todoFamily.interactedOn)}</span>
                                                <TodoPriority priority={todoFamily.priority} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="controlPanel columnJustifyAndCenter">
                                        <IconButton iconUrl={REMOVE_ICON_URL} onClick={() => setIsRemoveOpen(true)} />
                                        <IconButton iconUrl={EDIT_ICON_URL} onClick={() => setIsEditMenuOpen(true)} />
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
                                                <RichText richContent={todoFamily.description} />
                                                <IconButton iconUrl={EDIT_ICON_URL} onClick={() => setIsEditDescription(true)} />
                                            </>
                                    }
                                </div>
                            </div>
                            <div className="children column gap4">
                                <div className="controlPanel row gap2">
                                    <ActionButton label="Add children" onClick={() => setIsCreateChild(true)} />
                                    <ActionButton
                                        type="standard"
                                        label={areDoneChildrenShown ? "Hide done" : "Show done"}
                                        onClick={() => setAreDoneChildrenShown(!areDoneChildrenShown)} />
                                </div>
                                <div className="columnStartAndStretch gap2">
                                    {
                                        todoChildren.map((child) => (
                                            <PrimitiveCard item={child} key={child.id} />
                                        ))
                                    }
                                </div>
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