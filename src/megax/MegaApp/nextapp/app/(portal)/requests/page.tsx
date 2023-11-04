"use client";

import { fetchRequestingLeavesThunk } from "@/lib/store/leave.state";
import { useAppDispatch, useAppSelector } from "@/lib/store/state.hook";
import Grid from "@mui/material/Grid";
import { useEffect, useRef } from "react";

const LeaveCardLoading = dynamic(
  () => import("@/components/common/skeletons/LeaveCardLoading")
);
const LeaveCard = dynamic(() => import("@/components/portal/leave/LeaveCard"));

import dynamic from "next/dynamic";

export default function RequestPage() {
  const appDispatch = useAppDispatch();
  const { requesting, loading } = useAppSelector(s => s.leaves);
  const loadRef = useRef(false);

  useEffect(() => {
    if (!loadRef.current) {
      loadRef.current = true;
      appDispatch(fetchRequestingLeavesThunk());
    }

  }, [appDispatch, loadRef.current]);

  return (
    <>
      <div className="container mx-auto py-8">
        <Grid container>
          <Grid item xs={12} sm={4}>
            <h3 className="font-bold text-lg">
              Leave requests ({requesting.length})
            </h3>
            {loading ? (
              <LeaveCardLoading count={3} />
            ) : (
              requesting.length > 0 &&
              requesting.map(l => (
                <div key={l.id} className="mt-4">
                  <LeaveCard leave={l} />
                </div>
              ))
            )}
          </Grid>
        </Grid>
      </div>
    </>
  );
}
