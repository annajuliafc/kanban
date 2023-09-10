import React, { useMemo } from "react";
import Task from "../Task";
import Button from "../common/Button";
import WhitePlusIcon from "../../assets/icons/white-plus.png";
import "./styles.css";
import PropTypes from "prop-types";
import { SortableContext } from "@dnd-kit/sortable";
import Dialog from "@mui/material/Dialog";
import TaskForm from "../TaskForm";

export default function Column({
  column,
  title,
  color,
  tasks,
  updateTask,
  deleteTask,
}) {
  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const buttonCssStyle = {
    background: "none",
    border: "none",
    color: "rgba(255, 255, 255, 0.8)",
    fontFamily: "AvenirNext",
    fontSize: "16px",
    textAlignLast: "start",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  return (
    <section
      className="column"
      style={{ background: `${color}CC`, borderTop: `5px solid ${color}` }}
    >
      <div>
        <h2 className="column-title">{title}</h2>
        <SortableContext items={tasksIds}>
          <div className="tasks">
            {tasks.map((task) => (
              <Task
                key={task.id}
                task={task}
                color={color}
                deleteTask={deleteTask}
              />
            ))}
          </div>
        </SortableContext>
      </div>
      <Button
        text="Adicionar outro cartão"
        icon={WhitePlusIcon}
        buttonCssStyle={buttonCssStyle}
        clickFunction={handleClickOpen}
      />
      <Dialog open={open} onClose={handleClose}>
        <TaskForm
          updateTask={updateTask}
          columnId={column.id}
          color={color}
        ></TaskForm>
      </Dialog>
    </section>
  );
}

Column.propTypes = {
  column: PropTypes.object,
  title: PropTypes.string.isRequired,
  color: PropTypes.string,
  tasks: PropTypes.array.isRequired,
  updateTask: PropTypes.func.isRequired,
  deleteTask: PropTypes.func.isRequired,
};
