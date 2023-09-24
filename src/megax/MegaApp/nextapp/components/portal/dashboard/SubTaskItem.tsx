"use client";

import IconButton from "@mui/material/IconButton";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import FlagIcon from "@mui/icons-material/Flag";
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import { useAppDispatch } from "@/lib/store/state.hook";

import { handleSubTaskThunk, toggleEditSubTask } from "@/lib/store/tasks.state";
import { SubTask, SubTaskAction } from "@/lib/models/task.model";
import SubTaskForm from "./SubTaskForm";

type SubTaskItemProps = {
  sub: SubTask;
  onOk: (value: string, id?: number) => void;
};

export default function SubTaskItem({ sub, onOk }: SubTaskItemProps) {
  const taskId = sub.taskId;
  const appDispatch = useAppDispatch();
  const handleSubTaskAction = (id: number, action: SubTaskAction) => {
    appDispatch(handleSubTaskThunk({ id, taskId, action }));
  };

  const handleEditSubTask = (id: number) => {
    appDispatch(toggleEditSubTask({ id, taskId }));
  };

  return (
    <>
      <div className="flex items-center gap-1">
        <Checkbox
          icon={<RadioButtonUncheckedIcon />}
          checkedIcon={<CheckCircleIcon />}
          checked={sub.isCompleted}
          onChange={() => handleSubTaskAction(sub.id, "complete")}
        />
        <div className="flex-[1] font-[.8rem]">
          {sub.isEdit ? (
            <SubTaskForm
              id={sub.id}
              taskId={taskId}
              isEdit
              currentValue={sub.title}
              onOk={value => onOk(value, sub.id)}
              onCancel={() => handleEditSubTask(sub.id)}
            />
          ) : (
            <div
              className={ `cursor-pointer ${sub.isFlag ? 'text-red-500' : ''}` }
              onClick={() => handleEditSubTask(sub.id)}
            >
              {sub.title}
            </div>
          )}
        </div>
        <div className="flex items-center">
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
        </div>
      </div>
    </>
  );
}
