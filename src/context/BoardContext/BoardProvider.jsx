import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

export const BoardContext = createContext();
BoardContext.displayName = "Board";

export default function BoardProvider({ children }) {
  const [board, setBoard] = useState(null);
  const [error, setError] = useState(false);
  const [columns, setColumns] = useState(null);
  const [columnsIds, setColumnsIds] = useState(null);

  const [tasks, setTasks] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/board")
      .then(function (response) {
        const boardWithTasks = {
          ...response.data,
          columns: response.data.columns.map((column) => ({
            ...column,
            tasks: response.data.tasks.filter(
              (task) => task.columnId === column.id
            ),
          })),
        };
        setBoard(boardWithTasks);
        setColumns(boardWithTasks.columns);
        setTasks(boardWithTasks.tasks);
        setColumnsIds(boardWithTasks.columns.map((col) => col.id));
      })
      .catch(function (error) {
        console.error("Erro ao buscar os dados do quadro:", error);
        setError(true);
      });
  }, []);

  return (
    <BoardContext.Provider
      value={{
        board,
        setBoard,
        error,
        columns,
        setColumns,
        columnsIds,
        tasks,
        setTasks,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
}

BoardProvider.propTypes = {
  children: PropTypes.node,
};
