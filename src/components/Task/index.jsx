import "./styles.css";
import PropTypes from "prop-types";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import Tags from "../Tags";
import TaskForm from "../TaskForm";
import { useSortable } from "@dnd-kit/sortable";
import { Dialog, IconButton, Tooltip } from "@mui/material";
import { useState } from "react";

export default function Task({ color, task, editTask, deleteTask }) {
  const { setNodeRef, attributes, listeners } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  });

  const [open, setOpen] = useState(false);

  const taskFormDialogOpen = () => {
    setOpen(true);
  };

  const taskFormDialogClose = () => {
    setOpen(false);
  };

  return (
    <div className="task">
      <Tooltip title="Abrir tarefa" className="task-action">
        <IconButton onClick={taskFormDialogOpen}>
          <OpenInFullIcon fontSize="small"/>
        </IconButton>
      </Tooltip>
      <div ref={setNodeRef} {...attributes} {...listeners}>
        <h3 className="task-title">{task.title}</h3>
        <Tags tags={task.tags} color={color}></Tags>
      </div>
      <Dialog open={open} onClose={taskFormDialogClose} fullWidth={true} maxWidth="sm">
        <TaskForm
          editTask={editTask}
          deleteTask={deleteTask}
          columnId={task.columnId}
          color={color}
          task={task}
        ></TaskForm>
      </Dialog>
    </div>
  );
}

Task.propTypes = {
  color: PropTypes.string,
  task: PropTypes.object.isRequired,
  deleteTask: PropTypes.func,
  editTask: PropTypes.func,
};
