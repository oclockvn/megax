"use client";

import { fetchProjectsThunk } from "@/lib/store/projects.state";
import { useAppDispatch } from "@/lib/store/state.hook";
import { fetchTaskListThunk } from "@/lib/store/tasks.state";
import Grid from "@mui/material/Grid";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";

const TodoTask = dynamic(
  () => import("@/components/portal/dashboard/TodoTask"),
  { ssr: false }
);

export default function TaskPage() {
  const appDispatch = useAppDispatch();
  const loadRef = useRef(false);

  useEffect(() => {
    if (!loadRef.current) {
      loadRef.current = true;
      appDispatch(fetchTaskListThunk());
      appDispatch(fetchProjectsThunk());
    }
  }, [appDispatch, loadRef.current]);

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
