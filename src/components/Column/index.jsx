import "./styles.css";
import React, { useMemo } from "react";
import Task from "../Task";
import Button from "../common/Button";
import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import TaskForm from "../TaskForm";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ColumnFormModal from "../ColumnForm";
import { SortableContext } from "@dnd-kit/sortable";
import { IconButton, Tooltip } from "@mui/material";

export default function Column({
  column,
  title,
  color,
  tasks,
  editTask,
  deleteTask,
  createTask,
  editColumn,
  deleteColumn,
}) {
  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const [openTaskForm, setOpenTaskForm] = React.useState(false);
  const [openColumnForm, setOpenColumnForm] = React.useState(false);

  const taskFormDialogOpen = () => {
    setOpenTaskForm(true);
  };

  const taskFormDialogClose = () => {
    setOpenTaskForm(false);
  };

  const columnFormDialogOpen = () => {
    setOpenColumnForm(true);
  };

  const columnFormDialogClose = () => {
    setOpenColumnForm(false);
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
        <Tooltip title="Abrir coluna" className="column-action">
          <IconButton onClick={columnFormDialogOpen}>
            <MoreVertIcon sx={{ marginTop: "-8px" }} />
          </IconButton>
        </Tooltip>
        <h2 className="column-title">{title}</h2>
        <SortableContext items={tasksIds} id={column.id}>
          <div className="tasks">
            {tasks.map((task) => (
              <Task
                key={task.id}
                task={task}
                color={color}
                deleteTask={deleteTask}
                editTask={editTask}
              />
            ))}
          </div>
        </SortableContext>
      </div>
      <Button
        text="Adicionar outro cartão"
        icon={<AddIcon sx={{ color: "rgba(255, 255, 255, 0.8)" }} />}
        buttonCssStyle={buttonCssStyle}
        clickFunction={taskFormDialogOpen}
      />
      <Dialog open={openTaskForm} onClose={taskFormDialogClose} fullWidth={true} maxWidth="sm">
        <TaskForm
          createTask={createTask}
          columnId={column.id}
          color={color}
        ></TaskForm>
      </Dialog>
      <Dialog open={openColumnForm} onClose={columnFormDialogClose} fullWidth={true} maxWidth="sm">
        <ColumnFormModal
          editColumn={editColumn}
          deleteColumn={deleteColumn}
          column={column}
        />
      </Dialog>
    </section>
  );
}

Column.propTypes = {
  column: PropTypes.object,
  title: PropTypes.string.isRequired,
  color: PropTypes.string,
  tasks: PropTypes.array.isRequired,
  editTask: PropTypes.func,
  deleteTask: PropTypes.func,
  createTask: PropTypes.func,
  editColumn: PropTypes.func,
  deleteColumn: PropTypes.func,
};
