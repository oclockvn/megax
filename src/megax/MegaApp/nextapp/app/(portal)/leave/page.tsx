"use client";

import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Drawer from "@mui/material/Drawer";
import LeaveCard from "@/components/portal/leave/LeaveCard";
import LeaveHistory from "@/components/portal/leave/LeaveHistory";
import { useAppDispatch, useAppSelector } from "@/lib/store/state.hook";
import { useEffect, useState } from "react";
import { fetchLeaveSummaryThunk } from "@/lib/store/leave.state";
import { Leave, LeaveStatus, LeaveType } from "@/lib/models/leave.model";
import LeaveForm from "@/components/portal/leave/LeaveForm";
import Skeleton from "@mui/material/Skeleton";
import { makeArr, makeArrOf } from "@/lib/helpers/array";

export default function LeavePage() {
  const appDispatch = useAppDispatch();
  const { items, capacity, loading } = useAppSelector(s => s.leaves);
  const [showDrawer, setShowDrawer] = useState(false);
  const [leave, setLeave] = useState<Partial<Leave> | null>(null);

  useEffect(() => {
    appDispatch(fetchLeaveSummaryThunk());
  }, []);

  const handleCloseDrawer = () => {
    setShowDrawer(false);
    // appDispatch(setLoading({ loading: false }));
  };

  const handleOpenLeave = (leave: Partial<Leave>) => {
    setLeave(leave);
    setShowDrawer(true);
    // appDispatch(setLoading({ loading: false }));
  };

  const queueItems = items.filter(x => x.status === LeaveStatus.New);
  const pastItems = loading
    ? makeArrOf(5, i => ({ id: i, status: LeaveStatus.New } as Leave))
    : items.filter(x => x.status !== LeaveStatus.New);
  const taken = items
    .filter(x => x.status === LeaveStatus.Approved)
    .reduce(
      (prev: Date[], { leaveDates }) => [
        ...prev,
        ...leaveDates.map(d => d.date),
      ],
      []
    ).length;

  const requestedDates = items.reduce(
    (prev: Date[], { leaveDates }) => [...prev, ...leaveDates.map(d => d.date)],
    []
  );

  const LoadingCard = ({ count = 1 }: { count?: number }) => (
    <>
      {makeArr(count).map(i => (
        <div key={i} className="mt-4">
          <div className="flex gap-4 items-center mb-2">
            <Skeleton variant="circular" width={50} height={50} />
            <div>
              <Skeleton variant="text" width={200} />
              <Skeleton variant="text" width={300} />
            </div>
          </div>

          <Skeleton variant="rounded" height={200} />
        </div>
      ))}
    </>
  );

  return (
    <div className="p-4 md:px-0 container mx-auto">
      <Grid
        container
        spacing={2}
        alignItems={"center"}
        className="sticky top-0 z-30"
      >
        <Grid item xs={12} sm={4}>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            fullWidth
            startIcon={<AddIcon />}
            onClick={() => handleOpenLeave({ type: LeaveType.Annual })}
          >
            Request Leave
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <div className="flex items-center justify-between mt-4 mb-2 font-bold">
            <h3 className="text-lg">Your Requests</h3>
            <div>
              (Taken {taken} / {capacity} total)
            </div>
          </div>
          {loading ? (
            <>
              <LoadingCard count={2} />
            </>
          ) : (
            queueItems.map((i, index) => (
              <div key={i.id} className={index === 0 ? "" : "mt-4"}>
                <LeaveCard leave={i} />
              </div>
            ))
          )}
        </Grid>

        <Grid item xs={12} sm={8}>
          <h3 className="mt-4 text-lg font-bold ps-[160px]">Leave History</h3>
          <LeaveHistory
            items={pastItems}
            loading={loading}
            loadingElement={<LoadingCard />}
          />
        </Grid>
      </Grid>

      <Drawer anchor="right" open={showDrawer} onClose={handleCloseDrawer}>
        {leave && (
          <LeaveForm
            leave={leave!}
            loading={loading}
            handleClose={handleCloseDrawer}
            requestedDates={requestedDates}
          />
        )}
      </Drawer>
    </div>
  );
}
