import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import ClearIcon from "@mui/icons-material/Clear";
import { useState } from "react";
const debounce = require("lodash/debounce");

export default function CommonSearch({
  handleSearch,
  keypress,
}: {
  handleSearch: (keyword: string) => void;
  keypress?: boolean;
}) {
  const [value, setValue] = useState("");

  let onSearch = (
    ev: React.KeyboardEvent & React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!!keypress || ev.key === "Enter") {
      handleSearch(value?.trim());
    }
  };

  if (!!keypress) {
    onSearch = debounce(onSearch, 250);
  }

  return (
    <TextField
      label="Search"
      variant="outlined"
      value={value}
      onChange={e => setValue(e.target.value)}
      placeholder="Type search term and enter to search"
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
