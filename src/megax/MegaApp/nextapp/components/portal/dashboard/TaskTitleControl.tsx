import TextField from "@mui/material/TextField";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";

export type TitleControlProps = {
  title: string;
  readonly: boolean;
  onOk: (value: string) => void;
};

export default function TaskTitleControl({ title, readonly, onOk }: TitleControlProps) {
  const [isEdit, setEdit] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>();

  const toggleEdit = () => {
    !readonly && setEdit(prev => !prev);
  };

  useEffect(() => {
    if (isEdit && inputRef?.current != null) {
      const input = inputRef.current;
      const value = input.value;

      input.focus();
      input.setSelectionRange(value.length, value.length);
    }
  }, [isEdit])

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
              autoFocus
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
          className={`${readonly ? '' : 'hover:bg-slate-200 cursor-pointer'} py-1 rounded mx-[-4px] px-[4px]`}
          onClick={toggleEdit}
        >
          {title}
        </div>
      )}
    </>
  );
}
