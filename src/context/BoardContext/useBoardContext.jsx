import { useContext } from "react";
import { BoardContext } from "./BoardProvider";
import axios from "axios";

export default function useBoardContext() {
  const {
    board,
    setBoard,
    error,
    columns,
    setColumns,
    columnsIds,
    tasks,
    setTasks,
  } = useContext(BoardContext);

  const updateBoard = (updatedBoard) => {
    axios
      .put("http://localhost:3000/board", updatedBoard)
      .then((response) => {
        console.log("Board atualizado no backend:", response.data);
      })
      .catch((error) => {
        console.error("Erro ao atualizar o board:", error);
      });
  };

  //   Columns menager
  function generateNextColumnId(columns) {
    const maxId = columns.reduce((max, column) => {
      const idNumber = parseInt(column.id.replace("column-", ""));
      return idNumber > max ? idNumber : max;
    }, 0);

    return `column-${maxId + 1}`;
  }

  const createColumn = (newColumn) => {
    const nextColumnId = generateNextColumnId(columns);
    const newColumnWithId = { ...newColumn, id: nextColumnId };
    setColumns((prevColumns) => [...prevColumns, newColumnWithId]);

    const updatedColumns = [...columns, newColumnWithId];

    const updatedColumnsWithoutTasks = updatedColumns.map((column) => {
      const { tasks, ...columnWithoutTasks } = column;
      return columnWithoutTasks;
    });

    const updatedBoard = {
      ...board,
      columns: updatedColumnsWithoutTasks,
      tasks: tasks,
    };

    updateBoard(updatedBoard);
  };

  const editColumn = (updatedColumn) => {
    setColumns((prevColumns) => {
      const updatedColumns = prevColumns.map((column) =>
        column.id === updatedColumn.id ? updatedColumn : column
      );
      return updatedColumns;
    });

    const updatedColumns = columns.map((column) =>
      column.id === updatedColumn.id ? updatedColumn : column
    );

    const updatedColumnsWithoutTasks = updatedColumns.map((column) => {
      const { tasks, ...columnWithoutTasks } = column;
      return columnWithoutTasks;
    });

    const updatedBoard = {
      ...board,
      columns: updatedColumnsWithoutTasks,
      tasks: tasks,
    };

    updateBoard(updatedBoard);
  };

  const deleteColumn = (columnId) => {
    const taskIdsToDelete = [];
    columns.forEach((column) => {
      if (column.id === columnId) {
        taskIdsToDelete.push(...column.taskIds);
      }
    });

    setColumns((prevColumns) => {
      const updatedColumns = prevColumns.filter(
        (column) => column.id !== columnId
      );
      return updatedColumns;
    });

    setTasks((prevTasks) =>
      prevTasks.filter((task) => !taskIdsToDelete.includes(task.id))
    );

    const updatedColumns = columns.filter((column) => column.id !== columnId);

    const updatedColumnsWithoutTasks = updatedColumns.map((column) => {
      const { tasks, ...columnWithoutTasks } = column;
      return columnWithoutTasks;
    });

    const updatedBoard = {
      ...board,
      columns: updatedColumnsWithoutTasks,
      tasks: tasks.filter((task) => !taskIdsToDelete.includes(task.id)),
    };

    updateBoard(updatedBoard);
  };

  //   Tasks menager
  function generateNextTaskId(tasks) {
    const maxId = tasks.reduce((max, task) => {
      const idNumber = task.id;
      return idNumber > max ? idNumber : max;
    }, 0);

    return maxId + 1;
  }

  const createTask = (newTask) => {
    const nextTaskId = generateNextTaskId(tasks);
    const newTaskWithId = { ...newTask, id: nextTaskId };
    setTasks((prevTasks) => [...prevTasks, newTaskWithId]);

    setColumns((prevColumns) => {
      const updatedColumns = prevColumns.map((column) => {
        if (column.id === newTask.columnId) {
          const updatedTaskIds = [...column.taskIds, nextTaskId];
          return { ...column, taskIds: updatedTaskIds };
        }
        return column;
      });
      return updatedColumns;
    });

    const updatedTasks = [...tasks, newTaskWithId];

    const updatedColumns = columns.map((column) => {
      if (column.id === newTask.columnId) {
        const updatedTaskIds = [...column.taskIds, nextTaskId];
        return { ...column, taskIds: updatedTaskIds };
      }
      return column;
    });

    const updatedColumnsWithoutTasks = updatedColumns.map((column) => {
      const { tasks, ...columnWithoutTasks } = column;
      return columnWithoutTasks;
    });

    const updatedBoard = {
      ...board,
      columns: updatedColumnsWithoutTasks,
      tasks: updatedTasks,
    };

    updateBoard(updatedBoard);
  };

  const editTask = (updatedTask) => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      );
      return updatedTasks;
    });

    const updatedTasks = tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );

    const updatedColumnsWithoutTasks = columns.map((column) => {
      const { tasks, ...columnWithoutTasks } = column;
      return columnWithoutTasks;
    });

    const updatedBoard = {
      ...board,
      columns: updatedColumnsWithoutTasks,
      tasks: updatedTasks,
    };

    updateBoard(updatedBoard);
  };

  const deleteTask = (taskId) => {
    setColumns((prevColumns) => {
      const updateColumns = prevColumns.map((column) => {
        if (column.taskIds.includes(taskId)) {
          const updatedTaskIds = column.taskIds.filter((id) => id !== taskId);
          return { ...column, taskIds: updatedTaskIds };
        }
        return column;
      });
      return updateColumns;
    });

    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.filter((task) => task.id !== taskId);
      return updatedTasks;
    });

    const updatedTasks = tasks.filter((task) => task.id !== taskId);

    const updatedColumns = columns.map((column) => {
      if (column.taskIds.includes(taskId)) {
        const updatedTaskIds = column.taskIds.filter((id) => id !== taskId);
        return { ...column, taskIds: updatedTaskIds };
      }
      return column;
    });

    const updatedColumnsWithoutTasks = updatedColumns.map((column) => {
      const { tasks, ...columnWithoutTasks } = column;
      return columnWithoutTasks;
    });

    const updatedBoard = {
      ...board,
      columns: updatedColumnsWithoutTasks,
      tasks: updatedTasks,
    };

    updateBoard(updatedBoard);
  };

  return {
    board,
    setBoard,
    updateBoard,
    error,
    columns,
    setColumns,
    columnsIds,
    tasks,
    setTasks,
    createColumn,
    editColumn,
    deleteColumn,
    createTask,
    editTask,
    deleteTask,
  };
}
