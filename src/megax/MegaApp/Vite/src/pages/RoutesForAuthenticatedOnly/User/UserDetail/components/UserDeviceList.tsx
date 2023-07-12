// import React from 'react',
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
import { Fragment, useEffect, useState } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../store/store.hook";
import { Device } from "../../../../../lib/models/device.model";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import { fetchDevicesThunk } from "../../../../../store/device.slice";
import { toast } from "react-toastify";
import {
  assignDeviceThunk,
  clearDeviceError,
} from "../../../../../store/userDevice.slice";

function UserDeviceAdd({
  userId,
  onCancel,
}: {
  userId: number;
  onCancel: () => void;
}) {
  const appDispatch = useAppDispatch();
  const { pagedDevices } = useAppSelector(s => s.deviceSlice);
  const { deviceError, deviceLoading, deviceLoadingState } = useAppSelector(
    s => s.userDeviceSlice
  );
  useEffect(() => {
    appDispatch(fetchDevicesThunk());
  }, []);

  const [value, setvalue] = useState<Device | null>(null);
  const handleAssignDevice = async () => {
    const result = await appDispatch(
      assignDeviceThunk({ userId, deviceId: Number(value?.id) })
    ).unwrap();
    result?.data && toast.success("Successfully assign");
  };

  const handleCloseError = () => {
    appDispatch(clearDeviceError());
  };

  return (
    <div className="p-4 bg-slate-100">
      {deviceError && (
        <Grid sx={{ marginBottom: "1rem" }}>
          <Alert
            severity="error"
            className="border border-red-500"
            onClose={handleCloseError}
          >
            {deviceError}
          </Alert>
        </Grid>
      )}
      <div>
        <Autocomplete
          options={pagedDevices.items}
          value={value}
          onChange={(_, d) => {
            setvalue(d);
          }}
          autoComplete
          renderInput={params => <TextField {...params} label="Device" />}
          renderOption={(attribute, obj) => (
            <li {...attribute} key={obj.id}>
              {obj.name}
              {obj.model ? " - " + obj.model : ""}
            </li>
          )}
          getOptionLabel={obj =>
            `${obj.name}${obj.model ? " - " + obj.model : ""}`
          }
        />
      </div>

      <div className="mt-2 flex gap-2">
        <Button
          variant="text"
          className="flex-1"
          type="button"
          onClick={onCancel}
        >
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

declare type UserDeviceLisProps = {
  userId: number;
};

function UserDeviceList({ userId }: UserDeviceLisProps) {
  const [isAddDeviceVisible, setIsAddDeviceVisible] = useState<boolean>(false);

  const toggleAddDeviceVisibility = () => {
    setIsAddDeviceVisible(!isAddDeviceVisible);
  };
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
              onClick={toggleAddDeviceVisibility}
              disabled={isAddDeviceVisible}
            >
              Add Device
            </Button>
          }
        />
        <CardContent className="px-0">
          {isAddDeviceVisible && (
            <UserDeviceAdd
              userId={userId}
              onCancel={toggleAddDeviceVisibility}
            />
          )}

          <List>
            {[1, 2, 3, 4].map(i => (
              <Fragment key={i}>
                <DeviceItem />
                <Divider />
              </Fragment>
            ))}
          </List>
        </CardContent>
        <CardActions></CardActions>
      </Card>
    </>
  );
}

export default UserDeviceList;
