import { All_TODO_STATUSES, TodoLightDto, TodoStatus } from "@/app/_lib/types/todo-types";
import { useState } from "react";
import { ModalWindow } from "../../general/modal-window/ModalWindow";
import { createTodo } from "@/app/_lib/calls/todo-calls";
import { ActionButton } from "../../general/action-button/ActionButton";
import { StandardInput } from "../../general/standard-input/StandardInput";
import { GeneralSelect } from "../../general/general-select/GeneralSelect";
import { chooseStatusColorClass, chooseStatusImgUrl, todoStatusToLabel } from "@/app/_lib/utils/todo-helpers";

import './CreateTodoModal.scss';

export interface CreateTodoProps {
    parentId?: number;
    cancelHandler: () => void;
    successHandler: (todo: TodoLightDto) => void;
}

function CreateTodo({ parentId, cancelHandler, successHandler }: CreateTodoProps) {

    const [name, setName] = useState('');
    const [status, setStatus] = useState<TodoStatus>('BACKLOG');

    return (
        <ModalWindow onClose={cancelHandler}>
            <div className="createTodo columnStartAndStretch">
                <div className="editPanel columnStartAndStretch">
                    <GeneralSelect
                        currentElement={status}
                        allElements={All_TODO_STATUSES}
                        selectHandler={setStatus}
                        mapper={(status) => ({
                            label: todoStatusToLabel(status),
                            classNames: chooseStatusColorClass(status),
                            imageUrl: chooseStatusImgUrl(status)
                        })}
                    />
                    <StandardInput value={name} onChange={setName} />
                </div>
                <div className="controlPanel rowCenter">
                    <ActionButton
                        label="Create"
                        onClick={() => createTodo({
                            name,
                            status,
                            parentId: parentId ?? null
                        }).then(successHandler)} />
                    <ActionButton
                        label="Cancel"
                        onClick={cancelHandler} />
                </div>
            </div>
        </ModalWindow>
    );
}

export default CreateTodo;