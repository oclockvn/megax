import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import Button from "@mui/material/Button";
import { Project } from "@/lib/models/project.model";
import {
  AutocompleteElement,
  FormContainer,
  useForm,
} from "react-hook-form-mui";
import TopicIcon from "@mui/icons-material/Topic";

export type ProjectControlProps = {
  projectId?: number;
  readonly: boolean;
  onOk: (value: number | undefined) => void;
  onEditing?: (yes: boolean) => void;
  projects: Project[];
};

export default function TaskProjectControl({
  projectId,
  readonly,
  projects,
  onOk,
  onEditing,
}: ProjectControlProps) {
  const [isEdit, setEdit] = useState(false);

  const toggleEdit = () => {
    if (readonly) {
      return;
    }

    setEdit(prev => !prev);
    onEditing && onEditing(!isEdit);
  };

  const handleOk = () => {
    const selectedProject = formContext.getValues("projectId");
    onOk(selectedProject);
    toggleEdit();
  };

  const options = projects.map(p => ({ id: p.id, label: p.name }));
  const formContext = useForm({
    values: { projectId: projectId },
  });

  const projectName =
    projects.find(p => p.id === projectId)?.name || "-No project-";
  const hasProject = !!projectId;

  return (
    <div className="flex items-center gap-2">
      <TopicIcon fontSize="small" color="info" />
      {isEdit ? (
        <>
          <FormContainer formContext={formContext}>
            <div className="relative">
              <AutocompleteElement
                name="projectId"
                matchId
                options={options}
                textFieldProps={{
                  InputProps: {
                    className: "max-w-[200px]",
                    size: "small",
                  },
                  variant: "standard",
                }}
                autocompleteProps={{
                  renderOption(attr, o) {
                    return (
                      <li {...attr} key={o.id}>
                        {o.label}
                      </li>
                    );
                  },
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
              !readonly && "hover:bg-slate-200 cursor-pointer"
            } mx-[-4px] px-[4px] rounded uppercase ${
              hasProject ? "text-fuchsia-500 font-bold" : "text-xs"
            }`}
            onClick={() => !readonly && toggleEdit()}
          >
            {projectName}
          </div>
        </div>
      )}
    </div>
  );
}
