"use client";

import LeaveCardLoading from "@/components/common/skeletons/LeaveCardLoading";
import LeaveCard from "@/components/portal/leave/LeaveCard";
import { fetchRequestingLeavesThunk } from "@/lib/store/leave.state";
import { useAppDispatch, useAppSelector } from "@/lib/store/state.hook";
import Grid from "@mui/material/Grid";
import { useEffect } from "react";

export default function RequestPage() {
  const appDispatch = useAppDispatch();
  const { requesting, loading } = useAppSelector(s => s.leaves);

  useEffect(() => {
    appDispatch(fetchRequestingLeavesThunk());
  }, [appDispatch]);

  return (
    <>
      <div className="container mx-auto py-8">
        <Grid container>
          <Grid item xs={12} sm={4}>
            <h3 className="font-bold text-lg">Leave requests ({requesting.length})</h3>
            {loading ? <LeaveCardLoading count={3} /> : requesting.length > 0 &&
              requesting.map(l => (
                <div key={l.id} className="mt-4">
                  <LeaveCard leave={l} />
                </div>
              ))}
          </Grid>
        </Grid>
      </div>
    </>
  );
}
