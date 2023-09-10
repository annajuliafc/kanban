import "./styles.css";
import PropTypes from "prop-types";

export default function Input({
  type = "text",
  label,
  placeholder,
  value,
  changed,
  required = false,
}) {
  const typing = (event) => {
    changed(event.target.value);
  };

  return (
    <div className={`input input-${type}`}>
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={typing}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}

Input.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  changed: PropTypes.func.isRequired,
  required: PropTypes.bool,
};
