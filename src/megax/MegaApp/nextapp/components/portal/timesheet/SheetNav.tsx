"use client";

import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import dt from "@/lib/datetime";

import { navWeek as moveWeek } from "@/lib/store/userTimesheet.state";
import React, { memo } from "react";
import { useAppDispatch } from "@/lib/store/state.hook";

type SheetNavProps = {
  week: Date[];
  current: Date;
};

function SheetNav(props: SheetNavProps) {
  const appDispatch = useAppDispatch();
  const { week, current } = props;
  const start = week[0];
  const end = week.at(-1);
  const title = `${dt.formatDate(start, "do LLL")} - ${dt.formatDate(
    end!,
    "do LLL yyyy"
  )}`;
  const today = new Date();
  const canSwitchToday = !dt.isSameDay(current, today);
  const canNext =
    dt.startOfDay(start!).getTime() <= dt.startOfDay(today).getTime();

  const nav = (dir: -1 | 0 | 1) => {
    appDispatch(moveWeek(dir));
  };

  return (
    <div className="flex items-center my-4">
      <Button
        variant="outlined"
        className="me-4"
        disabled={!canSwitchToday}
        onClick={() => nav(0)}
      >
        Today
      </Button>
      <IconButton onClick={() => nav(-1)}>
        <NavigateBeforeIcon />
      </IconButton>
      <IconButton onClick={() => nav(1)} disabled={!canNext}>
        <NavigateNextIcon />
      </IconButton>
      <div className="ms-4 flex-1">{title}</div>
    </div>
  );
}

export default memo(
  SheetNav,
  (prev, curr) =>
    dt.isSameDay(prev.current, curr.current) &&
    dt.isSameDay(prev.week[0], curr.week[0])
);
