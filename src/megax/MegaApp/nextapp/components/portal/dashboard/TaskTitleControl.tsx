import TextField from "@mui/material/TextField";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useRef, useState, KeyboardEvent } from "react";
import Button from "@mui/material/Button";
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

export type TitleControlProps = {
  title: string;
  readonly: boolean;
  onOk: (value: string) => void;
  onEditing?: (editing: boolean) => void;
};

export default function TaskTitleControl({
  title,
  readonly,
  onOk,
  onEditing,
}: TitleControlProps) {
  const [isEdit, setEdit] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>();

  const toggleEdit = () => {
    if (readonly) {
      return;
    }

    setEdit(prev => !prev);
    onEditing && onEditing(!isEdit);
  };

  useEffect(() => {
    if (isEdit && inputRef?.current != null) {
      const input = inputRef.current;
      const value = input.value;

      input.focus();
      input.setSelectionRange(value.length, value.length);
    }
  }, [isEdit]);

  const handleOk = () => {
    const text = inputRef?.current?.value;
    if (!text) {
      return;
    }

    onOk(text);
    toggleEdit();
  };

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement | HTMLInputElement | HTMLDivElement>) => {
    if (e.key.toLowerCase() === 'escape') {
      toggleEdit();
    }
  }

  return (
    <div className="flex items-center gap-2">
      <FormatQuoteIcon fontSize="small" color="info" />
      {isEdit ? (
        <>
          <div className="relative flex-1">
            <TextField
              inputRef={inputRef}
              autoFocus
              defaultValue={title}
              multiline
              fullWidth
              variant="standard"
              onKeyUp={e => handleKey(e)}
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
          className={`${
            readonly ? "" : "hover:bg-slate-200 cursor-pointer flex-[1]"
          } py-1 rounded mx-[-4px] px-[4px]`}
          onClick={() => !readonly && toggleEdit()}
        >
          {title}
        </div>
      )}
    </div>
  );
}
