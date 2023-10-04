import TextField from "@mui/material/TextField";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";

export type ProjectControlProps = {
  projectId?: number;
  projectName?: string;
  readonly: boolean;
  onOk: (value: string) => void;
};

export default function TaskProjectControl({
  projectId,
  projectName,
  readonly,
  onOk,
}: ProjectControlProps) {
  const [isEdit, setEdit] = useState(false);
  // const inputRef = useRef<HTMLTextAreaElement>();

  const toggleEdit = () => {
    !readonly && setEdit(prev => !prev);
  };

  // useEffect(() => {
  //   if (isEdit && inputRef?.current != null) {
  //     const input = inputRef.current;
  //     const value = input.value;

  //     input.focus();
  //     input.setSelectionRange(value.length, value.length);
  //   }
  // }, [isEdit])

  const handleOk = () => {
    // const text = inputRef?.current?.value;
    // if (!text) {
    //   return;
    // }
    // onOk(text);
    // toggleEdit();
  };

  return (
    <>
      {isEdit ? (
        <>
          <div className="relative">
            <Autocomplete
              // inputRef={inputRef}
              autoFocus
              // defaultValue={title}
              // multiline
              size="small"
              // variant="standard"
              options={[
                { id: 0, label: "tally" },
                { id: 1, label: "cms" },
              ]}
              className="min-w-[200px]"
              renderInput={params => <TextField {...params} variant="outlined" label="Project" className="max-w-[200px]" />}
            />
            <div className="absolute top-full left-[200px] z-10 flex gap-1 items-center py-1 ms-[-76px]">
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
        <div className="flex">
          <div
            className={ `${readonly ? '' : 'hover:bg-slate-200 cursor-pointer'} mx-[-4px] px-[4px] rounded uppercase text-fuchsia-500 font-bold` }
            onClick={toggleEdit}
          >
            {projectName}
          </div>
        </div>
      )}
    </>
  );
}
