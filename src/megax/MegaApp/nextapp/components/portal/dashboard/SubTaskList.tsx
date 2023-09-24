"use client";

import BlockIcon from "@mui/icons-material/Block";
import SubTaskForm from "./SubTaskForm";
import SubTaskItem from "./SubTaskItem";
import { SubTask } from "@/lib/models/task.model";

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
  const completed = subtasks?.filter(s => s.isCompleted)?.length;
  const blocker = subtasks?.filter(s => s.isFlag)?.length || 0;

  const Overview = () => (
    <div>
      Sub tasks ({completed}/{subtasks?.length})
      {blocker > 0 ? (
        <span className="ms-2 text-red-500">
          <BlockIcon fontSize="small" className="me-1" />
          {blocker} blocker(s)
        </span>
      ) : null}
    </div>
  );

  return (
    <>
      {hasSub && <Overview />}
      {hasSub &&
        subtasks.map(sub => (
          <div
            key={sub.id}
            className="group border-b border-solid last:border-none"
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
