"use client";

import IconButton from "@mui/material/IconButton";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import CloseIcon from "@mui/icons-material/Close";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Grid from "@mui/material/Grid";
import { useAppDispatch, useAppSelector } from "@/lib/store/state.hook";
import LinkIcon from "@mui/icons-material/Link";
import CheckIcon from "@mui/icons-material/Check";
import ArchiveIcon from '@mui/icons-material/Archive';

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
import { patchTaskThunk } from "@/lib/store/tasks.state";
import toast from "react-hot-toast";
import { SubTaskState, Task, TaskPatchKey, TaskState } from "@/lib/models/task.model";
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

  const statusCls =
    todo.status === TaskState.Completed
      ? "border-green-600 bg-[#16a34a1a]"
      : todo.status === TaskState.Archived
      ? "border-gray-500"
      : "border-green-600";
  const classes = [
    "flex gap-2 items-center px-4 py-2 border-l-4 border-solid mt-0 w-full mx-0",
    statusCls,
  ].join(" ");

  const readonly = todo.status === TaskState.Completed;

  return (
    <>
      <div className={classes}>
        <div className="flex-[1] w-full mx-0 mt-0">
          <TaskProjectControl readonly={readonly} onOk={() => {}} projectName="Tally" />

          <TaskTitleControl
            title={todo.title}
            readonly={readonly}
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
  canComplete,
  onDelete,
  onComplete,
}: {
  id: number;
  canComplete: boolean;
  onDelete: (id: number) => void;
  onComplete: (id: number) => void;
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
        className="!absolute top-2 right-1"
        {...bindTrigger(popupMenu)}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu {...bindMenu(popupMenu)} elevation={1}>
        <MenuItem disabled={!canComplete} onClick={() => onComplete(id)}>
          <ListItemIcon>
            <CheckIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Complete</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => onDelete(id)}>
          <ListItemIcon>
            <ArchiveIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Archive</ListItemText>
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
        const result = appDispatch(
          patchTaskThunk({
            id,
            key: "status",
            value: TaskState.Archived,
          })
        ).unwrap();

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

  const handleStatusUpdate = async (id: number, status: TaskState) => {
    const result = await appDispatch(
      patchTaskThunk({
        id,
        key: "status",
        value: status,
      })
    ).unwrap();

    if (!result.success) {
      toast.error('Beep beep! Do not try to hack the system!');
    }
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
          <TaskMenu
            id={todo.id}
            canComplete={todo.status !== TaskState.Completed && !todo.subTasks.some(s => s.status !== SubTaskState.Completed)}
            onDelete={handleDelete}
            onComplete={id => handleStatusUpdate(id, TaskState.Completed)}
          />
          <TaskItem todo={todo} />
          <div className="mx-4 mt-2">
            <SubTaskList subtasks={todo.subTasks} taskId={todo.id} readonly={todo.status === TaskState.Completed} />
          </div>
          {todo.status === TaskState.Completed && <>
          <div className="absolute left-0 right-0 z-20 top-[30px] flex items-center justify-center rotate-[-20deg]">
            <div className="text-sm font-extrabold border-[3px] px-2 border-solid border-fuchsia-500 text-fuchsia-500">COMPLETED</div>
          </div>
          </>}
        </div>
      ))}
    </>
  );
}
