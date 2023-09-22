"use client";

import Personal from "@/components/portal/dashboard/Personal";
import { useAppDispatch } from "@/lib/store/state.hook";
import { fetchTodoThunk } from "@/lib/store/todo.state";
import Grid from "@mui/material/Grid";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const appDispatch= useAppDispatch()

  useEffect(() => {
    appDispatch(fetchTodoThunk())
  }, [appDispatch])

  return (
    <Grid container spacing={2} className="p-2">
      <Grid item xs={12} sm={8}>Dashboard</Grid>
      <Grid item xs={12} sm={4}>
        <Personal />
      </Grid>
    </Grid>
  )
}
