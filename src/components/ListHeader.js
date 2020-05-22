import React, { Fragment } from 'react';

export const ListHeader = ({
  addTodo,
  setNewTodo,
  updateName,
  readOnly,
  newTodo,
  name,
}) => {
  return !readOnly ? (
    <Fragment>
      <h1
        id="appName"
        contentEditable={true}
        suppressContentEditableWarning={true}
        onBlur={(e) => {
          const name = e.target.innerText;
          updateName(name);
          e.target.innerText = '';
        }}
      >
        {name || '[Add new name]'}
      </h1>
      <input
        className="new-todo"
        value={newTodo}
        onChange={(e) => {
          setNewTodo(e.target.value);
        }}
        onBlur={(e) => {
          addTodo(newTodo);
          e.target.value = '';
        }}
        type="text"
        placeholder="What needs to be done?"
      />
    </Fragment>
  ) : (
    <h1 id="appName">{name}</h1>
  );
};
