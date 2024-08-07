import { baseURL } from "../constants/url-constants";
import { TodoCreateDto, TodoLightDto, MoveTodoDto, TodoHistoryDto, TodoStatus, UpdateTodoDto, TodoFamilyDto, TodosListDto } from "../types/todo-types";
import { callDelete, callGet, callPatch, callPost } from "./base-calls";

const baseTodoURL = baseURL + "/todo";

export async function createTodo(createTodoDto: TodoCreateDto): Promise<TodoLightDto> {
    const url = baseTodoURL;
    const result = await callPost<TodoLightDto>(url, createTodoDto);
    return result.data;
}

export async function getLightTodo(todoId: number): Promise<TodoLightDto> {
    const url = `${baseTodoURL}/${todoId}`;
    const result = await callGet<TodoLightDto>(url);
    return result.data;
}

export async function getTodoFamily(todoId: number): Promise<TodoFamilyDto> {
    const url = `${baseTodoURL}/family/${todoId}`;
    const result = await callGet<TodoFamilyDto>(url);
    return result.data;
}

export async function getTheMostDatedLightTodos(count?: number, orderType?: 'recent' | 'old'): Promise<TodoLightDto[]> {
    const url = `${baseTodoURL}/recent`;
    const result = await callGet<TodoLightDto[]>(url, {
        count,
        orderType
    });
    return result.data;
}

export async function updateTodo(todoId: number, updateTodoDto: UpdateTodoDto): Promise<TodoLightDto> {
    const url = `${baseTodoURL}/${todoId}`;
    const result = await callPatch<TodoLightDto>(url, updateTodoDto);
    return result.data;
}

export async function updatePriorityForAllTodos(updatePriorityTodoDto: { id: number; priority: number }[]): Promise<void> {
    const url = `${baseTodoURL}/all/priority`;
    await callPatch<void>(url, updatePriorityTodoDto);
}

export async function deleteTodo(todoId: number): Promise<void> {
    const url = `${baseTodoURL}/${todoId}`;
    await callDelete<void>(url);
}

export async function getRootTodos(): Promise<TodoLightDto[]> {
    const url = `${baseTodoURL}/root`;
    const result = await callGet<TodoLightDto[]>(url);
    return result.data;
}

export async function getAllTodos(): Promise<TodoLightDto[]> {
    const url = baseTodoURL;
    const result = await callGet<TodoLightDto[]>(url);
    return result.data;
}

export async function getPrioritizedListOfTodos(todoIds: number[]): Promise<TodosListDto> {
    const url = `${baseTodoURL}/prioritized-list`;
    const result = await callPost<TodosListDto>(url, { todoIds });
    return result.data;
}

export async function getPrioritizedListOfTodosWithStatus(status: TodoStatus): Promise<TodosListDto> {
    const url = `${baseTodoURL}/prioritized-list/${status}`;
    const result = await callGet<TodosListDto>(url);
    return result.data;
}

export async function moveTodo(moveTodoDto: MoveTodoDto): Promise<void> {
    const url = `${baseTodoURL}/move`;
    await callPatch<void>(url, moveTodoDto);
}

export async function findTodosWithNameFragment(nameFragment: string): Promise<TodoLightDto[]> {
    const url = `${baseTodoURL}/with-name-fragment`;
    const response = await callGet<TodoLightDto[]>(url, {
        "name-fragment": nameFragment
    });
    return response.data;
}

export async function openObsidianNoteForTodo(todoId: number, params: { uiPageUrl: string }): Promise<void> {
    const url = `${baseTodoURL}/${todoId}/obsidian-note`;
    await callPost<void>(url, params);
}