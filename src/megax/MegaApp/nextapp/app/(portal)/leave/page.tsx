"use client";

import dynamic from "next/dynamic";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Drawer from "@mui/material/Drawer";
import { useEffect, useReducer } from "react";
import { Leave, LeaveStatus, LeaveType } from "@/lib/models/leave.model";
import { useQuery } from "@tanstack/react-query";
import { fetchLeaveSummary } from "@/lib/apis/leave.api";
import {
  usePast,
  useQueue,
  useRequestedDates,
  useTakenAnnual,
  useTakenPaid,
} from "@/hooks/leave.hook";
import leavePageReducer, { LeavePageState } from "@/lib/states/leave.state";
import Image from "next/image";

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

import LeaveImage from "@/public/images/leave-party.png";
import { MagicMotion } from "react-magic-motion";

export default function LeavePage() {
  const [state, dispatch] = useReducer(leavePageReducer, {
    capacity: 0,
    loading: true,
    items: [],
    leave: null,
    showDrawer: false,
  } as LeavePageState);

  const {
    isLoading: loading,
    status,
    data,
  } = useQuery({
    queryKey: ["user/leave"],
    queryFn: () => fetchLeaveSummary(),
  });

  useEffect(() => {
    if (status === "success") {
      dispatch({
        type: "set",
        payload: {
          items: data?.leaves || [],
          capacity: data?.capacity || 0,
        },
      });
    }
  }, [status, data]);

  const onSubmitted = (leave: Leave) => {
    dispatch({
      type: "submitted",
      payload: leave,
    });
  };

  const handleCloseDrawer = () => {
    dispatch({
      type: "set",
      payload: { showDrawer: false },
    });
  };

  const onResponded = (leave: Pick<Leave, "id" | "status">) => {
    switch (leave.status) {
      case LeaveStatus.Cancelled:
        dispatch({
          type: "cancel",
          payload: leave.id,
        });
        break;
    }
  };

  const handleOpenLeave = (leave: Partial<Leave>) => {
    dispatch({
      type: "set",
      payload: {
        leave,
        showDrawer: true,
      },
    });
  };

  const { items, capacity, leave, showDrawer } = state;

  const queueItems = useQueue(items);
  const pastItems = usePast(items);
  const takenAnnual = useTakenAnnual(items);
  const takenPaid = useTakenPaid(items);
  const requestedDates = useRequestedDates(items);

  return (
    <div className="p-4 md:px-0 container mx-auto">
      {queueItems.length > 0 && (
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
      )}

      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          {queueItems.length > 0 && (
            <div className="flex items-center justify-between mt-4 mb-2 font-bold">
              <h3 className="text-lg">Your Requests</h3>
            </div>
          )}

          {loading ? (
            <LeaveCardLoading count={2} />
          ) : queueItems.length > 0 ? (
            <MagicMotion>
              <div>
                {queueItems.map((i, index) => (
                  <div key={i.id} className={index === 0 ? "" : "mt-4"}>
                    <LeaveCard key="exclude" leave={i} onResponded={onResponded} />
                  </div>
                ))}
              </div>
            </MagicMotion>
          ) : (
            <div className="mt-8">
              Screw work, wanna hangout? Request a leave now!
              <div className="mt-4">
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
              </div>
              <Image
                src={LeaveImage}
                alt="Leave party"
                width={250}
                height={250}
                className="mx-auto"
              />
            </div>
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
            onAdded={onSubmitted}
            requestedDates={requestedDates}
          />
        )}
      </Drawer>
    </div>
  );
}
