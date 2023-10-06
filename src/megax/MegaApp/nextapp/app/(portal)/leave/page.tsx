"use client";

import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { Divider } from "@mui/material";
import LeaveCard from "@/components/portal/leave/LeaveCard";
import LeaveHistory from "@/components/portal/leave/LeaveHistory";

export default function LeavePage() {
  return (
    <div className="p-4 md:px-0 container mx-auto">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            fullWidth
            startIcon={<AddIcon />}
          >
            Request Leave
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <h3 className="mt-4 mb-2 text-lg font-bold">Waiting for Approval</h3>
          <LeaveCard />
          <Divider orientation="horizontal" className="my-4" />
          <LeaveCard />
          <Divider orientation="horizontal" className="my-4" />
          <LeaveCard />
        </Grid>

        <Grid item xs={12} sm={8}>
          <h3 className="mt-4 mb-2 text-lg font-bold ps-[160px]">Leave History</h3>
          <LeaveHistory />
        </Grid>
      </Grid>
    </div>
  );
}
