import { EDIT_ICON_URL, TODO_COMPLEX_ICON_URL } from "@/app/_lib/constants/image-url-constants";
import { TodoLightDto } from "@/app/_lib/types/todo";
import { presentDate } from "@/app/_lib/utils/presentation-helpers";
import { chooseStatusColorClass } from "@/app/_lib/utils/todo-helpers";
import Link from "next/link";
import { MouseEventHandler, useState } from "react";
import { TodoMenu } from "../TodoMenu";
import { TodoMovingPanel } from "../TodoMovingPanel";

export interface TodoCardProps {
  todo: TodoLightDto;
  isNavigable?: boolean;
  selectHandler?: (todo: TodoLightDto) => void;
}

export default function TodoCard({ isNavigable = false, todo, selectHandler }: TodoCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMoveMenuOpen, setIsMoveMenuOpen] = useState(false);

  const statusClass = chooseStatusColorClass(todo.status);
  const secondaryStatusClass = `${statusClass}-secondary`;

  const innerSelectHandler: MouseEventHandler = (e) => {
    const LEFT_BUTTON = 0;
    if (e.ctrlKey && e.button === LEFT_BUTTON) {
      selectHandler && selectHandler(todo);
    }
  };

  const backgroundClickHandler = () => {
    setIsMenuOpen(false);
  };

  const editClickHandler = (e: React.MouseEvent<HTMLImageElement>) => {
    setIsMenuOpen(true);
  };

  const moveHandler = () => {
    setIsMoveMenuOpen(true);
  };

  const moveMenuCloseHandler = () => {
    setIsMoveMenuOpen(false);
  };

  return (
    <div className="todo-card" onClick={innerSelectHandler}>
      <div className={`todo-status-indicator ${statusClass}`} />
      <div className={`todo-status-indicator-secondary ${secondaryStatusClass}`} />
      <div className="todo-interaction-panel">
        {isNavigable && (
          <div className="go-to-todo" onClick={innerSelectHandler}>
            <Link href={`/todo/${todo.id}`}>
              <div className="link-area">
                <img src={TODO_COMPLEX_ICON_URL} alt="composition" />
              </div>
            </Link>
          </div>
        )}
        <div className="edit-menu">
          <img
            src={EDIT_ICON_URL}
            alt="composition"
            onClick={editClickHandler}
          />
        </div>
      </div>
      <div className="todo-info">
        <div className="todo-name">{todo.name}</div>
        <div className="additional-info">
          <div className="todo-priority">{todo.priority}</div>
          <div className="todo-interacted-on">{presentDate(todo.interactedOn)}</div>
        </div>
      </div>
      {isMenuOpen && (
        <TodoMenu todoDto={todo} moveHandler={moveHandler} clo={backgroundClickHandler} />
      )}
      {isMoveMenuOpen && (
        <TodoMovingPanel movingTodoDto={todo} closeHandler={moveMenuCloseHandler} />
      )}
    </div>
  );
}
