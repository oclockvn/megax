"use client";

import Button from "@mui/material/Button";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import HomeIcon from "@mui/icons-material/Home";
import ApartmentIcon from "@mui/icons-material/Apartment";
import React, { useReducer } from "react";
import { WorkDay, WorkStatus } from "@/lib/models/timesheet.model";
import dt from "@/lib/datetime";

type _State = {
  loading: boolean;
  days: WorkDay[];
};

type _Action = {
  type: "update-status";
  payload: { date: Date; status: WorkStatus };
};

function reducer(state: _State, action: _Action) {
  switch (action.type) {
    case "update-status":
      const { date, status } = action.payload;
      state = {
        ...state,
        loading: false,
        days: state.days.map(d => ({
          ...d,
          status: d.date.getTime() === date.getTime() ? status : d.status,
        })),
      };
      break;
  }

  return state;
}

type SheetProps = {
  days: WorkDay[];
};

export default function Sheet(props: SheetProps) {
  const initState: _State = {
    loading: false,
    days: props.days,
  };

  const [state, dispatch] = useReducer(reducer, initState);

  return (
    <div className="grid grid-cols-8 mt-4">
      <div className="flex self-end justify-center">
        {/* <Avatar>QP</Avatar> */}
        <Button variant="contained" className="mb-[5px]">
          Register
        </Button>
      </div>

      {state.days.map(d => (
        <div
          key={d.date.getTime()}
          className="flex items-center justify-center"
        >
          {!dt.isWeekend(d.date) ? (
            <div>
              <ToggleButtonGroup
                value={d.status}
                exclusive
                onChange={(_, s) =>
                  dispatch({
                    type: "update-status",
                    payload: { date: d.date, status: s },
                  })
                }
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
            <div><b>Weekend</b></div>
          )}
        </div>
      ))}
    </div>
  );
}
