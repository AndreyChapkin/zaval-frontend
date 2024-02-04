import { All_TODO_STATUSES, TodoLightDto, TodoStatus } from "@/app/_lib/types/todo-types";
import { useState } from "react";
import { ModalWindow } from "../../general/modal-window/ModalWindow";
import { createTodo } from "@/app/_lib/calls/todo-calls";
import { ActionButton } from "../../general/action-button/ActionButton";
import { StandardInput } from "../../general/standard-input/StandardInput";
import { GeneralSelect } from "../../general/general-select/GeneralSelect";
import { chooseStatusColorClass, chooseStatusImgUrl, todoStatusToLabel } from "@/app/_lib/utils/todo-helpers";

import './CreateTodoModal.scss';
import { TodoStatusSelect } from "../todo-status-select/TodoStatusSelect";
import { EditPriority } from "../edit-todo-modal/EditTodoModal";

export interface CreateTodoProps {
    parentId?: number;
    onCancel: () => void;
    onSuccess: (todo: TodoLightDto) => void;
}

function CreateTodo({ parentId, onCancel: cancelHandler, onSuccess: successHandler }: CreateTodoProps) {

    const [name, setName] = useState('');
    const [status, setStatus] = useState<TodoStatus>('BACKLOG');
    const [priority, setPriority] = useState(0);

    const createHandler = async () => {
        const createdTodo = await createTodo({
            name,
            status,
            priority,
            parentId: parentId ?? null
        });
        successHandler(createdTodo);
    };

    return (
        <ModalWindow onClose={cancelHandler}>
            <div className="createTodo columnCenterAndStretch gap4">
                <div className="editPanel columnStartAndStretch gap2">
                    <TodoStatusSelect currentStatus={status} onSelect={setStatus} />
                    <StandardInput value={name} onChange={setName} />
                    <EditPriority
                        priority={priority}
                        onChange={setPriority} />
                </div>
                <div className="controlPanel rowCenter gap5">
                    <ActionButton
                        label="Create"
                        onClick={createHandler} />
                    <ActionButton
                        label="Cancel"
                        onClick={cancelHandler} />
                </div>
            </div>
        </ModalWindow>
    );
}

export default CreateTodo;