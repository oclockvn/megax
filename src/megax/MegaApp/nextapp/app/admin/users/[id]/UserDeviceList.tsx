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
import CloseIcon from "@mui/icons-material/Close";
import ListItemText from "@mui/material/ListItemText/ListItemText";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import React from "react";
import { useAppSelector } from "@/lib/store/state.hook";

function UserDeviceAdd() {
  const { pagedDevices } = useAppSelector(s => s.devices);
  return (
    <div className="p-4 bg-slate-100">
      <div>
        <Autocomplete
          autoComplete
          options={pagedDevices.items}
          renderInput={params => <TextField {...params} label="Device" />}
          renderOption={(ele, o) => (
            <li {...ele} key={o.id}>
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
        >
          Add
        </Button>
      </div>
    </div>
  );
}

export default function UserDeviceList() {
  const DeviceItem = () => (
    <ListItem
      secondaryAction={
        <IconButton edge="end" aria-label="delete">
          <CloseIcon />
        </IconButton>
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
          <UserDeviceAdd />

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
