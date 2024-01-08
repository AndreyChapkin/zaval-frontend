import { TodoStatus } from "@/app/_lib/types/todo";
import { useState } from "react";
import { ModalWindow } from "../../general/ModalWindow";
import { TodoStatusMenu } from "../TodoStatusMenu";
import { createTodo } from "@/app/_lib/calls/todo-calls";

export interface CreateTodoProps {
    parentId?: number;
    cancelHandler: () => void;
    successHandler: () => void;
}

function CreateTodo({ parentId, cancelHandler, successHandler }: CreateTodoProps) {

    const [name, setName] = useState('');
    const [status, setStatus] = useState<TodoStatus>('BACKLOG');

    return (
        <ModalWindow>
            <div className="createTodo">
                <div className="editPanel">
                    <TodoStatusMenu
                        currentStatus={status}
                        selectHandler={setStatus} />
                    <input
                        className="editName"
                        type="text"
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="controlPanel">
                    <button
                        className="createButton"
                        onClick={() => createTodo({
                            name,
                            status,
                            parentId: parentId ?? null
                        }).then(successHandler)}
                    >
                        Create
                    </button>
                    <button
                        className="cancelButton"
                        onClick={() => cancelHandler()}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </ModalWindow>
    );
}

export default CreateTodo;