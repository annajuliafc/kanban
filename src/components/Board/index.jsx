import { useMemo, useState } from "react";
import Button from "../common/Button";
import styles from "./styles.module.css";
import Column from "../Column";
import PropTypes from "prop-types";
import Task from "../Task";
import ColumnFormModal from "../ColumnForm";
import Dialog from "@mui/material/Dialog";
import AddIcon from "@mui/icons-material/Add";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import axios from "axios";

export default function Board({ board }) {
  const [columns, setColumns] = useState(board.columns);
  const columnsIds = useMemo(() => columns.map((col) => col.id), [columns]);

  const [tasks, setTasks] = useState(board.tasks);

  const [activeColumn, setActiveColumn] = useState(null);
  const [activeTask, setActiveTask] = useState(null);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const updateBoard = (updatedBoard) => {
    console.log("updatedBoard", updatedBoard);
    axios
      .put("http://localhost:3000/board", updatedBoard)
      .then((response) => {
        console.log("Board atualizado no backend:", response.data);
      })
      .catch((error) => {
        console.error("Erro ao atualizar o board:", error);
      });
  };

  function generateNextColumnId(columns) {
    const maxId = columns.reduce((max, column) => {
      const idNumber = parseInt(column.id.replace("column-", ""));
      return idNumber > max ? idNumber : max;
    }, 0);

    return `column-${maxId + 1}`;
  }

  function generateNextTaskId(tasks) {
    const maxId = tasks.reduce((max, task) => {
      const idNumber = task.id;
      return idNumber > max ? idNumber : max;
    }, 0);

    return maxId + 1;
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

  return columns && tasks ? (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
      <div className={styles.board}>
        <SortableContext items={columnsIds}>
          {columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              title={column.title}
              color={column.color}
              tasks={tasks.filter((task) => task.columnId === column.id)}
              editTask={editTask}
              deleteTask={deleteTask}
              createTask={createTask}
              editColumn={editColumn}
              deleteColumn={deleteColumn}
            />
          ))}
        </SortableContext>
        <Button
          buttonClassStyle={styles.buttonStyle}
          text="Adicionar outra coluna"
          icon={<AddIcon sx={{ color: "#212529" }} />}
          clickFunction={handleClickOpen}
        />
        <Dialog
          open={open}
          onClose={handleClose}
          fullWidth={true}
          maxWidth="sm"
        >
          <ColumnFormModal createColumn={createColumn} />
        </Dialog>
      </div>
      {createPortal(
        <DragOverlay>
          {activeColumn && (
            <Column
              column={activeColumn}
              title={activeColumn.title}
              tasks={tasks.filter((task) => task.columnId === activeColumn.id)}
            />
          )}
          {activeTask && <Task task={activeTask} />}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  ) : (
    ""
  );

  function onDragStart(event) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }

    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  function onDragEnd(event) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAColumn = active.data.current?.type === "Column";
    if (!isActiveAColumn) {
      return;
    } else {
      let activeColumnIndex = columns.findIndex((col) => col.id === activeId);
      let overColumnIndex = columns.findIndex((col) => col.id === overId);

      setColumns((columns) => {
        return arrayMove(columns, activeColumnIndex, overColumnIndex);
      });

      let updatedColumns = arrayMove(
        columns,
        activeColumnIndex,
        overColumnIndex
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
    }
  }

  function onDragOver(event) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        if (tasks[activeIndex].columnId != tasks[overIndex].columnId) {
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
          const updatedTasks = arrayMove(tasks, activeIndex, overIndex - 1);

          // Logica para atualizar a ordemdos ids dentro de column.id e setar em uma nova const updatedColumns

          const updatedColumns = reorderColumnIds(
            board.columns,
            tasks[activeIndex].columnId,
            tasks[overIndex].columnId,
            tasks[activeIndex].id,
            tasks[overIndex].id
          );

          const updatedBoard = {
            ...board,
            columns: updatedColumns,
            tasks: updatedTasks,
          };

          updateBoard(updatedBoard);

          return updatedTasks;
        }

        const updatedTasks = arrayMove(tasks, activeIndex, overIndex);

        // Logica para atualizar a ordemdos ids dentro de column.id e setar em uma nova const updatedColumns

        const updatedColumns = reorderColumnIds(
          board.columns,
          tasks[activeIndex].columnId,
          tasks[overIndex].columnId,
          tasks[activeIndex].id,
          tasks[overIndex].id
        );

        const updatedBoard = {
          ...board,
          columns: updatedColumns,
          tasks: updatedTasks,
        };

        updateBoard(updatedBoard);

        return updatedTasks;
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        tasks[activeIndex].columnId = overId;
        const updatedTasks = arrayMove(tasks, activeIndex, activeIndex);

        // Logica para atualizar a ordemdos ids dentro de column.id e setar em uma nova const updatedColumns

        const updatedColumns = updateColumnTaskIds(
          board.columns,
          tasks[activeIndex].columnId,
          activeId,
          overId
        );

        const updatedBoard = {
          ...board,
          columns: updatedColumns,
          tasks: updatedTasks,
        };

        updateBoard(updatedBoard);

        return updatedTasks;
      });
    }
  }

  function reorderColumnIds(columns, source, destination, taskId) {
    const sourceIndex = columns.findIndex((col) => col.id === source);
    const destinationIndex = columns.findIndex((col) => col.id === destination);
  
    const updatedColumns = [...columns];
    const sourceColumn = { ...updatedColumns[sourceIndex] };
    const destinationColumn = { ...updatedColumns[destinationIndex] };
  
    const fromIndex = sourceColumn.taskIds.findIndex((id) => id === taskId);
    const toIndex = destinationColumn.taskIds.findIndex((id) => id === taskId);
  
    sourceColumn.taskIds.splice(fromIndex, 1);
    destinationColumn.taskIds.splice(toIndex, 0, taskId);
  
    updatedColumns[sourceIndex] = sourceColumn;
    updatedColumns[destinationIndex] = destinationColumn;
  
    return updatedColumns;
  }

  function updateColumnTaskIds(columns, columnId, fromTaskId, toTaskId) {
    // Clone as colunas originais
    const updatedColumns = [...columns];

    // Encontre o índice da coluna em que a tarefa está sendo movida
    const columnIndex = updatedColumns.findIndex((col) => col.id === columnId);

    // Atualize os IDs de tarefas dentro de column.taskIds
    const taskIds = updatedColumns[columnIndex].taskIds;
    const fromIndex = taskIds.indexOf(fromTaskId);
    const toIndex = taskIds.indexOf(toTaskId);
    taskIds.splice(fromIndex, 1);
    taskIds.splice(toIndex, 0, fromTaskId);

    return updatedColumns;
  }
}

Board.propTypes = {
  board: PropTypes.object.isRequired,
};
