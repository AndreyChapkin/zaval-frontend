'use client';

import { getTodo } from "@/app/_lib/calls/todo-calls";
import { TodoLightDto } from "@/app/_lib/types/todo";
import { useParams } from "next/navigation";
import { use, useEffect, useState } from "react";

function TodoItemPage() {

    const params = useParams<{ id: string }>();
    const id = Number(params.id);
    const [todo, setTodo] = useState<TodoLightDto>();

    useEffect(() => {
        getTodo(id).then(setTodo);
    }, []);

    return (
        <>
            <div>Main page for {id}</div>
            <div>
                {
                    todo ? todo.name : "no such todo"
                }
            </div>
        </>

    );
}

export default TodoItemPage;