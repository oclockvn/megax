"use client";

import dynamic from "next/dynamic";
import React, { useEffect } from "react";
import Divider from "@mui/material/Divider";

import dt from "@/lib/datetime";
import { useAppDispatch, useAppSelector } from "@/lib/store/state.hook";
import { fetchTimesheetThunk } from "@/lib/store/timesheet.state";

const Sheet = dynamic(() => import("@/components/portal/timesheet/Sheet"), {
  ssr: false,
});
const SheetNav = dynamic(
  () => import("@/components/portal/timesheet/SheetNav"),
  { ssr: false }
);
const SheetWeek = dynamic(
  () => import("@/components/portal/timesheet/SheetWeek"),
  { ssr: false }
);

export default function Timesheet() {
  const { timesheet, current, loading } = useAppSelector(s => s.timesheet);
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
        <Sheet timesheet={timesheet} loading={loading} />
      )}
    </div>
  );
}
