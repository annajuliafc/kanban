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
import useBoardContext from "../../context/BoardContext/useBoardContext";

export default function TaskForm({ task, columnId, color }) {
  const { createTask, editTask, deleteTask } = useBoardContext();
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [tags, setTags] = useState(task?.tags || []);

  var id;
  task ? (id = task.id) : (id = null);

  const buttonCssStyle = {
    background: "#662549",
    border: "2px solid #662549",
    color: "white",
    fontSize: "16px",
    borderRadius: "8px",
    padding: "16px",
    float: "right",
  };

  const deleteButtonCssStyle = {
    background: "none",
    border: "2px solid #662549",
    color: "#662549",
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
    task
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
    !task && setTitle("");
    !task && setDescription("");
    !task && setTags([]);
  };

  return (
    <form className="form" onSubmit={onSave}>
      {task ? (
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
        {task ? (
          <Button
            buttonCssStyle={deleteButtonCssStyle}
            type="button"
            text="Excluir"
            icon={<DeleteIcon sx={{ color: "#662549" }} fontSize="small" />}
            iconCss={iconCss}
            clickFunction={() => deleteTask(task.id)}
          />
        ) : (
          ""
        )}
        <Button
          buttonCssStyle={buttonCssStyle}
          iconCss={iconCss}
          icon={
            task ? (
              <EditIcon sx={{ color: "white" }} fontSize="small" />
            ) : (
              <SaveIcon sx={{ color: "white" }} fontSize="small" />
            )
          }
          text={task ? "Editar" : "Salvar"}
        />
      </div>
    </form>
  );
}

TaskForm.propTypes = {
  task: PropTypes.object,
  columnId: PropTypes.string.isRequired,
  color: PropTypes.string,
};
