"use client";

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import Paper from "@mui/material/Paper";

export type LeaveSlotProps = {
  total: number;
  taken: number;
};

export default function LeaveSlot({ total, taken }: LeaveSlotProps) {
  const items = Array.from({ length: total }, (v, i) => i);

  return (
    <>
      <Paper className="overflow-hidden">
        <div className="slots flex overflow-hidden">
          {items.map((i, index) => (
            <div
              key={i}
              className={`min-h-[30px] flex-[1] flex items-center justify-center text-center ${
                i < taken ? "bg-lime-500" : "text-black"
              } ${index > 0 ? "border-l border-solid border-lime-600" : ""}`}
            >
              {i < taken ? <CloseIcon className="text-slate-800" /> : i + 1}
            </div>
          ))}
        </div>
      </Paper>
    </>
  );
}
