"use client";

import IconButton from "@mui/material/IconButton";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import FlagIcon from "@mui/icons-material/Flag";
import Checkbox from "@mui/material/Checkbox";
import { useAppDispatch } from "@/lib/store/state.hook";

import {
  deleteSubTaskThunk,
  patchSubTaskThunk,
  toggleEditSubTask,
} from "@/lib/store/tasks.state";
import {
  SubTask,
  SubTaskPatch,
  SubTaskState,
} from "@/lib/models/task.model";
import SubTaskForm from "./SubTaskForm";

type SubTaskItemProps = {
  sub: SubTask;
  readonly: boolean;
};

export default function SubTaskItem({ sub, readonly }: SubTaskItemProps) {
  const taskId = sub.taskId;
  const appDispatch = useAppDispatch();

  const handlePatch = (key: SubTaskPatch, value: string | number) => {
    appDispatch(patchSubTaskThunk({
      id: sub.id,
      taskId,
      key,
      value
    }))
  };

  const handleDelete = () => {
    appDispatch(deleteSubTaskThunk({ id: sub.id, taskId: sub.taskId }));
  };

  const handleEditSubTask = (id: number) => {
    appDispatch(toggleEditSubTask({ id, taskId }));
  };

  const isCompleted = sub.status === SubTaskState.Completed;
  const isFlagged = sub.status === SubTaskState.Flagged;

  return (
    <>
      <div className="flex items-center gap-1">
        <Checkbox
          icon={<RadioButtonUncheckedIcon />}
          checkedIcon={<CheckCircleIcon />}
          checked={isCompleted}
          readOnly={readonly}
          onChange={() =>
            !readonly && handlePatch(
              "status",
              isCompleted ? SubTaskState.New : SubTaskState.Completed
            )
          }
        />
        <div className="flex-[1] font-[.8rem]">
          {sub.isEdit ? (
            <SubTaskForm
              id={sub.id}
              taskId={taskId}
              isEdit
              currentValue={sub.title}
              onOk={value => handlePatch("title", value)}
              onCancel={() => handleEditSubTask(sub.id)}
            />
          ) : (
            <div
              className={`cursor-pointer ${isFlagged ? "text-red-500" : ""}`}
              onClick={() => !readonly && handleEditSubTask(sub.id)}
            >
              {sub.title}
            </div>
          )}
        </div>
        <div className="flex items-center">
          {!readonly && <IconButton
            title="Red flag"
            className={`${
              isFlagged ? "opacity-100" : "opacity-0"
            } transition-opacity group-hover:opacity-100`}
            onClick={() =>
              handlePatch(
                "status",
                isFlagged ? SubTaskState.New : SubTaskState.Flagged
              )
            }
          >
            <FlagIcon
              fontSize="small"
              className={`${isFlagged ? "text-red-500" : ""}`}
            />
          </IconButton> }
          {!readonly && <IconButton color="warning" onClick={() => handleDelete()}>
            <CloseIcon fontSize="small" />
          </IconButton> }
        </div>
      </div>
    </>
  );
}
