import React, { useState } from 'react';

const TodoItem = ({ todo, removeTodo, changeStatus, updateTodo }) => {
  const { text, lastUpdated, nodeID, status } = todo;
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(text);
  let classes = status === 'completed' ? status : '';
  classes += isEditing ? 'editing' : '';

  return (
    <li className={classes} key={nodeID}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={status === 'completed'}
          onChange={changeStatus.bind(this, todo)}
        />
        <label onClick={() => setIsEditing(true)}>
          {text} <small>[Updated At: {lastUpdated}]</small>
        </label>
        <button className="destroy" onClick={removeTodo.bind(this, todo)} />
      </div>
      <input
        className="edit"
        value={newText}
        onChange={(e) => {
          setNewText(e.target.value);
        }}
        onBlur={() => {
          updateTodo({ ...todo, text: newText });
          setIsEditing(false);
        }}
      />
    </li>
  );
};

export const TodoList = ({
  todos = [],
  removeTodo,
  changeStatus,
  updateTodo,
}) => {
  return (
    <ul id="todo-list" className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.nodeID}
          todo={todo}
          removeTodo={removeTodo}
          changeStatus={changeStatus}
          updateTodo={updateTodo}
        />
      ))}
    </ul>
  );
};
