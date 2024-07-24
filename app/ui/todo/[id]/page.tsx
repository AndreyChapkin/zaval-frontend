'use client';

import { ActionButton } from "@/app/_components/general/action-button/ActionButton";
import PrimitiveCard from "@/app/_components/todo/primitive-card/PrimitiveCard";
import { deleteTodo, getLightTodo, getTodoFamily, openObsidianNoteForTodo, updateTodo } from "@/app/_lib/calls/todo-calls";
import { TodoFamilyDto, TodoLightDto } from "@/app/_lib/types/todo-types";
import { presentDate } from "@/app/_lib/utils/presentation-helpers";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import FCol from "@/app/_components/general/flex-line/FCol";
import FlexLine from "@/app/_components/general/flex-line/FlexLine";
import FRow from "@/app/_components/general/flex-line/FRow";
import { IconButton } from "@/app/_components/general/icon-button/IconButton";
import { ModalWindow } from "@/app/_components/general/modal-window/ModalWindow";
import { PaperContainer } from "@/app/_components/general/paper-container/PaperContainer";
import { RemoveModal } from "@/app/_components/general/remove-modal/RemoveModal";
import CreateTodo from "@/app/_components/todo/create-todo-modal/CreateTodoModal";
import { EditTodoModal } from "@/app/_components/todo/edit-todo-modal/EditTodoModal";
import { ParentBreadcrumbs } from "@/app/_components/todo/parent-breadcrumbs/ParentBreadCrumbs";
import TodoStatusIndicator from "@/app/_components/todo/status-indicator/TodoStatusIndicator";
import TodoDescriptionEditor from "@/app/_components/todo/todo-description-editor/TodoDescriptionEditor";
import TodoPriority from "@/app/_components/todo/todo-priority/TodoPriority";
import { EDIT_ICON_URL, OBSIDIAN_ICON_URL, REMOVE_ICON_URL } from "@/app/_lib/constants/image-url-constants";
import { useMobileQuery, useParentSender } from "@/app/_lib/utils/hooks";
import './page.scss';
import { RichText } from "@/app/_components/general/rich-text/RichText";

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
    const [description, setDescription] = useState("");

    const todoChildren = useMemo(() => {
        const rawChildren = (
            areDoneChildrenShown ?
                todoFamily?.children
                : todoFamily?.children?.filter(child => child.status !== "DONE")
        ) ?? [];
        // descending order
        return rawChildren.toSorted((a, b) => b.priority - a.priority);
    }, [todoFamily, areDoneChildrenShown]);

    const hasDoneChildren = useMemo(() => {
        return todoFamily?.children.some(child => child.status === "DONE") || false;
    }, [todoFamily]);

    const [areChildrenShown, setAreChildrenShown] = useState(false);

    // use media query to change layout
    const isMobile = useMobileQuery();

    // send extension window current open todo url
    const sender = useParentSender<{ todoPageUrl: string }>('todoPageOpened');

    useEffect(() => {
        sender({ todoPageUrl: window.location.href });
    }, [window.location.href]);

    // update description
    useEffect(() => {
        setDescription(todoFamily?.description || "");
    }, [todoFamily]);

    const removeHandler = () => {
        const parentId = todoFamily?.parents[0]?.id;
        const redirectUrl = parentId ? `/ui/todo/${parentId}` : '/ui/todo/status';
        deleteTodo(id).then(() => window.location.href = redirectUrl);
    };

    const openObsidianHandler = useCallback(() => {
        if (todoFamily) {
            let currentUrl = window.location.href;
            openObsidianNoteForTodo(todoFamily.id, { uiPageUrl: currentUrl });
        }
    }, [todoFamily]);

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
        <FlexLine direction="column" justifyContent="start" alignItems="stretch" className="pageContainer todoItemPage">
            {
                todoFamily ?
                    <>
                        <ParentBreadcrumbs parentTodos={todoFamily.parents} />
                        <FlexLine direction={isMobile ? "column" : "row"} hasScrollable className="mainAndChildren flex1" spacing={4}>
                            <FlexLine direction="column" alignItems="stretch" className="main flex2" spacing={2}>
                                <PaperContainer lightType="dark-2" className="todoItemContainer p-2">
                                    <FlexLine direction="row" className="mainGeneral flex1" alignItems="stretch">
                                        <FlexLine direction="column" className="informationPanel flex1" spacing={2}>
                                            <div className="namePanel scrollableInLine">
                                                {todoFamily.name}
                                            </div>
                                            <FlexLine direction="row" className="additionalPanel">
                                                <FlexLine direction="row" className="additionalInfo" alignItems="center" spacing={2}>
                                                    <TodoStatusIndicator status={todoFamily.status} />
                                                    <span>{presentDate(todoFamily.interactedOn)}</span>
                                                    <TodoPriority priority={todoFamily.priority} />
                                                </FlexLine>
                                            </FlexLine>
                                        </FlexLine>
                                        <FlexLine direction="column" className="controlPanel" justifyContent="between" alignItems="center">
                                            <IconButton iconUrl={REMOVE_ICON_URL} onClick={() => setIsRemoveOpen(true)} />
                                            <div className="separator" />
                                            <IconButton iconUrl={EDIT_ICON_URL} onClick={() => setIsEditMenuOpen(true)} />
                                            <IconButton iconUrl={OBSIDIAN_ICON_URL} onClick={openObsidianHandler} />
                                        </FlexLine>
                                    </FlexLine>
                                </PaperContainer>
                                <FRow className="descriptionPanel scrollableInLine" alignItems="stretch">
                                    {
                                        isEditDescription ?
                                            <TodoDescriptionEditor
                                                description={description ?? ''}
                                                onSave={async (value) => {
                                                    await updateTodo(id, { description: value });
                                                    setDescription(value);
                                                    setIsEditDescription(false);
                                                }}
                                            />
                                            :
                                            <>
                                                <RichText richContent={description ?? ''} isSimpleText={true} />
                                                <IconButton iconUrl={EDIT_ICON_URL} onClick={() => setIsEditDescription(true)} />
                                            </>
                                    }
                                </FRow>
                            </FlexLine>
                            {
                                isMobile ?
                                    <>
                                        {
                                            areChildrenShown &&
                                            <ModalWindow
                                                direction="column"
                                                className="p-3"
                                                width={60}
                                                height={80}
                                                alignItems="stretch"
                                                spacing={2}
                                                onClose={() => setAreChildrenShown(false)}
                                            >
                                                <FRow className="controlPanel">
                                                    <ActionButton label="Add children" onClick={() => setIsCreateChild(true)} />
                                                    {
                                                        hasDoneChildren &&
                                                        <ActionButton
                                                            type="standard"
                                                            label={areDoneChildrenShown ? "Hide done" : "Show done"}
                                                            onClick={() => setAreDoneChildrenShown(!areDoneChildrenShown)} />
                                                    }
                                                </FRow>
                                                <FCol alignItems="stretch" scrollableY>
                                                    {
                                                        todoChildren.map((child) =>
                                                            <PrimitiveCard item={child} key={child.id} />
                                                        )
                                                    }
                                                </FCol>
                                            </ModalWindow>
                                        }
                                        <FRow>
                                            <ActionButton label="Show children" onClick={() => setAreChildrenShown(true)} />
                                        </FRow>
                                    </>
                                    :
                                    <FCol alignItems="stretch" spacing={2} className="children flex1">
                                        <FRow className="controlPanel" spacing={2}>
                                            <ActionButton label="Add children" onClick={() => setIsCreateChild(true)} />
                                            {
                                                hasDoneChildren &&
                                                <ActionButton
                                                    type="standard"
                                                    label={areDoneChildrenShown ? "Hide done" : "Show done"}
                                                    onClick={() => setAreDoneChildrenShown(!areDoneChildrenShown)} />
                                            }
                                        </FRow>
                                        <FlexLine direction="column" alignItems="stretch" className="scrollableInLine">
                                            {
                                                todoChildren.map((child) => (
                                                    <PrimitiveCard item={child} key={child.id} />
                                                ))
                                            }
                                        </FlexLine>
                                    </FCol>
                            }
                        </FlexLine>
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
        </FlexLine>
    );
}

export default TodoItemPage;