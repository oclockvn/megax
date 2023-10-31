"use client";

import Avatar from "@mui/material/Avatar";

import React from "react";
import dt from "@/lib/datetime";

export default function SheetWeek({ week }: { week: Date[] }) {
  return (
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
  );
}
