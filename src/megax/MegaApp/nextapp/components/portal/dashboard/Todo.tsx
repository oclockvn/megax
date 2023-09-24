"use client";

import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import FlagIcon from "@mui/icons-material/Flag";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import BlockIcon from "@mui/icons-material/Block";
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import { useAppDispatch, useAppSelector } from "@/lib/store/state.hook";
import ShortLink from "@/components/common/ShortLink";

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
  addSubTaskThunk,
  deleteTaskThunk,
  handleSubTaskThunk,
} from "@/lib/store/tasks.state";
import toast from "react-hot-toast";
import {
  SubTask,
  SubTaskAction,
  Task,
} from "@/lib/models/task.model";
import SubTaskForm from "./SubTaskForm";

function TaskItem({ todo }: { todo: Task }) {
  return (
    <>
      <div className="flex gap-2 items-center px-4 py-2 border-l-4 border-solid border-fuchsia-500 mt-0 w-full mx-0">
        <div className="flex-[1] w-full mx-0 mt-0">
          <ShortLink url={todo.reference} className="text-sm text-blue-500" />
          <div className="font-bold">
            <span className="uppercase text-fuchsia-500">{todo.project} |</span>{" "}
            {todo.title}
          </div>
        </div>
        <div className="font-bold text-green-700">{todo.time.format()}</div>
      </div>
    </>
  );
}

function SubTaskList({
  subtasks,
  taskId,
  onAdd,
}: {
  subtasks: SubTask[];
  taskId: number;
  onAdd: (subtask: string) => void;
}) {
  const appDispatch = useAppDispatch();
  const handleSubTaskAction = (id: number, action: SubTaskAction) => {
    appDispatch(handleSubTaskThunk({ id, taskId, action }));
  };

  const hasSub = subtasks?.length > 0;
  const completed = subtasks?.filter(s => s.isCompleted)?.length;
  const blocker = subtasks?.filter(s => s.isFlag)?.length || 0;

  return (
    <>
      {hasSub && (
        <h2 className="font-bold">
          Sub tasks ({completed}/{subtasks?.length})
          {blocker > 0 ? (
            <span className="ms-2 text-red-500">
              <BlockIcon fontSize="small" className="me-1" />
              {blocker} blocker(s)
            </span>
          ) : null}
        </h2>
      )}
      {hasSub &&
        subtasks.map(sub => (
          <div
            key={sub.id}
            className="group border-b border-solid last:border-none"
          >
            <Grid container alignItems={"center"} spacing={1}>
              <Grid item>
                <Checkbox
                  icon={<RadioButtonUncheckedIcon />}
                  checkedIcon={<CheckCircleIcon />}
                  checked={sub.isCompleted}
                  onChange={() => handleSubTaskAction(sub.id, "complete")}
                />
              </Grid>
              <Grid item flex={1} fontSize={".8rem"}>
                {sub.title}
              </Grid>
              <Grid item>
                <IconButton
                  title="Red flag"
                  className={`${
                    sub.isFlag ? "opacity-100" : "opacity-0"
                  } transition-opacity group-hover:opacity-100`}
                  onClick={() => handleSubTaskAction(sub.id, "flag")}
                >
                  <FlagIcon
                    fontSize="small"
                    className={`${sub.isFlag ? "text-red-500" : ""}`}
                  />
                </IconButton>
                <IconButton
                  color="warning"
                  onClick={() => handleSubTaskAction(sub.id, "delete")}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Grid>
            </Grid>
          </div>
        ))}

      <div className="mt-2">
        <SubTaskForm onAdd={onAdd} />
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

export default function Todo() {
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

  const handleAddSubTask = (taskId: number, subtask: string) => {
    appDispatch(
      addSubTaskThunk({
        id: 0,
        isCompleted: false,
        isFlag: false,
        taskId,
        title: subtask,
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

        <div className="text-center">
          <Button
            variant="contained"
            className="!px-10"
            startIcon={<AddIcon />}
          >
            Add Todo
          </Button>
        </div>
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
              subtasks={todo.subtasks}
              taskId={todo.id}
              onAdd={name => handleAddSubTask(todo.id, name)}
            />
          </div>
        </div>
      ))}
    </>
  );
}
