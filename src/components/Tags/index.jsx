import "./styles.css";
import PropTypes from "prop-types";
import Tag from "../common/Tag";

export default function Tags({ tags, color }) {
    
  return (
    <div className="tags">
      {tags.map((tag, index) => (
        <Tag key={index} text={tag} color={color} />
      ))}
    </div>
  );
}

Tags.propTypes = {
  tags: PropTypes.array,
  color: PropTypes.string,
};
