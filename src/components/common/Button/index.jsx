import "./styles.css";
import PropTypes from "prop-types";

export default function Button({
  buttonClassStyle,
  buttonCssStyle,
  text,
  icon,
  iconCss,
  clickFunction,
  type,
}) {
  return (
    <button
      className={buttonClassStyle}
      style={buttonCssStyle}
      onClick={clickFunction}
      type={type}
    >
      {icon ? <span style={iconCss}>{icon}</span> : ""}
      {text}
    </button>
  );
}

Button.propTypes = {
  buttonClassStyle: PropTypes.string,
  buttonCssStyle: PropTypes.object,
  text: PropTypes.string,
  icon: PropTypes.object,
  iconCss: PropTypes.object,
  clickFunction: PropTypes.func,
  type: PropTypes.string,
};
