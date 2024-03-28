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
import FRow from "../../general/flex-line/FRow";
import FCol from "../../general/flex-line/FCol";
import { FPaper } from "../../general/paper-container/FPaper";

export interface TodoCardProps {
  todo: TodoLightDto;
}

export default function TodoCard({ todo }: TodoCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <FPaper direction="row" className="todoCard shrink0" alignItems="stretch">
      <Link className="column" href={`/ui/todo/${todo.id}`}>
        <div className="navigation columnCenterAndCenter flex1 gap1">
          <img src={SEE_ICON_URL} />
        </div>
      </Link>
      <FCol className="mainPanel flex1">
        <div className="namePanel flex1">
          {todo.name}
        </div>
        <FRow className="secondaryPanel" alignItems="center">
          <FRow className="additionalInfo" alignItems="center">
            <TodoStatusIndicator status={todo.status} />
            <div className="todoInteractedOn">{presentDate(todo.interactedOn)}</div>
            <TodoPriority priority={todo.priority} />
          </FRow>
          <IconButton
            size="small"
            iconUrl={EDIT_ICON_URL}
            onClick={() => setIsMenuOpen(true)} />
        </FRow>
      </FCol>
      {isMenuOpen && (
        <EditTodoModal
          todo={todo}
          onSave={() => location.reload()}
          onClose={() => setIsMenuOpen(false)} />
      )}
    </FPaper>
  );
}
