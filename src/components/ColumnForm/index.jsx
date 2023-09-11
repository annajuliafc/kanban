import "./styles.css";
import PropTypes from "prop-types";
import Input from "../common/Input";
import Button from "../common/Button";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";

export default function ColumnForm({
  editColumn,
  deleteColumn,
  createColumn,
  column,
}) {
  const [title, setTitle] = useState(column?.title || "");
  const [color, setColor] = useState(column?.color || "#0000ff");
  const [taskIds, setTaskIds] = useState(column?.taskIds || []);

  let id = null;
  if (column) {
    id = column.id;
  }

  const buttonCssStyle = {
    background: "#662549",
    border: "none",
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

  const onSave = (event) => {
    event.preventDefault();
    editColumn
      ? editColumn({
          id,
          title,
          color,
          taskIds,
        })
      : createColumn({
          id,
          title,
          color,
          taskIds,
        });
    setTitle("");
    setColor("#0000ff");
    setTaskIds([]);
  };

  const columnDelete = () => {
    deleteColumn(column.id);
  };

  return (
    <form className="form" onSubmit={onSave}>
      {editColumn ? (
        <h2>Vizualizar coluna</h2>
      ) : (
        <h2>Preencha os dados para criar uma nova coluna de tarefas</h2>
      )}
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
      <div className="form-action">
        {editColumn ? (
          <Button
            buttonCssStyle={deleteButtonCssStyle}
            type="button"
            text="Excluir"
            icon={<DeleteIcon sx={{ color: "#662549" }} fontSize="small" />}
            iconCss={iconCss}
            clickFunction={columnDelete}
          />
        ) : (
          ""
        )}
        <Button
          buttonCssStyle={buttonCssStyle}
          iconCss={iconCss}
          icon={
            editColumn ? (
              <EditIcon sx={{ color: "white" }} fontSize="small" />
            ) : (
              <SaveIcon sx={{ color: "white" }} fontSize="small" />
            )
          }
          text={editColumn ? "Editar " : "Salvar "}
        />
      </div>
    </form>
  );
}

ColumnForm.propTypes = {
  editColumn: PropTypes.func,
  deleteColumn: PropTypes.func,
  createColumn: PropTypes.func,
  column: PropTypes.object,
};
