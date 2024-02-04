'use client';

import { useEffect, useState } from "react";
import { TodoLightDto } from "../_lib/types/todo-types";
import TodoCard from "../_components/todo/todo-card/TodoCard";
import { getRootTodos, getTheMostDatedLightTodos } from "../_lib/calls/todo-calls";
import { TodoMenu } from "../_components/todo/TodoMenu";

export default function WelcomePage() {

  const [rootTodos, setRootTodos] = useState(null as null | TodoLightDto[]);
  const [recentTodos, setRecentTodos] = useState(null as null | TodoLightDto[]);
  const [oldTodos, setOldTodos] = useState(null as null | TodoLightDto[]);
  const [createInRootMenuIsOpen, setCreateInRootMenuIsOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const [rootTodos, recentTodos, oldTodos] = await Promise.all([
        getRootTodos(),
        getTheMostDatedLightTodos(10, 'recent'),
        getTheMostDatedLightTodos(10, 'old'),
      ]);
      setRootTodos(rootTodos);
      setRecentTodos(recentTodos);
      setOldTodos(oldTodos);  
    }
    fetchData();    
  }, []);

  return (
    <div className="root-todo-page">
      <div className="root-todos">
        <div className="root-control-panel">
          <button
            onClick={() => setCreateInRootMenuIsOpen(true)}
            className="standard-button"
          >
            Add task
          </button>
        </div>
        <div className="block">
          <div className="block-title">Root:</div>
          <div className="block-body">
            {rootTodos && rootTodos.map((rootTodo, index) => (
              <TodoCard todo={rootTodo} />
            ))}
          </div>
        </div>
      </div>
      <div className="dated-todos">
        <div className="recent-todos block">
          <div className="block-title">Recent:</div>
          <div className="block-body">
            {recentTodos && recentTodos.map((recentTodo, index) => (
              <TodoCard key={index} todo={recentTodo} />
            ))}
          </div>
        </div>
        <div className="old-todos block">
          <div className="block-title">Old:</div>
          <div className="block-body">
            {oldTodos && oldTodos.map((oldTodo, index) => (
              <TodoCard key={index} todo={oldTodo} />
            ))}
          </div>
        </div>
      </div>
      {createInRootMenuIsOpen && (
        <TodoMenu closeHandler={() => setCreateInRootMenuIsOpen(false)} todoDto={null} />
      )}
    </div>
  );
}
