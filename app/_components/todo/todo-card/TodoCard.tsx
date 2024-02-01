import { EDIT_ICON_URL, TODO_COMPLEX_ICON_URL } from "@/app/_lib/constants/image-url-constants";
import { TodoLightDto } from "@/app/_lib/types/todo";
import { presentDate } from "@/app/_lib/utils/presentation-helpers";
import { chooseStatusColorClass } from "@/app/_lib/utils/todo-helpers";
import Link from "next/link";
import { MouseEventHandler, useState } from "react";
import { TodoMovingPanel } from "../TodoMovingPanel";
import { IconButton } from "../../general/icon-button/IconButton";

import "./TodoCard.scss";

export interface TodoCardProps {
  todo: TodoLightDto;
  isNavigable?: boolean;
  selectHandler?: (todo: TodoLightDto) => void;
}

export default function TodoCard({ isNavigable = false, todo, selectHandler }: TodoCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMoveMenuOpen, setIsMoveMenuOpen] = useState(false);

  const statusClass = chooseStatusColorClass(todo.status);

  const backgroundClickHandler = () => {
    setIsMenuOpen(false);
  };

  const editClickHandler = () => {
    setIsMenuOpen(true);
  };

  const moveHandler = () => {
    setIsMoveMenuOpen(true);
  };

  const moveMenuCloseHandler = () => {
    setIsMoveMenuOpen(false);
  };

  return (
    <div className="todoCard rowStartAndStart">
      <div className="todoInteractionPanel column">
        {isNavigable && (
          <Link href={`/ui/todo/${todo.id}`}>
            <IconButton size="small" iconUrl={TODO_COMPLEX_ICON_URL} />
          </Link>
        )}
        <div className="editMenu">
          <IconButton size="small" iconUrl={EDIT_ICON_URL} onClick={editClickHandler} />
        </div>
      </div>
      <div className="todoInfo columnStart">
        <div className="todoName">{todo.name}</div>
        <div className="additionalInfo">
          <div className="todoPriority">{todo.priority}</div>
          <div className="todoInteractedOn">{presentDate(todo.interactedOn)}</div>
        </div>
      </div>
      {isMenuOpen}
      {isMoveMenuOpen && (
        <TodoMovingPanel movingTodoDto={todo} closeHandler={moveMenuCloseHandler} />
      )}
    </div>
  );
}
