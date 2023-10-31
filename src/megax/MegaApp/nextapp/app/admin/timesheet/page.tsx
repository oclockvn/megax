"use client";

import datetime from "@/lib/datetime";
import { Timesheet, WorkType } from "@/lib/models/timesheet.model";
import { useAppSelector } from "@/lib/store/state.hook";
import { Divider } from "@mui/material";
import dynamic from "next/dynamic";

const Sheet = dynamic(() => import("@/components/portal/timesheet/Sheet"));
const SheetNav = dynamic(
  () => import("@/components/portal/timesheet/SheetNav")
);
const SheetWeek = dynamic(
  () => import("@/components/portal/timesheet/SheetWeek")
);

export default function TimesheetPage() {
  const { timesheet, current, loading } = useAppSelector(s => s.timesheet);

  const week = datetime.getWeekDays(current);

  // useEffect(() => {
  //   appDispatch(fetchTimesheetThunk(current));
  // }, [appDispatch, current]);

  let users: Timesheet[][] = [];
  for (let i = 0; i < 100; i++) {
    let sheet: Timesheet[] = [];
    for (let d of week) {
      sheet.push({
        date: d,
        workType: d.getDay() < 3 ? WorkType.Office : WorkType.Remote,
        id: 0,
      });
    }

    users.push(sheet);
  }

  return (
    <div className="container mx-auto mt-8">
      <SheetNav current={current} week={week} />

      <Divider className="mt-4" />

      <div className="bg-white bg-opacity-80 py-4 sticky top-0 z-10 full-bleed shadow-[#fff]">
        <SheetWeek week={week} />
      </div>

      <Divider className="mb-4" />

      {users.map((t, i) => (
        <div key={i}>
          <Sheet username="QP" timesheet={t} />
          <Divider />
        </div>
      ))}

      <div className="h-[100px]"></div>
    </div>
  );
}
