import "./styles.css";
import { useState } from "react";
import PropTypes from "prop-types";
import Input from "../common/Input";
import Button from "../common/Button";

export default function ColumnForm({ updateColumns, column }) {
  const [title, setTitle] = useState(column?.title || "");
  const [color, setColor] = useState(column?.color || "#ff0000");
  var id;
  column ? (id = column.id) : (id = null);

  const buttonCssStyle = {
    background: "#662549",
    border: "none",
    color: "white",
    fontFamily: "AvenirNext",
    fontSize: "16px",
    borderRadius: "4px",
    padding: "16px",
    float: 'right'
  };

  const onSave = (event) => {
    event.preventDefault();
    updateColumns({
      id,
      title,
      color,
    });
  };

  return (
    <form className="form" onSubmit={onSave}>
      <h2>Preencha os dados para criar uma nova coluna de tarefas</h2>
      <Input
        required={true}
        label="Título"
        placeholder="Digite o título da coluna"
        value={title}
        changed={(value) => setTitle(value)}
      />
      <Input
        required
        type="color"
        label="Cor da coluna"
        placeholder="Selecione a cor da coluna"
        value={color}
        changed={(value) => setColor(value)}
      />
      <Button
        buttonCssStyle={buttonCssStyle}
        text="Salvar"
      />
    </form>
  );
}

ColumnForm.propTypes = {
  updateColumns: PropTypes.func.isRequired,
  column: PropTypes.object,
};
