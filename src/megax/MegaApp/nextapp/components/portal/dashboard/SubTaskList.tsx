"use client";

import BlockIcon from "@mui/icons-material/Block";
import SubTaskForm from "./SubTaskForm";
import SubTaskItem from "./SubTaskItem";
import { SubTask, SubTaskState } from "@/lib/models/task.model";
import { useAppDispatch } from "@/lib/store/state.hook";
import { addSubTaskThunk } from "@/lib/store/tasks.state";

type SubTaskListProps = {
  subtasks: SubTask[];
  taskId: number;
};

export default function SubTaskList({ subtasks, taskId }: SubTaskListProps) {
  const appDispatch = useAppDispatch();

  const handleAdd = (id: number, taskId: number, value: string) => {
    appDispatch(addSubTaskThunk({ taskId, title: value }));
  };

  const hasSub = subtasks?.length > 0;
  const completed = subtasks?.filter(
    s => s.status === SubTaskState.Completed
  )?.length;
  const blocker =
    subtasks?.filter(s => s.status === SubTaskState.Flagged)?.length || 0;

  const Overview = () => (
    <div className="mb-2 flex items-center">
      <span>
        Sub tasks ({completed}/{subtasks?.length})
      </span>
      {blocker > 0 ? (
        <span className="ms-2 text-red-500 inline-flex items-center">
          <BlockIcon fontSize="small" className="me-1" />
          {blocker} blocker(s)
        </span>
      ) : null}
    </div>
  );

  const classes = {
    default: "group border-b border-solid last:border-none rounded",
    flagged: "bg-red-50",
  };

  return (
    <>
      {hasSub && <Overview />}
      {hasSub &&
        subtasks.map(sub => (
          <div
            key={sub.id}
            className={[
              classes.default,
              sub.status === SubTaskState.Flagged ? classes.flagged : "",
            ].join(" ")}
          >
            <SubTaskItem sub={sub} />
          </div>
        ))}

      <div className="mt-2">
        <SubTaskForm
          onOk={value => handleAdd(0, taskId, value)}
          id={0}
          taskId={taskId}
        />
      </div>
    </>
  );
}
