import "./styles.css";
import Input from "../common/Input";
import PropTypes from "prop-types";
import AddIcon from '@mui/icons-material/Add';
import { useState } from "react";
import { IconButton, Tooltip } from "@mui/material";

export default function TagInsert({ updateTags }) {
  const [tagInput, setTagInput] = useState("");

  const handleTagInsert = () => {
    updateTags(tagInput);
  };

  return (
    <div className="tag-insert">
      <div className="tag-input">
        <Input
          label="Tags"
          type="text"
          placeholder="Digite suas tags"
          value={tagInput}
          changed={(value) => setTagInput(value)}
        />
      </div>
      <div className="tag-button">
        <Tooltip title="Adicionar tag">
          <IconButton onClick={handleTagInsert}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
}

TagInsert.propTypes = {
  updateTags: PropTypes.func.isRequired,
};
