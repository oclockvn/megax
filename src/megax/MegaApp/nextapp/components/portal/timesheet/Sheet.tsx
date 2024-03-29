"use client";

import Button from "@mui/material/Button";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import HomeIcon from "@mui/icons-material/Home";
import ApartmentIcon from "@mui/icons-material/Apartment";
import WeekendIcon from "@mui/icons-material/Weekend";
import InfoIcon from "@mui/icons-material/Info";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import React from "react";
import dt from "@/lib/datetime";
import { Timesheet, WorkType } from "@/lib/models/timesheet.model";
import { useAppDispatch } from "@/lib/store/state.hook";
import {
  applyTimesheetThunk,
  updateWeekStatus,
} from "@/lib/store/timesheet.state";
import { useConfirm } from "material-ui-confirm";
import toast from "react-hot-toast";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";

type SheetProps = {
  timesheet: Timesheet[];
  loading?: boolean;
  username?: string;
  estimated?: boolean;
};

export default function Sheet({
  timesheet,
  username,
  loading,
  estimated,
}: SheetProps) {
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

  const canApply = timesheet.some(d => dt.isFuture(d.date));
  const readonly = !!username;

  const SheetAction = (d: Timesheet) => {
    return (
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
    );
  };

  return (
    <div className="grid grid-cols-8 mt-4">
      <div
        className={`flex justify-center ${
          readonly ? "items-center" : "self-end"
        }`}
      >
        {readonly ? (
          <Avatar>QP</Avatar>
        ) : (
          <div>
            {!!estimated && (
              <Tooltip title="Based on previous timesheet" placement="right">
                <div className="flex items-center text-sm">
                  Estimated <InfoIcon color="primary" fontSize="small" />
                </div>
              </Tooltip>
            )}
            <Button
              variant="contained"
              className="mb-[5px]"
              onClick={() => handleRegister()}
              disabled={loading || !canApply}
            >
              APPLY
            </Button>
          </div>
        )}
      </div>

      {timesheet.map(d => (
        <div
          key={d.date.getTime()}
          className="flex items-center justify-center"
        >
          {!dt.isWeekend(d.date) ? (
            loading ? (
              <MoreHorizIcon />
            ) : (
              <div>
                <div
                  className={`text-center font-bold ${
                    d.workType === WorkType.Office
                      ? "text-blue-500"
                      : "text-fuchsia-500"
                  }`}
                >
                  {d.workType === WorkType.Office ? "Office" : "Remote"}
                </div>
                {dt.isFuture(d.date) && !readonly ? (
                  <SheetAction {...d} />
                ) : (
                  <div className="flex items-center justify-center h-[48px] text-blue-500">
                    {d.workType === WorkType.Office ? (
                      <ApartmentIcon />
                    ) : (
                      <HomeIcon />
                    )}
                  </div>
                )}
              </div>
            )
          ) : (
            <div className="text-center">
              <span>Weekend</span>
              <div className="h-[48px] flex items-center justify-center">
                <WeekendIcon />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
