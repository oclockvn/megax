import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import ClearIcon from "@mui/icons-material/Clear";
import { useCallback, useState } from "react";
const throttle = require("lodash/throttle");

export default function CommonSearch({
  handleSearch,
  keypress,
  placeholder,
  label,
}: {
  handleSearch: (keyword: string) => void;
  keypress?: boolean;
  placeholder?: string;
  label?: string;
}) {
  const [value, setValue] = useState("");

  const handleInternal = !keypress ? handleSearch : useCallback(
    throttle((q: string) => handleSearch(q), 200), []
  )

  const onSearch = (
    ev: React.KeyboardEvent & React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!!keypress || ev.key === "Enter") {
      handleInternal(value?.trim());
    }
  };

  return (
    <TextField
      label={label || "Search"}
      variant="outlined"
      value={value}
      onChange={e => setValue(e.target.value)}
      placeholder={placeholder || "Type search term and enter to search"}
      className="min-w-[400px]"
      onKeyUp={onSearch}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => {
                handleSearch("");
                setValue("");
              }}
              edge="end"
            >
              <ClearIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}
