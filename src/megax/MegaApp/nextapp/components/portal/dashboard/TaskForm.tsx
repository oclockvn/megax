import { KeyboardEvent } from "react";
import {
  Controller,
  FormContainer,
  SelectElement,
  useForm,
} from "react-hook-form-mui";
import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  usePopupState,
  bindTrigger,
  bindPopover,
} from "material-ui-popup-state/hooks";
import Popover from "@mui/material/Popover";
import { useAppDispatch } from "@/lib/store/state.hook";
import { addTaskThunk } from "@/lib/store/tasks.state";
import { TaskState } from "@/lib/models/task.model";

type TaskModel = {
  title: string;
  projectId?: number;
  clientId?: number;
};

export default function TaskForm() {
  const appDispatch = useAppDispatch();
  const formContext = useForm<TaskModel>({
    values: {
      title: "",
    },
  });
  const taskDetailPopup = usePopupState({
    variant: "popover",
    popupId: "task-details",
  });

  const handleKeyUp = async (
    e: KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      const form = formContext.getValues();
      if (!form.title) {
        return;
      }

      const result = await appDispatch(
        addTaskThunk({
          clientId: form.clientId,
          projectId: form.projectId,
          title: form.title,
          status: TaskState.Todo,
        })
      ).unwrap();

      if (result.success) {
        formContext.reset();
      }
    }
  };

  return (
    <>
      <Paper className="p-2">
        <FormContainer formContext={formContext}>
          <div className="flex items-center">
            <IconButton size="small" {...bindTrigger(taskDetailPopup)}>
              <ExpandMoreIcon />
            </IconButton>

            <Popover
              {...bindPopover(taskDetailPopup)}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <div className="p-4">
                <h3 className="mb-4 font-bold">Task details</h3>
                <div>
                  <SelectElement
                    fullWidth
                    label="Project"
                    name="projectId"
                    size="small"
                    className="min-w-[200px] max-w-[200px] border-0 mb-4"
                    options={[
                      { id: 0, label: "cms" },
                      { id: 1, label: "tally" },
                    ]}
                  />
                </div>

                <div>
                  <SelectElement
                    fullWidth
                    label="Client"
                    name="clientId"
                    size="small"
                    className="min-w-[200px] border-0"
                    options={[]}
                  />
                </div>
              </div>
            </Popover>

            <Controller
              name="title"
              control={formContext.control}
              render={({ field }) => (
                <InputBase
                  placeholder="Enter to save your task"
                  className="flex-[1] ms-2"
                  {...field}
                  onKeyUp={handleKeyUp}
                  onKeyDown={e => e.key === "Enter" && e.preventDefault()}
                />
              )}
            />
          </div>
        </FormContainer>
      </Paper>
    </>
  );
}
