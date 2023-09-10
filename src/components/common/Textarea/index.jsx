import "./styles.css";
import PropTypes from "prop-types";

export default function Textarea({ label, value, placeholder, changed, required = false }) {
  const typing = (event) => {
    changed(event.target.value);
  };

  return (
    <div className={`textarea`}>
      <label>{label}</label>
      <textarea
        rows="4"
        cols="50"
        placeholder={placeholder}
        value={value}
        onChange={typing}
        required={required}
      />
    </div>
  );
}

Textarea.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  changed: PropTypes.func.isRequired,
  required: PropTypes.bool,
};
