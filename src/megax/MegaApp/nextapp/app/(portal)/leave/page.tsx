"use client";

import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { Divider } from "@mui/material";
import LeaveCard from "@/components/portal/leave/LeaveCard";
import LeaveHistory from "@/components/portal/leave/LeaveHistory";
import { useAppDispatch, useAppSelector } from "@/lib/store/state.hook";
import { useEffect } from "react";
import { fetchLeavesThunk } from "@/lib/store/leave.state";
import { LeaveStatus } from "@/lib/models/leave.model";

export default function LeavePage() {
  const appDispatch = useAppDispatch();
  const { items, loading } = useAppSelector(s => s.leaves);

  useEffect(() => {
    appDispatch(fetchLeavesThunk());
  }, []);

  const queueItems = items.filter(x => x.status === LeaveStatus.New);
  const pastItems = items.filter(x => x.status !== LeaveStatus.New);

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
          <h3 className="mt-4 mb-2 text-lg font-bold">Your Requests</h3>
          {queueItems.map((i, index) => (
            <div key={i.id} className={index === 0 ? '' : 'mt-4'}>
              <LeaveCard leave={i} />
            </div>
          ))}
        </Grid>

        <Grid item xs={12} sm={8}>
          <h3 className="mt-4 mb-2 text-lg font-bold ps-[160px]">
            Leave History
          </h3>
          <LeaveHistory items={pastItems} />
        </Grid>
      </Grid>
    </div>
  );
}
