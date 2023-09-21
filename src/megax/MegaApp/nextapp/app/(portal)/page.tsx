"use client";

import Personal from "@/components/portal/dashboard/Personal";
import Grid from "@mui/material/Grid";
import { redirect } from "next/navigation";

export default function Home() {
  return (
    <Grid container spacing={2} className="p-2">
      <Grid item xs={12} sm={8}>Dashboard</Grid>
      <Grid item xs={12} sm={4}>
        <Personal />
      </Grid>
    </Grid>
  )
}
