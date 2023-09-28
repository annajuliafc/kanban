import { useState } from "react";
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
import useBoardContext from "../../context/BoardContext/useBoardContext";

export default function Board() {
  const {
    board,
    updateBoard,
    columns,
    setColumns,
    columnsIds,
    tasks,
    setTasks,
  } = useBoardContext();

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
          <ColumnFormModal />
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
    const updatedColumns = [...columns];

    const columnIndex = updatedColumns.findIndex((col) => col.id === columnId);

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
