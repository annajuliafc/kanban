import "./styles.css";
import Input from "../common/Input";
import Button from "../common/Button";
import { useState } from "react";
import PropTypes from "prop-types";
import Textarea from "../common/Textarea";
import TagInsert from "../TagsInsert";
import Tags from "../Tags";

export default function TaskForm({ updateTask, task, columnId, color }) {
  const [title, setTitle] = useState(task?.title || "");
  const [descrption, setDescription] = useState(task?.descrption || "");
  const [tags, setTags] = useState(task?.tags || []);

  var id;
  task ? (id = task.id) : (id = null);

  const buttonCssStyle = {
    background: "#662549",
    border: "none",
    color: "white",
    fontFamily: "AvenirNext",
    fontSize: "16px",
    borderRadius: "4px",
    padding: "16px",
    float: "right",
  };

  const onSave = (event) => {
    event.preventDefault();
    updateTask({
      id,
      columnId,
      title,
      descrption,
      tags,
    });
  };

  const updateTags = (event) => {
    setTags((tags) => [...tags, event]);
    console.log('settagss', tags);
  };

  return (
    <form className="form" onSubmit={onSave}>
      <h2>Preencha os dados para criar uma task</h2>
      <Input
        required={true}
        label="Título"
        placeholder="Digite seu título"
        value={title}
        changed={(value) => setTitle(value)}
      />
      <Textarea
        required={true}
        label="Descrição"
        placeholder="Digite sua descrição"
        value={descrption}
        changed={(value) => setDescription(value)}
      />
      <TagInsert updateTags={updateTags} />
      <Tags tags={tags} color={color}></Tags>
      <Button
        buttonCssStyle={buttonCssStyle}
        text="Salvar"
        clickFunction={() => {
          console.log("funfou");
        }}
      />
    </form>
  );
}

TaskForm.propTypes = {
  updateTask: PropTypes.func.isRequired,
  task: PropTypes.object,
  columnId: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};
