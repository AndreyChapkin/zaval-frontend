export interface TodoLightDto {
    id: number;
    name: string;
    priority: number;
    status: TodoStatus;
    parentId: number | null;
    interactedOn: string;
}

export interface TodoFamilyDto {
    id: number;
    name: string;
    description: string;
    priority: number;
    status: TodoStatus;
    interactedOn: string;
    parents: TodoLightDto[];
    children: TodoLightDto[];
}

export interface TodoLeafWithBranchIdDto {
    leafTodo: TodoLightDto;
    parentBranchId: number | null;
}

export interface TodosListDto {
    leafTodos: TodoLeafWithBranchIdDto[];
    parentBranchesMap: Record<number, TodoLightDto[]>;
}

export interface TodoHistoryDto {
    todoId: number;
    records: string[];
}

export interface TodoCreateDto {
    name: string;
    status: TodoStatus;
    priority: number;
    parentId: number | null;
}

export interface UpdateTodoDto {
    general?: UpdateTodoGeneralDto,
    description?: string
}

export interface UpdateTodoGeneralDto {
    name: string,
    status: TodoStatus,
    priority: number,
}

export interface MoveTodoDto {
    todoId: number;
    parentId: number | null;
}

export interface SaveHistoryDto {
    todoId: number;
    records: string[];
}

export type TodoStatus = "DONE" | "BACKLOG" | "WILL_BE_BACK" | "PING_ME" | "NEXT_TO_TAKE" | "IN_PROGRESS";

export const All_TODO_STATUSES: TodoStatus[] = ["DONE", "BACKLOG", "WILL_BE_BACK", "PING_ME", "NEXT_TO_TAKE", "IN_PROGRESS"];