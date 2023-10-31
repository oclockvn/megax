"use client";

import Sheet from "@/components/portal/timesheet/Sheet";
import datetime from "@/lib/datetime";
import { makeArr } from "@/lib/helpers/array";
import { Timesheet, WorkType } from "@/lib/models/timesheet.model";

export default function TimesheetPage() {
  const week = datetime.getWeekDays(new Date());
  const users = makeArr(10).map(i => ({
    date: new Date(),
    workType: WorkType.Office,
    id: 0
  } as Timesheet));

  return (<>
  <Sheet timesheet={[]} />

  </>)
}
