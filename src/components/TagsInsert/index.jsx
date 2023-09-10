import "./styles.css";
import Input from "../common/Input";
import Button from "../common/Button";
import { useState } from "react";
import PropTypes from "prop-types";
import PlusIcon from "../../assets/icons/plus.png";

export default function TagInsert({ updateTags }) {
  const [tag, setTag] = useState("");

  const buttonCssStyle = {
    background: "none",
    border: "none",
    color: "black",
    fontFamily: "AvenirNext",
    fontSize: "12px",
    padding: "12px",
    margin: "24px",
  };

  const tagInsert = () => {
    updateTags(tag);
  };

  return (
    <div className="tag-insert">
      <div className="tag-input">
        <Input
          label="Tag"
          placeholder="Digite sua tag"
          value={tag}
          changed={(value) => setTag(value)}
        />
      </div>
      <div className="tag-button">
        <Button
          buttonCssStyle={buttonCssStyle}
          clickFunction={tagInsert}
          icon={PlusIcon}
          type="button"
        />
      </div>
    </div>
  );
}

TagInsert.propTypes = {
  updateTags: PropTypes.func.isRequired,
};
