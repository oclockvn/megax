"use client";

import TodoTask from "@/components/portal/dashboard/TodoTask";
import { useAppDispatch } from "@/lib/store/state.hook";
import { fetchTaskListThunk } from "@/lib/store/tasks.state";
import Grid from "@mui/material/Grid";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function TaskPage() {
  const appDispatch = useAppDispatch();

  useEffect(() => {
    appDispatch(fetchTaskListThunk());
  }, [appDispatch]);

  return (
    <Grid
      container
      alignItems={"center"}
      justifyContent={"center"}
      spacing={2}
      className="p-2"
    >
      <Grid item xs={12} sm={6}>
        <div>
          <TodoTask />
        </div>
      </Grid>
    </Grid>
  );
}
