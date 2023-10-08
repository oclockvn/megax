"use client";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { LeaveTime } from "@/lib/models/leave.model";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import Add from "@mui/icons-material/Add";
import dt from "@/lib/datetime";
import { useReducer } from "react";
import IconButton from "@mui/material/IconButton";
import Close from "@mui/icons-material/Close";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

type LeaveDatePickerProps = {};

type LeaveDate = {
  id: number;
  date: Date;
  time: LeaveTime;
};

type _ActionType = "add" | "update" | "remove";

function reducer(
  state: LeaveDate[],
  action: { type: _ActionType; payload?: any }
) {
  switch (action.type) {
    case "add":
      const maxDate =
        state
          .map(s => s.date)
          .sort((a, b) => a.getTime() - b.getTime())
          .at(-1) || new Date();
      const suggestDate = dt.getNextWeekDay(maxDate);

      return [
        ...state,
        { id: suggestDate.getTime(), date: suggestDate, time: LeaveTime.All },
      ];
    case "update":
      const { id, date, time } = action.payload;
      return state.map(
        s =>
          ({
            ...s,
            date: s.date,
            time: s.id === id ? time : s.time,
          } as LeaveDate)
      );
    case "remove":
      return state.filter(s => s.id !== Number(action.payload));
  }

  return state;
}

export default function LeaveDatePicker() {
  const initState: LeaveDate[] = [
    { id: 0, date: dt.getNextWeekDay(new Date()), time: LeaveTime.All },
  ];

  const [state, dispatch] = useReducer(reducer, initState);
  const maxRequestDate = new Date();
  maxRequestDate.setMonth(maxRequestDate.getMonth() + 3); // max request is up to 3 months

  const handleAdd = () => {
    dispatch({
      type: "add",
    });
  };

  const handleUpdateTime = (leave: LeaveDate, time: LeaveTime) => {
    dispatch({
      type: "update",
      payload: { id: leave.id, date: leave.date, time },
    });
  };

  const handleRemove = (id: number) => {
    dispatch({
      type: "remove",
      payload: id,
    });
  };

  const maxRequest = state.length >= 5;

  return (
    <>
      <div>
        {state.map(item => (
          <Grid
            container
            spacing={2}
            alignItems={"center"}
            key={item.id}
            className="mb-2"
          >
            <Grid item md={6}>
              <DatePicker
                label="Leave date"
                // name={`leaveDate_${item.id}`}
                format="dd/MM/yyyy"
                maxDate={maxRequestDate}
                minDate={new Date(1950, 0, 1)}
                shouldDisableDate={d => dt.isWeekend(d)}
                // defaultValue={item.date}
                value={item.date}
              />
            </Grid>
            <Grid item md={5}>
              <ToggleButtonGroup
                exclusive
                color="secondary"
                value={item.time}
                onChange={(_, time) => handleUpdateTime(item, time)}
              >
                {/* <ToggleButton value={LeaveTime.All}>All day</ToggleButton> */}
                <ToggleButton value={LeaveTime.AM}>AM</ToggleButton>
                <ToggleButton value={LeaveTime.PM}>PM</ToggleButton>
              </ToggleButtonGroup>
            </Grid>
            <Grid item md={1}>
              <IconButton
                size="small"
                color="warning"
                onClick={() => handleRemove(item.id)}
                disabled={state.length === 1}
              >
                <Close fontSize="small" />
              </IconButton>
            </Grid>
          </Grid>
        ))}

        {maxRequest ? (
          <Alert severity="warning">
            <AlertTitle>You've reached maximum days per request!</AlertTitle>
            Request another leave for more days
          </Alert>
        ) : (
          <Button size="small" startIcon={<Add />} onClick={handleAdd}>
            Add date
          </Button>
        )}
      </div>
    </>
  );
}
