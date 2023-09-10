import "./styles.css";
import PropTypes from "prop-types";
import { useSortable } from "@dnd-kit/sortable";
import Tags from "../Tags";
import { IconButton, Tooltip } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

export default function Task({ color, task, deleteTask }) {
  const { setNodeRef, attributes, listeners } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  });

  const taskDelete = () => {
    deleteTask(task.id);
  };

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} className="task">
      <Tooltip title="Delete">
        <IconButton onClick={taskDelete}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
      <h3 className="task-title">{task.title}</h3>
      <Tags tags={task.tags} color={color}></Tags>
    </div>
  );
}

Task.propTypes = {
  color: PropTypes.string,
  task: PropTypes.object.isRequired,
  deleteTask: PropTypes.func,
};
