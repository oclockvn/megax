"use client";

import { LeaveDate } from "@/lib/models/leave.model";
import Paper from "@mui/material/Paper";
import dt from '@/lib/datetime';

export type LeaveSlotProps = {
  total: number;
  approved: LeaveDate[]
};

export default function LeaveSlot({ total, approved }: LeaveSlotProps) {
  const items = Array.from({ length: total }, (v, i) => i);
  const taken = approved?.length || 0;

  return (
    <>
      <Paper className="overflow-hidden">
        <div className="slots flex overflow-hidden">
          {items.map((i, index) => (
            <div
              key={i}
              className={`min-h-[30px] flex-[1] flex items-center justify-center text-center text-xs ${
                i < taken ? "bg-lime-500" : "text-black"
              } ${index > 0 ? "border-l border-solid border-lime-600" : ""}`}
            >
              {i < taken ? dt.formatDate(approved[i].date, 'dd/MM') : (i + 1 - taken)}
            </div>
          ))}
        </div>
      </Paper>
    </>
  );
}
