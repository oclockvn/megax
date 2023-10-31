"use client";

import dynamic from "next/dynamic";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Drawer from "@mui/material/Drawer";
import { useAppDispatch, useAppSelector } from "@/lib/store/state.hook";
import { useEffect, useState } from "react";
import { fetchLeaveSummaryThunk } from "@/lib/store/leave.state";
import {
  Leave,
  LeaveDate,
  LeaveStatus,
  LeaveTime,
  LeaveType,
} from "@/lib/models/leave.model";
import { makeArrOf } from "@/lib/helpers/array";
import dt from "@/lib/datetime";

const LeaveCard = dynamic(() => import("@/components/portal/leave/LeaveCard"), {
  ssr: false,
});
const LeaveHistory = dynamic(
  () => import("@/components/portal/leave/LeaveHistory"),
  { ssr: false }
);
const LeaveForm = dynamic(() => import("@/components/portal/leave/LeaveForm"), {
  ssr: false,
});
const LeaveCardLoading = dynamic(
  () => import("@/components/common/skeletons/LeaveCardLoading"),
  { ssr: false }
);

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

  const takenAnnual =
    items
      .filter(l => l.type === LeaveType.Annual)
      .reduce(
        (prev: LeaveDate[], { leaveDates }) => [...prev, ...leaveDates],
        []
      )
      .filter(d => dt.isPast(d.date))
      .reduce((prev, curr) => prev + (curr.time === LeaveTime.All ? 2 : 1), 0) /
    2;

  const takenPaid =
    items
      .filter(l => l.type === LeaveType.Paid)
      .reduce(
        (prev: LeaveDate[], { leaveDates }) => [...prev, ...leaveDates],
        []
      )
      .filter(d => dt.isPast(d.date))
      .reduce((prev, curr) => prev + (curr.time === LeaveTime.All ? 2 : 1), 0) /
    2;
  const requestedDates = items.reduce(
    (prev: Date[], { leaveDates }) => [...prev, ...leaveDates.map(d => d.date)],
    []
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
            {/* <div>
              (Taken {taken}/{capacity} total days)
            </div> */}
          </div>
          {loading ? (
            <>
              <LeaveCardLoading count={2} />
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
          <div className="flex justify-between items-center text-lg font-bold mt-4">
            <h3 className="ps-[160px]">Leave History</h3>
            <div className="me-8">
              (Annual: Taken {takenAnnual}/{capacity} total - Paid: {takenPaid}{" "}
              taken)
            </div>
          </div>
          <LeaveHistory items={pastItems} loading={loading} />
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
