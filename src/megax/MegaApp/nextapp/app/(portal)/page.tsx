"use client";

import Todo from "@/components/portal/dashboard/Todo";
import { useAppDispatch } from "@/lib/store/state.hook";
import { fetchTaskListThunk } from "@/lib/store/tasks.state";
import Grid from "@mui/material/Grid";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const appDispatch= useAppDispatch()

  useEffect(() => {
    appDispatch(fetchTaskListThunk())
  }, [appDispatch])

  return (
    <Grid container spacing={2} className="p-2">
      <Grid item xs={12} sm={8}>Dashboard</Grid>
      <Grid item xs={12} sm={4}>
        <Todo />
      </Grid>
    </Grid>
  )
}
