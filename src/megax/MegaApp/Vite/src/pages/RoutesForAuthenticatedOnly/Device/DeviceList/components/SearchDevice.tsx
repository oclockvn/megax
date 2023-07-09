import { IconButton, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import ClearIcon from "@mui/icons-material/Clear";

function SearchDevice({
  handleSearch,
}: {
  handleSearch: (keyword: string) => void;
}) {
  const [value, setValue] = useState("");
  const onSearch = (
    event: React.KeyboardEvent & React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      handleSearch(value?.trim());
    }
  };

  return (
    <TextField
      label="Search"
      variant="outlined"
      value={value}
      onChange={event => setValue(event.target.value)}
      placeholder="Type search term and enter to search"
      onKeyUp={onSearch}
      className="!min-w-[400px]"
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
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

export default SearchDevice;
