import { useEffect, useState } from "react";
import Button from "../common/Button";
import styles from "./styles.module.css";
import Column from "../Column";
import PropTypes from "prop-types";
import Task from "../Task";
import ColumnFormModal from "../ColumnForm";
import Dialog from "@mui/material/Dialog";
import AddIcon from "@mui/icons-material/Add";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";

export default function Board({ board }) {
  const [columns, setColumns] = useState(board.columns);
  const [tasks, setTasks] = useState(board.tasks);

  const [activeTask, setActiveTask] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    console.log(board);
  }, [board]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const editColumn = (column) => {
    console.log(column);
    // Logica para editar colunas
  };

  const createColumn = (column) => {
    console.log(column);
    // Logica para criar colunas
  };

  const deleteColumn = (id) => {
    console.log(id);
    // Logica para deletar colunas
  };

  const editTask = (task) => {
    console.log(task);
    // Logica para editar tarefas
  };

  const createTask = (task) => {
    console.log(task);
    // Logica para criar tarefas
  };

  const deleteTask = (id) => {
    console.log(id);
    // Logica para deletar tarefas
  };

  return columns && tasks ? (
    <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div className={styles.board}>
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
        <DragOverlay>{activeTask && <Task task={activeTask} />}</DragOverlay>,
        document.body
      )}
    </DndContext>
  ) : (
    ""
  );

  function onDragStart(event) {
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  async function onDragEnd(event) {
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) {
      return;
    } else if (isActiveATask) {
      if (isActiveATask && isOverATask) {
        setTasks(
          (tasks) => {
            const activeIndex = tasks.findIndex((t) => t.id === activeId);
            const overIndex = tasks.findIndex((t) => t.id === overId);

            if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
              tasks[activeIndex].columnId = tasks[overIndex].columnId;
              return arrayMove(tasks, activeIndex, overIndex - 1);
            }

            return arrayMove(tasks, activeIndex, overIndex);
          },
          () => {}
        );

        var updatedColumns = columns;

        updatedColumns.forEach((column) => {
          const filteredTasks = tasks.filter(
            (task) => task.columnId === column.id
          );
          const taskIds = filteredTasks.map((task) => task.id);
          column.taskIds = taskIds;
        });

        setColumns(updatedColumns);
      }
    }
  }
}

Board.propTypes = {
  board: PropTypes.object.isRequired,
};
