import { findTodosWithNameFragment, moveTodo } from "@/app/_lib/calls/todo-calls";
import { TodoLightDto } from "@/app/_lib/types/todo";
import { decreaseNumberOfCalls } from "@/app/_lib/utils/function-helpers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ModalWindow } from "../general/modal-window/ModalWindow";
import { TodoMoveCard } from "./TodoMoveCard";

export interface TodoMovingPanelProps {
    movingTodoDto: TodoLightDto;
    closeHandler: () => void;
}

export function TodoMovingPanel({ movingTodoDto, closeHandler }: TodoMovingPanelProps) {
    const [searchValue, setSearchValue] = useState('');
    const [todos, setTodos] = useState<TodoLightDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const selectHandler = async (todo: TodoLightDto) => {
        await moveTodo({
            todoId: movingTodoDto.id,
            parentId: todo.id
        });
        router.push(`/todo/${movingTodoDto.id}`);
    };

    const toRootHandler = async () => {
        await moveTodo({
            todoId: movingTodoDto.id,
            parentId: null
        });
        router.push(`/todo/${movingTodoDto.id}`);
    };

    const searchTodos = decreaseNumberOfCalls((value: string) => {
        setIsLoading(true);
        findTodosWithNameFragment(value).then((data) => {
            setIsLoading(false);
            setTodos(data);
        });
    }, 500);

    useEffect(() => {
        if (searchValue) {
            searchTodos(searchValue);
        }
    }, [searchValue]);

    return (
        <ModalWindow closeHandler={closeHandler}>
            <div className="moving-todo-panel">
                <div className="moving-todo">
                    {movingTodoDto.name}
                </div>
                <button className="to-root" onClick={toRootHandler}>To root</button>
                <div className="delimeter">or</div>
                <div className="search-panel">
                    <input
                        className="search-input"
                        type="text"
                        onChange={(e) => { setSearchValue(e.target.value) }}
                    />
                    {
                        isLoading ? (
                            "Loading..."
                        ) : (
                            <div className="found-todo">
                                {
                                    todos && todos.map((todo) => (
                                        <TodoMoveCard
                                            todo={todo}
                                            selectHandler={selectHandler}
                                        />
                                    ))
                                }
                            </div>
                        )
                    }
                </div>
            </div>
        </ModalWindow >
    );
}