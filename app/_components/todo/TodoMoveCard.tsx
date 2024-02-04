import { CHOOSE_ICON_URL } from "@/app/_lib/constants/image-url-constants";
import { TodoLightDto } from "@/app/_lib/types/todo-types";

interface MoveTodoCardProps {
    todo: TodoLightDto;
    selectHandler: (todo: TodoLightDto) => void;
}

export function TodoMoveCard({ todo, selectHandler }: MoveTodoCardProps) {
    return (
        <div className="move-todo-card">
            <div className="todo-name">
                {todo.name}
            </div>
            <button onClick={() => selectHandler(todo)} className="select-todo">
                <img
                    src={CHOOSE_ICON_URL}
                    alt="composition"
                />
            </button>
        </div>
    );
};