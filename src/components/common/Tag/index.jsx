import "./styles.css";
import PropTypes from "prop-types";

export default function Tag({ color, text }) {
  return (
    <h5
      className="tag"
      style={{
        background: color,
      }}
    >
      {text}
    </h5>
  );
}

Tag.propTypes = {
  color: PropTypes.string,
  text: PropTypes.string.isRequired,
};
