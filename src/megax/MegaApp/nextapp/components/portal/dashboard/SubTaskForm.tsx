import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import { useRef, KeyboardEvent, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

export type SubTaskFormProps = {
  id: number;
  taskId: number;
  isEdit?: boolean;
  currentValue?: string;
  onOk: (value: string) => void;
  onCancel?: () => void;
};

export default function SubTaskForm({
  id,
  taskId,
  currentValue,
  isEdit = false,
  onOk: onAdd,
  onCancel,
}: SubTaskFormProps) {
  const fieldName = `title-${taskId}-${id}`;
  const { control, reset, getValues } =
    useForm({
      defaultValues: {
        [fieldName]: "",
      },
      values: {
        [fieldName]: currentValue,
      },
    });

  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyUp = (
    e: KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const value = getValues(fieldName);
    if (e.key === "Enter" && value) {
      onAdd(value);
      isEdit ? onCancel && onCancel() : reset()
    } else if (e.key === "Escape") {
      if (isEdit) {
        // revert changes
        onCancel && onCancel();
      } else if (value) {
        reset();
      }
    }
  };

  useEffect(() => {
    if (isEdit) {
      inputRef?.current?.focus()
    }
  }, [id]);

  return (
    <Paper
      component="div"
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: "100%",
      }}
      className={`${isEdit ? "shadow-none px-0" : ""}`}
    >
      {!isEdit && (
        <IconButton sx={{ p: "10px" }} aria-label="menu">
          <AddIcon />
        </IconButton>
      )}

      <Controller
        name={fieldName}
        control={control}
        render={({ field }) => (
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            inputRef={inputRef}
            onKeyUp={handleKeyUp}
            placeholder="Sub task"
            inputProps={{ "aria-label": "Sub task" }}
            className={`${isEdit ? 'px-0 ms-0' : ''}`}
            {...field}
            onBlur={() => onCancel && onCancel()}
          />
        )}
      />
    </Paper>
  );
}
