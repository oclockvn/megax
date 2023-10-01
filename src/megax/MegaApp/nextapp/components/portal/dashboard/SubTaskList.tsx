"use client";

import BlockIcon from "@mui/icons-material/Block";
import SubTaskForm from "./SubTaskForm";
import SubTaskItem from "./SubTaskItem";
import { SubTask, SubTaskState } from "@/lib/models/task.model";

type SubTaskListProps = {
  subtasks: SubTask[];
  taskId: number;
  onAdd: (value: string, id?: number) => void;
};

export default function SubTaskList({
  subtasks,
  taskId,
  onAdd,
}: SubTaskListProps) {
  const hasSub = subtasks?.length > 0;
  const completed = subtasks?.filter(s => s.status === SubTaskState.Completed)?.length;
  const blocker = subtasks?.filter(s => s.status === SubTaskState.Flagged)?.length || 0;

  const Overview = () => (
    <div className="mb-2">
      Sub tasks ({completed}/{subtasks?.length})
      {blocker > 0 ? (
        <span className="ms-2 text-red-500">
          <BlockIcon fontSize="small" className="me-1" />
          {blocker} blocker(s)
        </span>
      ) : null}
    </div>
  );

  const classes = {
    default: 'group border-b border-solid last:border-none rounded',
    flagged: 'bg-red-50',
  }

  return (
    <>
      {hasSub && <Overview />}
      {hasSub &&
        subtasks.map(sub => (
          <div
            key={sub.id}
            className={[classes.default, sub.status === SubTaskState.Flagged ? classes.flagged : ''].join(' ')}
          >
            <SubTaskItem sub={sub} onOk={onAdd} />
          </div>
        ))}

      <div className="mt-2">
        <SubTaskForm onOk={onAdd} id={0} taskId={taskId} />
      </div>
    </>
  );
}
