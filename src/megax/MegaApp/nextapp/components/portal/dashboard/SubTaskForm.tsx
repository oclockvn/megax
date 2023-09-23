import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import { useRef, KeyboardEvent } from "react";

export default function SubTaskForm({
  onAdd,
}: {
  onAdd: (value: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleEnter = (
    e: KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const value = inputRef?.current?.value;
    if (e.key === "Enter" && !!value) {
      onAdd(value);
      inputRef.current.value = "";
    }
  };

  return (
    <Paper
      component="div"
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: "100%",
      }}
    >
      <IconButton sx={{ p: "10px" }} aria-label="menu">
        <AddIcon />
      </IconButton>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        inputRef={inputRef}
        onKeyUp={handleEnter}
        placeholder="Subtask"
        inputProps={{ "aria-label": "Subtask" }}
      />
    </Paper>
  );
}
