"use client";

import IconButton from "@mui/material/IconButton";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import CloseIcon from "@mui/icons-material/Close";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Grid from "@mui/material/Grid";
import { useAppDispatch, useAppSelector } from "@/lib/store/state.hook";
import LinkIcon from "@mui/icons-material/Link";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {
  usePopupState,
  bindTrigger,
  bindMenu,
} from "material-ui-popup-state/hooks";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useConfirm } from "material-ui-confirm";
import {
  saveSubTaskThunk,
  deleteTaskThunk,
  patchTaskThunk,
} from "@/lib/store/tasks.state";
import toast from "react-hot-toast";
import { Task, TaskPatchKey } from "@/lib/models/task.model";
import SubTaskList from "./SubTaskList";
import TaskForm from "./TaskForm";
import Chip from "@mui/material/Chip";
import { shortenLink } from "@/lib/string.helper";
import TaskTitleControl from "./TaskTitleControl";
import TaskProjectControl from "./TaskProjectControl";

function TaskItem({ todo }: { todo: Task }) {
  const appDispatch = useAppDispatch();
  const shorten = todo.reference ? shortenLink(todo.reference) : "";

  const patchTask = (key: TaskPatchKey, value: string | number) => {
    appDispatch(
      patchTaskThunk({
        id: todo.id,
        key,
        value,
      })
    );
  };

  return (
    <>
      <div className="flex gap-2 items-center px-4 py-2 border-l-4 border-solid border-fuchsia-500 mt-0 w-full mx-0">
        <div className="flex-[1] w-full mx-0 mt-0">
          <TaskProjectControl onOk={() => {}} projectName="Tally" />

          <TaskTitleControl
            title={todo.title}
            onOk={value => patchTask("title", value)}
          />

          {todo.reference?.length > 0 && (
            <div className="">
              <Chip
                label={shorten}
                component="a"
                href={todo.reference}
                clickable
                size="small"
                color="info"
                deleteIcon={<LinkIcon />}
              />
            </div>
          )}
        </div>
        {!!todo.time && (
          <div className="font-bold text-green-700">{todo.time.format()}</div>
        )}
      </div>
    </>
  );
}

function TaskMenu({
  id,
  handleDelete,
}: {
  id: number;
  handleDelete: (id: number) => void;
}) {
  const popupMenu = usePopupState({
    variant: "popover",
    popupId: "task-menu-" + id,
    disableAutoFocus: true,
  });

  return (
    <>
      <IconButton
        size="small"
        className="!absolute top-1 right-1"
        {...bindTrigger(popupMenu)}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu {...bindMenu(popupMenu)} elevation={1}>
        <MenuItem onClick={() => handleDelete(id)}>
          <ListItemIcon>
            <CloseIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}

export default function TodoTask() {
  const confirmation = useConfirm();
  const appDispatch = useAppDispatch();
  const { tasks, loading } = useAppSelector(s => s.tasks);

  const handleDelete = (id: number) => {
    confirmation({
      title: "Are you sure?",
      description: `Delete this record`,
      dialogProps: {
        maxWidth: "xs",
      },
    })
      .then(() => {
        const result = appDispatch(deleteTaskThunk(id)).unwrap();

        result.then(res => {
          res.success
            ? toast.success("Task deleted successfully")
            : toast.error(`Something went wrong but I'm too lazy to check`);
        });
      })
      .catch(() => {
        /* ignore */
      });
  };

  const handleSaveSubTask = (id: number, taskId: number, value: string) => {
    appDispatch(
      saveSubTaskThunk({
        id,
        isCompleted: false,
        isFlag: false,
        taskId,
        title: value,
      })
    );
  };

  return (
    <>
      <div className="pb-4">
        <Grid container alignItems="center" justifyContent="center">
          <h2 className="text-[3rem] font-bold">01:15</h2>
          <Grid container alignItems="center" justifyContent="center" gap={2}>
            <IconButton color="success" size="large">
              <PlayCircleIcon fontSize="large" />
            </IconButton>
            <IconButton color="secondary" size="large">
              <PauseCircleIcon fontSize="large" />
            </IconButton>
          </Grid>
        </Grid>

        <TaskForm />
      </div>

      {tasks.map(todo => (
        <div
          key={todo.id}
          className="py-2 mb-2 bg-slate-100 rounded overflow-hidden relative shadow"
        >
          <TaskMenu id={todo.id} handleDelete={handleDelete} />
          <TaskItem todo={todo} />
          <div className="mx-4 mt-2">
            <SubTaskList
              subtasks={todo.subTasks}
              taskId={todo.id}
              onAdd={(value, id) => handleSaveSubTask(id || 0, todo.id, value)}
            />
          </div>
        </div>
      ))}
    </>
  );
}
