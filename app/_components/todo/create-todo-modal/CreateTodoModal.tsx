import { createTodo } from "@/app/_lib/calls/todo-calls";
import { TodoLightDto, TodoStatus } from "@/app/_lib/types/todo-types";
import { useState } from "react";
import { ActionButton } from "../../general/action-button/ActionButton";
import { ModalWindow } from "../../general/modal-window/ModalWindow";
import { StandardInput } from "../../general/standard-input/StandardInput";

import { StandardLabel } from "../../general/standard-label/StandardLabel";
import { EditPriority } from "../edit-todo-modal/EditTodoModal";
import { TodoStatusSelect } from "../todo-status-select/TodoStatusSelect";
import './CreateTodoModal.scss';

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
            <div className="createTodoModal columnCenterAndStretch gap6">
                <div className="editPanel columnStartAndStretch gap3">
                    <StandardLabel label="Status">
                        <TodoStatusSelect currentStatus={status} onSelect={setStatus} />
                    </StandardLabel>
                    <StandardInput label="Name" value={name} onChange={setName} />
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