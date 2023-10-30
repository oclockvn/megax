"use client";

import Button from "@mui/material/Button";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import HomeIcon from "@mui/icons-material/Home";
import ApartmentIcon from "@mui/icons-material/Apartment";
import React from "react";
import dt from "@/lib/datetime";
import { Timesheet, WorkType } from "@/lib/models/timesheet.model";
import { useAppDispatch } from "@/lib/store/state.hook";
import {
  applyTimesheetThunk,
  updateWeekStatus,
} from "@/lib/store/userTimesheet.state";
import { useConfirm } from "material-ui-confirm";
import toast from "react-hot-toast";

type SheetProps = {
  timesheet: Timesheet[];
  loading?: boolean;
};

export default function Sheet({ timesheet, loading }: SheetProps) {
  const appDispatch = useAppDispatch();
  const confirmation = useConfirm();

  const handleRegister = () => {
    confirmation({
      title: "Register your timesheet",
      description:
        "You're able to update timesheet as long as it's in the future",
      dialogProps: {
        maxWidth: "xs",
      },
    })
      .then(() => {
        appDispatch(
          applyTimesheetThunk({
            timesheet: timesheet,
          })
        )
          .unwrap()
          .then(res => {
            if (res.success) {
              toast.success(`Timesheet applied successfully`);
              return;
            }

            toast.error(`Could not apply timesheet. Error code: ${res.code}`);
          });
      })
      .catch(() => {
        /*ignore*/
      });
  };

  const handleUpdateStatus = (date: Date, status: WorkType) => {
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
          disabled={loading}
        >
          APPLY
        </Button>
      </div>

      {timesheet.map(d => (
        <div
          key={d.date.getTime()}
          className="flex items-center justify-center"
        >
          {!dt.isWeekend(d.date) ? (
            <div>
              <div
                className={`text-center font-bold ${
                  d.workType === WorkType.Office
                    ? " text-blue-500"
                    : "text-fuchsia-500"
                }`}
              >
                {d.workType === WorkType.Office ? "Office" : "Remote"}
              </div>
              <ToggleButtonGroup
                value={d.workType}
                exclusive
                onChange={(_, s) => handleUpdateStatus(d.date, s)}
                aria-label="Work location"
                color="primary"
              >
                <ToggleButton
                  value={WorkType.Office}
                  aria-label="left aligned"
                  title="Office"
                >
                  <ApartmentIcon />
                </ToggleButton>
                <ToggleButton
                  value={WorkType.Remote}
                  aria-label="centered"
                  title="Working remotely"
                >
                  <HomeIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            </div>
          ) : (
            <div className="pt-[1rem]">
              <b>Weekend</b>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
