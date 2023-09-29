import TextField from "@mui/material/TextField";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { useRef, useState } from "react";
import Button from "@mui/material/Button";

export type TitleControlProps = {
  title: string;
  onOk: (value: string) => void;
};

export default function TaskTitleControl({ title, onOk }: TitleControlProps) {
  const [isEdit, setEdit] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>();

  const toggleEdit = () => {
    setEdit(prev => !prev);
  };

  const handleOk = () => {
    const text = inputRef?.current?.value;
    if (!text) {
      return;
    }

    onOk(text);
    toggleEdit();
  };

  return (
    <>
      {isEdit ? (
        <>
          <div className="relative">
            <TextField
              inputRef={inputRef}
              defaultValue={title}
              multiline
              fullWidth
              variant="standard"
            />
            <div className="absolute top-full right-0 z-10 flex gap-1 items-center py-1">
              <Button
                size="small"
                variant="contained"
                className="!px-2 min-w-fit"
                color="success"
                onClick={handleOk}
              >
                <DoneIcon fontSize="small" />
              </Button>
              <Button
                size="small"
                variant="contained"
                className="!px-2 min-w-fit"
                color="warning"
                onClick={toggleEdit}
              >
                <CloseIcon fontSize="small" />
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div
          className="hover:bg-slate-200 cursor-pointer py-1"
          onClick={toggleEdit}
        >
          {title}
        </div>
      )}
    </>
  );
}
