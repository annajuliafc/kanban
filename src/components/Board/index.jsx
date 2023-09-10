import React, { useEffect, useState } from "react";
import Button from "../common/Button";
import styles from "./styles.module.css";
import Column from "../Column";
import PlusIcon from "../../assets/icons/plus.png";
import PropTypes from "prop-types";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import Task from "../Task";
import axios from "axios";
import ColumnFormModal from "../ColumnForm";
import Dialog from "@mui/material/Dialog";

export default function Board({ board }) {
  const [columns, setColumns] = useState(board.columns);
  const [tasks, setTasks] = useState([]);

  const [activeTask, setActiveTask] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setColumns(board.columns);
    setTasks(board.columns.flatMap((column) => column.tasks));
  }, [board]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const updateTasks = (updatedTask) => {
    const updatedTasks = tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
    setTasks(updatedTasks);
    axios.put(`http://localhost:3000/tasks/${updatedTask.id}`, updatedTask);
  };

  const createTask = (columnId) => {
    const newTask = {
      id: tasks.length + 1,
      columnId,
      title: `Task ${tasks.length + 1}`,
      description: "",
      tags: [],
    };
    setTasks([...tasks, newTask]);
  };

  const deleteTask = (id) => {
    axios.delete(`http://localhost:3000/tasks/${id}`);
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
  };

  const onDragStart = (event) => {
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
    }
  };

  const onDragEnd = (event) => {
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
        setTasks((currentTasks) => {
          const activeIndex = currentTasks.findIndex((t) => t.id === activeId);
          const overIndex = currentTasks.findIndex((t) => t.id === overId);

          if (currentTasks[activeIndex].columnId !== currentTasks[overIndex].columnId) {
            currentTasks[activeIndex].columnId = currentTasks[overIndex].columnId;
            return arrayMove(currentTasks, activeIndex, overIndex - 1);
          }

          return arrayMove(currentTasks, activeIndex, overIndex);
        });
      }

      const isOverAColumn = over.data.current?.type === "Column";

      if (isActiveATask && isOverAColumn) {
        setTasks((currentTasks) => {
          const activeIndex = currentTasks.findIndex((t) => t.id === activeId);
          currentTasks[activeIndex].columnId = overId;
          return arrayMove(currentTasks, activeIndex, activeIndex);
        });
      }
    }
  };

  return (
    <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div className={styles.board}>
        {columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            title={column.title}
            color={column.color}
            tasks={tasks.filter((task) => task.columnId === column.id)}
            updateTask={updateTasks}
            deleteTask={deleteTask}
          />
        ))}
        <Button
          buttonClassStyle={styles.buttonStyle}
          text="Adicionar outra coluna"
          icon={PlusIcon}
          clickFunction={handleClickOpen}
        />
        <Dialog open={open} onClose={handleClose}>
          <ColumnFormModal updateColumns={updateColumns} />
        </Dialog>
      </div>
      {createPortal(
        <DragOverlay>
          {activeTask && <Task task={activeTask} deleteTask={deleteTask} />}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}

Board.propTypes = {
  board: PropTypes.object.isRequired,
};
