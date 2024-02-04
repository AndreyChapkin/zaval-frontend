import { EDIT_ICON_URL, SEE_ICON_URL } from "@/app/_lib/constants/image-url-constants";
import { TodoLightDto } from "@/app/_lib/types/todo-types";
import { presentDate } from "@/app/_lib/utils/presentation-helpers";
import Link from "next/link";
import { useState } from "react";
import { IconButton } from "../../general/icon-button/IconButton";

import { EditTodoModal } from "../edit-todo-modal/EditTodoModal";
import TodoStatusIndicator from "../status-indicator/TodoStatusIndicator";
import TodoPriority from "../todo-priority/TodoPriority";
import "./TodoCard.scss";

export interface TodoCardProps {
  todo: TodoLightDto;
}

export default function TodoCard({ todo }: TodoCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <div className="todoCard rowStartAndStretch">
        <Link className="column" href={`/ui/todo/${todo.id}`}>
          <div className="navigation columnJustifyAndCenter flex1 gap1">
            <TodoStatusIndicator status={todo.status} />
            <img src={SEE_ICON_URL} />
          </div>
        </Link>
        <div className="mainPanel flex1 column">
          <div className="namePanel flex1 rowStartAndStretch gap3">
            {todo.name}
          </div>
          <div className="secondaryPanel rowStartAndEnd gap1">
            <IconButton
              size="small"
              iconUrl={EDIT_ICON_URL}
              onClick={() => setIsMenuOpen(true)} />
            <div className="additionalInfo rowStartAndEnd gap2">
              <TodoPriority priority={todo.priority} />
              <div className="todoInteractedOn">{presentDate(todo.interactedOn)}</div>
            </div>
          </div>
        </div>
        {isMenuOpen && (
          <EditTodoModal
            todo={todo}
            onSave={() => location.reload()}
            onClose={() => setIsMenuOpen(false)} />
        )}
      </div>
    </>
  );
}
