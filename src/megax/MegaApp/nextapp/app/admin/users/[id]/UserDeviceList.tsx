"use client";

import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon/ListItemIcon";
import ComputerIcon from "@mui/icons-material/Computer";
import ListItemText from "@mui/material/ListItemText/ListItemText";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/state.hook";
import { Device } from "@/lib/models/device.model";
import { assignDeviceThunk, clearError } from "@/lib/store/userDevice.state";
import Alert from "@mui/material/Alert";
import { toast } from "react-hot-toast";

function UserDeviceAdd({ userId }: { userId: number }) {
  const appDispatch = useAppDispatch();
  const { pagedDevices } = useAppSelector(s => s.devices);
  const { error, loading, loadingState } = useAppSelector(s => s.userDevice);
  const [value, setValue] = useState<Device | null>();

  const handleAssignDevice = async () => {
    const result = await appDispatch(
      assignDeviceThunk({ userId, deviceId: Number(value?.id) })
    ).unwrap();
    result?.data === true && toast.success("Successfully assign");
  };

  const handleCloseError = () => {
    appDispatch(clearError());
  };

  return (
    <div className="p-4 bg-slate-100">
      {error && (
        <div className="mb-5">
          <Alert
            severity="error"
            className="border-red-500 border-solid border"
            onClose={handleCloseError}
          >
            {error}
          </Alert>
        </div>
      )}

      <div>
        <Autocomplete
          value={value}
          onChange={(_, d) => setValue(d)}
          autoComplete
          options={pagedDevices.items}
          renderInput={params => <TextField {...params} label="Device" />}
          renderOption={(attrs, o) => (
            <li {...attrs} key={o.id}>
              {o.name}
              {o.model ? " - " + o.model : ""}
            </li>
          )}
          getOptionLabel={o => `${o.name}${o.model ? " - " + o.model : ""}`}
        />
      </div>

      <div className="mt-2 flex gap-2">
        <Button variant="text" className="flex-1" type="button">
          Cancel
        </Button>
        <Button
          className="bg-blue-400 hover:!bg-blue-500 text-white flex-1"
          type="button"
          onClick={handleAssignDevice}
        >
          Add
        </Button>
      </div>
    </div>
  );
}

declare type UserDeviceListProps = {
  userId: number;
};

export default function UserDeviceList({ userId }: UserDeviceListProps) {
  const DeviceItem = () => (
    <ListItem
      secondaryAction={
        <Button
          title="Return device to admin"
          type="button"
          variant="text"
          size="small"
        >
          Return
        </Button>
      }
    >
      <ListItemIcon>
        <ComputerIcon />
      </ListItemIcon>
      <ListItemText primary="Device" secondary="Asus" />
    </ListItem>
  );

  return (
    <>
      <Card>
        <CardHeader
          title={<h4>Devices</h4>}
          action={
            <Button
              type="button"
              variant="contained"
              size="small"
              className="bg-blue-500 text-white hover:!bg-blue-600"
            >
              Add Device
            </Button>
          }
        />
        <CardContent className="px-0">
          <UserDeviceAdd userId={userId} />

          <List>
            {[1, 2, 3, 4].map(i => (
              <React.Fragment key={i}>
                <DeviceItem />
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </CardContent>
        <CardActions></CardActions>
      </Card>
    </>
  );
}
