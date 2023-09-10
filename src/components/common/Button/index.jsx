import "./styles.css";
import PropTypes from "prop-types";

export default function Button({
  buttonClassStyle,
  buttonCssStyle,
  text,
  icon,
  clickFunction,
  type
}) {
  return (
    <button className={buttonClassStyle} style={buttonCssStyle} onClick={clickFunction} type={type}>
      {icon ? (
        <span>
          <img src={icon} alt={text} />
        </span>
      ) : (
        ""
      )}
      {text}
    </button>
  );
}

Button.propTypes = {
  buttonClassStyle: PropTypes.string,
  buttonCssStyle: PropTypes.object,
  text: PropTypes.string,
  icon: PropTypes.string,
  clickFunction : PropTypes.func,
  type: PropTypes.string
};
