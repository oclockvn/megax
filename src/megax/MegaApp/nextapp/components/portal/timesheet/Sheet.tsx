"use client";

import Button from "@mui/material/Button";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import HomeIcon from "@mui/icons-material/Home";
import ApartmentIcon from "@mui/icons-material/Apartment";
import React, {  } from "react";
import { WorkDay, WorkStatus } from "@/lib/models/timesheet.model";
import dt from "@/lib/datetime";
import { useAppDispatch } from "@/lib/store/state.hook";
import { updateWeekStatus } from "@/lib/store/userTimesheet.state";

type SheetProps = {
  days: WorkDay[];
};

export default function Sheet({ days }: SheetProps) {
  const appDispatch = useAppDispatch();

  const handleRegister = () => {
    console.log(days);
  };

  const handleUpdateStatus = (date: Date, status: WorkStatus) => {
    appDispatch(
      updateWeekStatus({
        date,
        status,
      })
    );
  };

  return (
    <div className="grid grid-cols-8 mt-4">
      <div className="flex self-end justify-center">
        {/* <Avatar>QP</Avatar> */}
        <Button
          variant="contained"
          className="mb-[5px]"
          onClick={() => handleRegister()}
        >
          Apply
        </Button>
      </div>

      {days.map(d => (
        <div
          key={d.date.getTime()}
          className="flex items-center justify-center"
        >
          {!dt.isWeekend(d.date) ? (
            <div>
              <ToggleButtonGroup
                value={d.status}
                exclusive
                onChange={(_, s) => handleUpdateStatus(d.date, s)}
                aria-label="Work location"
                color="primary"
              >
                <ToggleButton
                  value={WorkStatus.Office}
                  aria-label="left aligned"
                  title="Office"
                >
                  <ApartmentIcon />
                </ToggleButton>
                <ToggleButton
                  value={WorkStatus.Remote}
                  aria-label="centered"
                  title="Working remotely"
                >
                  <HomeIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            </div>
          ) : (
            <div>
              <b>Weekend</b>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
