import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import { useRef, KeyboardEvent } from "react";

export type SubTaskFormProps = {
  isEdit?: boolean;
  currentValue?: string;
  onAdd: (value: string) => void;
  onCancel?: () => void;
};

export default function SubTaskForm({
  onAdd,
  onCancel,
  isEdit = false,
}: SubTaskFormProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyUp = (
    e: KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const value = inputRef?.current?.value;
    if (e.key === "Enter" && value) {
      onAdd(value);
      inputRef.current.value = "";
    } else if (e.key === "Escape") {
      if (isEdit) {
        // revert changes
        onCancel && onCancel();
      } else if (value) {
        inputRef.current.value = "";
      }
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
        className={`${isEdit ? 'bg-transparent shadow-none' : ''}`}
      >
      {!isEdit && (
        <IconButton sx={{ p: "10px" }} aria-label="menu">
          <AddIcon />
        </IconButton>
      )}
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        inputRef={inputRef}
        onKeyUp={handleKeyUp}
        placeholder="Subtask"
        inputProps={{ "aria-label": "Subtask" }}
      />
    </Paper>
  );
}
