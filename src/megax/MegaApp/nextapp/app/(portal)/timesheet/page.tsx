"use client";

import React, { useEffect } from "react";
import Divider from "@mui/material/Divider";

import dt from "@/lib/datetime";
import { useAppDispatch, useAppSelector } from "@/lib/store/state.hook";
import { fetchTimesheetThunk } from "@/lib/store/timesheet.state";

import Sheet  from "@/components/portal/timesheet/Sheet";
import SheetNav from "@/components/portal/timesheet/SheetNav";
import SheetWeek from "@/components/portal/timesheet/SheetWeek";

export default function Timesheet() {
  const { timesheet, current, loading, estimated } = useAppSelector(s => s.timesheet);
  const appDispatch = useAppDispatch();

  const week = dt.getWeekDays(current);

  useEffect(() => {
    appDispatch(fetchTimesheetThunk(current));
  }, [appDispatch, current]);

  return (
    <div className="container mx-auto">
      <SheetNav current={current} week={week} />

      <Divider className="my-4" />

      <SheetWeek week={week} />

      {timesheet.length > 0 && (
        <Sheet timesheet={timesheet} loading={loading} estimated={estimated} />
      )}
    </div>
  );
}
