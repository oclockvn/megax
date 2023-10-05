import TextField from "@mui/material/TextField";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";
import { Project } from "@/lib/models/project.model";
import {
  AutocompleteElement,
  FormContainer,
  useForm,
} from "react-hook-form-mui";

export type ProjectControlProps = {
  projectId?: number;
  readonly: boolean;
  onOk: (value: number | undefined) => void;
  projects: Project[];
};

export default function TaskProjectControl({
  projectId,
  readonly,
  projects,
  onOk,
}: ProjectControlProps) {
  const [isEdit, setEdit] = useState(false);

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
    const selectedProject = formContext.getValues("projectId");
    onOk(selectedProject);
    toggleEdit();
  };

  const options = projects.map(p => ({ id: p.id, label: p.name }));
  const formContext = useForm({
    values: { projectId: projectId },
  });

  const projectName = projects.find(p => p.id === projectId)?.name;

  return (
    <>
      {isEdit ? (
        <>
          <FormContainer formContext={formContext}>
            <div className="relative">
              <AutocompleteElement
                // inputRef={inputRef}
                // autoFocus
                // defaultValue={title}
                // multiline
                // size="small"
                // variant="standard"
                name="projectId"
                matchId
                options={options}
                // className="min-w-[200px]"
                autocompleteProps={{
                  renderOption(attr, o) {
                    return (
                      <li {...attr} key={o.id}>
                        {o.label}
                      </li>
                    );
                  },
                  // renderInput(params) {
                  //   return <TextField
                  //     {...params}
                  //     variant="outlined"
                  //     label="Project"
                  //     className="max-w-[200px]"
                  //   />
                  // }
                }}
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
          </FormContainer>
        </>
      ) : (
        <div className="flex">
          <div
            className={`${
              readonly ? "" : "hover:bg-slate-200 cursor-pointer"
            } mx-[-4px] px-[4px] rounded uppercase text-fuchsia-500 font-bold`}
            onClick={toggleEdit}
          >
            {projectName}
          </div>
        </div>
      )}
    </>
  );
}
