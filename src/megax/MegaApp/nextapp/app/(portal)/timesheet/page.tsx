"use client";

import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";

import React, { useEffect } from "react";
import Sheet from "@/components/portal/timesheet/Sheet";
import SheetNav from "@/components/portal/timesheet/SheetNav";
import dt from "@/lib/datetime";
import { useAppDispatch, useAppSelector } from "@/lib/store/state.hook";
import { fetchTimesheetThunk } from "@/lib/store/userTimesheet.state";

export default function Timesheet() {
  const { timesheet, current, loading } = useAppSelector(s => s.userTimesheet);
  const appDispatch = useAppDispatch();

  const week = dt.getWeekDays(current);

  useEffect(() => {
    appDispatch(fetchTimesheetThunk(current));
  }, [appDispatch, current]);

  return (
    <div className="container mx-auto">
      <SheetNav current={current} week={week} />

      <Divider className="my-4" />

      <div className="grid grid-cols-8">
        <div>{/* empty */}</div>

        {week.map(d => (
          <div key={d.getTime()} className="flex items-center justify-center">
            <div className="text-center">
              <div className={dt.isToday(d) ? "text-blue-500" : ""}>
                {dt.formatDate(d, "eee")}
              </div>
              <Avatar
                sizes="30"
                className={dt.isToday(d) ? "bg-blue-500 text-white" : ""}
              >
                {dt.formatDate(d, "dd")}
              </Avatar>
            </div>
          </div>
        ))}
      </div>

      {timesheet.length > 0 && <Sheet timesheet={timesheet} loading={loading} />}
    </div>
  );
}
