import { KeyboardEventHandler, useCallback, useState } from "react";
import { ModalWindow } from "../general/modal-window/ModalWindow";
import { TodoStatusSelect } from "./todo-status-select/TodoStatusSelect";
import { TodoLightDto, TodoStatus } from "@/app/_lib/types/todo";
import { createTodo, deleteTodo, updateTodo } from "@/app/_lib/calls/todo-calls";
import { useRouter } from "next/router";
import { returnParentId } from "@/app/_lib/utils/todo-helpers";
import { RemoveAcceptance } from "./RemoveAcceptance";

export interface TodoMenuProps {
    todoDto: TodoLightDto | null;
    moveHandler?: (todo: TodoLightDto) => void;
    closeHandler: () => void;
}

export function TodoMenu({ todoDto, moveHandler, closeHandler }: TodoMenuProps) {

    const [editName, setEditName] = useState(todoDto?.name || '');
    const [editStatus, setEditStatus] = useState(todoDto?.status || 'BACKLOG');
    const [editPriority, setEditPriority] = useState(todoDto?.priority || 0);
    const [isRemoving, setIsRemoving] = useState(false);
    const [isCreateMode, setIsCreateMode] = useState(todoDto === null);

    const router = useRouter();

    const requestTodoUpdate = async () => {
        if (todoDto) {
            await updateTodo(todoDto.id, {
                general: {
                    name: editName,
                    priority: editPriority,
                    status: editStatus,
                },
            });
        }
        router.reload();
    };

    const requestTodoCreate = async () => {
        await createTodo({
            name: editName,
            status: editStatus,
            parentId: todoDto?.id || null,
        });
        router.reload();
    };

    const requestTodoDelete = async () => {
        if (todoDto) {
            const parentTodoId = returnParentId(todoDto);
            await deleteTodo(todoDto.id);
            // TODO: make slighter
            router.push(`/todo/${parentTodoId || ''}`);
        }
    };

    const enterKeyHandler: KeyboardEventHandler = (e) => {
        if (e.code === 'Enter') {
            if (isCreateMode) {
                requestTodoCreate();
            } else {
                requestTodoUpdate();
            }
        }
    };

    const addSubtaskHandler = () => {
        setIsCreateMode(true);
        setEditName('');
        setEditStatus('BACKLOG');
    };

    return (
        <ModalWindow closeHandler={closeHandler}>
            <div className="todo-menu">
                <div className="edit-pane" onKeyUp={enterKeyHandler}>
                    <TodoStatusSelect currentStatus={editStatus} selectHandler={(status) => setEditStatus(status)} />
                    <input
                        className="edit-name"
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)} />
                    <input
                        className="edit-priority"
                        onKeyUp={enterKeyHandler}
                        type="text"
                        value={editPriority}
                        onChange={(e) => setEditPriority(Number(e.target.value))}
                    />
                </div>
                <div className="action-pane">
                    {!isCreateMode ? (
                        <>
                            <div className="todo-menu-action" onClick={requestTodoUpdate}>
                                Update
                            </div>
                            <div className="todo-menu-action" onClick={addSubtaskHandler}>
                                Add subtask
                            </div>
                            <div className="todo-menu-action" onClick={() => moveHandler(todoDto)}>
                                Move
                            </div>
                            <div className="todo-menu-action" onClick={() => setIsRemoving(true)}>
                                Delete
                            </div>
                        </>
                    ) : (
                        <div className="todo-menu-action" onClick={requestTodoCreate}>
                            Create
                        </div>
                    )}
                </div>
            </div>
            {isRemoving && (
                <RemoveAcceptance
                    acceptHandler={requestTodoDelete}
                    cancelHandler={() => setIsRemoving(false)} />
            )}
        </ModalWindow>
    );
};