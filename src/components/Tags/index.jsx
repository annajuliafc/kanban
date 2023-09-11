import "./styles.css";
import PropTypes from "prop-types";
import { Chip, Stack } from "@mui/material";

export default function Tags({ tags, color }) {
  return (
    <div className="tags">
      <Stack direction="row" spacing={1}>
        {tags.map((tag, index) => (
          <Chip
            key={index}
            label={tag}
            style={{ backgroundColor: `${color}`, color: "white", fontFamily: 'AvenirNext' }}
          />
        ))}
      </Stack>
    </div>
  );
}

Tags.propTypes = {
  tags: PropTypes.array,
  color: PropTypes.string,
};
