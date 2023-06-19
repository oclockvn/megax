import { debounce, TextField } from "@mui/material";
import { Stack } from "@mui/system";
import { useState } from "react";
import ShowListUsers from "./ShowListUsers";
import ShowSearchUsers from "./ShowSearchUsers";

function UserPage() {
  const [keyword, setKeyword] = useState("");

  const handleSearch = debounce(event => {
    const term = event.target.value;
    setKeyword(term);
  }, 500);

  return (
    <Stack spacing={2} sx={{ width: "100%" }} className="text-center">
      UserPage
      <TextField
        id="outlined-basic"
        label="Search"
        variant="outlined"
        className="w-4/12"
        onChange={event => handleSearch(event)}
      />
      {keyword !== "" ? (
        <ShowSearchUsers keyword={keyword} />
      ) : (
        <ShowListUsers />
      )}
    </Stack>
  );
}

export default UserPage;
