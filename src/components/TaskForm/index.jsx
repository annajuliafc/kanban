import "./styles.css";
import Input from "../common/Input";
import Button from "../common/Button";
import PropTypes from "prop-types";
import Textarea from "../common/Textarea";
import TagInsert from "../TagsInsert";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import { Chip, Stack } from "@mui/material";

export default function TaskForm({
  editTask,
  deleteTask,
  createTask,
  task,
  columnId,
  color,
}) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [tags, setTags] = useState(task?.tags || []);

  var id;
  task ? (id = task.id) : (id = null);

  const buttonCssStyle = {
    background: "#662549",
    border: "2px solid #662549",
    color: "white",
    fontFamily: "AvenirNext",
    fontSize: "16px",
    borderRadius: "8px",
    padding: "16px",
    float: "right",
  };

  const deleteButtonCssStyle = {
    background: "none",
    border: "2px solid #662549",
    color: "#662549",
    fontFamily: "AvenirNext",
    fontSize: "16px",
    borderRadius: "8px",
    padding: "16px",
    float: "right",
  };

  const iconCss = {
    float: "right",
    marginLeft: "8px",
    marginBottom: "-4px",
  };

  const updateTags = (event) => {
    setTags((tags) => [...tags, event]);
  };

  const deleteTag = (tagToDelete) => () => {
    setTags(
      tags.filter((tag) => {
        return tag !== tagToDelete;
      })
    );
  };

  const onSave = (event) => {
    event.preventDefault();
    editTask
      ? editTask({
          id,
          columnId,
          title,
          description,
          tags,
        })
      : createTask({
          id,
          columnId,
          title,
          description,
          tags,
        });
    setTitle("");
    setDescription("");
    setTags([]);
  };

  const taskDelete = () => {
    deleteTask(task.id);
  };

  return (
    <form className="form" onSubmit={onSave}>
      {editTask ? (
        <h2>Vizualizar tarefa</h2>
      ) : (
        <h2>Preencha os dados para criar uma tarefa</h2>
      )}
      <Input
        required={true}
        label="Título"
        placeholder="Digite seu título"
        value={title}
        changed={(value) => setTitle(value)}
      />
      <Textarea
        label="Descrição"
        placeholder="Digite sua descrição"
        value={description}
        changed={(value) => setDescription(value)}
      />
      <TagInsert updateTags={updateTags} />
      <Stack direction="row" spacing={1}>
        {tags.map((tag, index) => (
          <Chip
            key={index}
            label={tag}
            onDelete={deleteTag(tag)}
            deleteIcon={<DeleteIcon />}
            style={{
              backgroundColor: `${color}`,
              color: "white",
              fontFamily: "AvenirNext",
            }}
          />
        ))}
      </Stack>
      <div className="form-action">
        {editTask ? (
          <Button
            buttonCssStyle={deleteButtonCssStyle}
            type="button"
            text="Excluir"
            icon={<DeleteIcon sx={{ color: "#662549" }} fontSize="small" />}
            iconCss={iconCss}
            clickFunction={taskDelete}
          />
        ) : (
          ""
        )}
        <Button
          buttonCssStyle={buttonCssStyle}
          iconCss={iconCss}
          icon={
            editTask ? (
              <EditIcon sx={{ color: "white" }} fontSize="small" />
            ) : (
              <SaveIcon sx={{ color: "white" }} fontSize="small" />
            )
          }
          text={editTask ? "Editar" : "Salvar"}
        />
      </div>
    </form>
  );
}

TaskForm.propTypes = {
  editTask: PropTypes.func,
  deleteTask: PropTypes.func,
  createTask: PropTypes.func,
  task: PropTypes.object,
  columnId: PropTypes.string.isRequired,
  color: PropTypes.string,
};
