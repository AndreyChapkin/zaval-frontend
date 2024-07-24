import { createTodo } from "@/app/_lib/calls/todo-calls";
import { TodoLightDto, TodoStatus } from "@/app/_lib/types/todo-types";
import { useState } from "react";
import { ActionButton } from "../../general/action-button/ActionButton";
import { ModalWindow } from "../../general/modal-window/ModalWindow";
import { StandardInput } from "../../general/standard-input/StandardInput";

import { StandardLabel } from "../../general/standard-label/StandardLabel";
import { EditPriority } from "../edit-todo-modal/EditTodoModal";
import { TodoStatusSelect } from "../todo-status-select/TodoStatusSelect";
import FCol from "../../general/flex-line/FCol";
import FRow from "../../general/flex-line/FRow";

export interface CreateTodoProps {
    parentId?: number;
    onCancel: () => void;
    onSuccess: (todo: TodoLightDto) => void;
}

function CreateTodo({ parentId, onCancel: cancelHandler, onSuccess: successHandler }: CreateTodoProps) {

    const [name, setName] = useState('');
    const [status, setStatus] = useState<TodoStatus>('IN_PROGRESS');
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
        <ModalWindow
            height={60}
            width={60}
            alignItems="stretch"
            justifyContent="center"
            direction="column"
            className="p-6"
            onClose={cancelHandler}
        >
            <FCol fitChildrenX spacing={3} scrollableY>
                <StandardLabel label="Status">
                    <TodoStatusSelect currentStatus={status} onSelect={setStatus} />
                </StandardLabel>
                <StandardInput label="Name" value={name} onChange={setName} />
                <EditPriority
                    priority={priority}
                    onChange={setPriority} />
                <FRow className="mt-5" justifyContent="start" spacing={5}>
                    <ActionButton
                        label="Create"
                        onClick={createHandler} />
                    <ActionButton
                        label="Cancel"
                        onClick={cancelHandler} />
                </FRow>
            </FCol>
        </ModalWindow>
    );
}

export default CreateTodo;