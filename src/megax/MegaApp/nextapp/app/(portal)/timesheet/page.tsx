"use client";

import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";

import React, { useState } from "react";
import Sheet from "@/components/portal/timesheet/Sheet";
import SheetNav from "@/components/portal/timesheet/SheetNav";
import dt from "@/lib/datetime";
import { WorkDay, WorkStatus } from "@/lib/models/timesheet.model";

export default function Timesheet() {
  const [current, setCurrent] = useState(new Date());
  const week = dt.getWeekDays(current);
  const days = week.map(
    d =>
      ({
        date: d,
        status: WorkStatus.Remote,
      } as WorkDay)
  );

  const navWeek = (dir: -1 | 0 | 1) => {
    switch (dir) {
      case 0:
        setCurrent(new Date());
        break;
      case -1:
        setCurrent(prev => dt.addDays(prev, -7));
        break;
      case 1:
        setCurrent(prev => dt.addDays(prev, 7));
        break;
    }
  };

  return (
    <div className="container mx-auto">
      <SheetNav week={days.map(d => d.date)} nav={navWeek} />

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

      <Sheet days={days} />
    </div>
  );
}
