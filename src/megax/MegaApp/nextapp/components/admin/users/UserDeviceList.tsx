"use client";

import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon/ListItemIcon";
import ListItemText from "@mui/material/ListItemText/ListItemText";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/state.hook";
import { Device } from "@/lib/models/device.model";
import {
  assignDeviceThunk,
  clearError,
  getUserDevicesThunk,
  returnDeviceThunk,
} from "@/lib/store/userDevice.state";
import Alert from "@mui/material/Alert";
import { toast } from "react-hot-toast";
import { UserDeviceRecord } from "@/lib/models/user.model";
import Badge from "@mui/material/Badge";
import LinearProgress from "@mui/material/LinearProgress";
import { useConfirm } from "material-ui-confirm";
import Link from "next/link";
import DeviceIconSelector from "@/components/admin/devices/DeviceIconSelector";
import Chip from "@mui/material/Chip";

function UserDeviceAdd({
  userId,
  onCancel,
}: {
  userId: number;
  onCancel: () => void;
}) {
  const appDispatch = useAppDispatch();
  const { pagedDevices } = useAppSelector(s => s.devices);
  const { error } = useAppSelector(s => s.userDevice);
  const [value, setValue] = useState<Device | null>(null);

  const handleAssignDevice = async () => {
    const result = await appDispatch(
      assignDeviceThunk({ userId, deviceId: Number(value?.id) })
    ).unwrap();

    if (result?.data) {
      toast.success("Successfully assign");
    }
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
              {o.name} - {o.serialNumber ? o.serialNumber : "N/A"}
            </li>
          )}
          getOptionLabel={o => `${o.name} - ${o.serialNumber}`}
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

declare type UserDeviceListProps = {
  userId: number;
};

export default function UserDeviceList({ userId }: UserDeviceListProps) {
  const [isAddVisible, setAddVisible] = useState(false);
  const appDispatch = useAppDispatch();
  const confirm = useConfirm();
  const { devices, loading } = useAppSelector(s => s.userDevice);

  const toggleAddDeviceVisibility = () => {
    setAddVisible(!isAddVisible);
  };

  const handleReturn = async (deviceId: number) => {
    const result = await appDispatch(
      returnDeviceThunk({ userId, deviceId })
    ).unwrap();
    result?.data === true && toast.success(`Successfully returned`);
  };

  const confirmReturn = (deviceId: number) => {
    confirm({
      description: "Return this device?",
      dialogProps: { maxWidth: "xs" },
    })
      .then(() => handleReturn(deviceId))
      .catch(() => {
        /*ignore*/
      });
  };

  useEffect(() => {
    if (userId > 0) {
      appDispatch(getUserDevicesThunk(userId));
    }
  }, [userId]);

  const DeviceItem = (d: UserDeviceRecord) => (
    <ListItem
      className={d.returnedAt ? "bg-slate-100" : ""}
      secondaryAction={
        d.returnedAt ? (
          <div className="flex items-center">
            <Chip
              label="RETURNED"
              size="small"
              color="info"
              className="text-xs"
            />
          </div>
        ) : (
          <Button
            title="Return device to admin"
            type="button"
            variant="text"
            size="small"
            onClick={() => confirmReturn(d.id)}
          >
            Return
          </Button>
        )
      }
    >
      <ListItemIcon>
        <DeviceIconSelector deviceType={d.deviceType} />
      </ListItemIcon>
      <ListItemText
        primary={
          <Link
            href={`/admin/devices/${d.id}`}
            title="Open device"
            className="text-blue-400"
          >
            {d.name} - {d.deviceType}
          </Link>
        }
        secondary={d.serialNumber}
      />
    </ListItem>
  );

  const activeDeviceCount = devices?.filter(d => d.returnedAt == null)?.length;

  const Header = () => (
    <div className="flex items-center">
      <h4 className="mr-6">Devices</h4>
      <Badge badgeContent={activeDeviceCount} color="primary"></Badge>
    </div>
  );

  return (
    <>
      <Card>
        <CardHeader
          title={<Header />}
          action={
            <Button
              type="button"
              variant="contained"
              size="small"
              className="bg-blue-500 text-white hover:!bg-blue-600"
              onClick={toggleAddDeviceVisibility}
              disabled={isAddVisible}
            >
              Add Device
            </Button>
          }
        />
        <CardContent className="px-0">
          {loading && <LinearProgress />}
          {isAddVisible && (
            <UserDeviceAdd
              userId={userId}
              onCancel={toggleAddDeviceVisibility}
            />
          )}

          {devices?.length ? (
            <List>
              {devices.map(i => (
                <React.Fragment key={i.id}>
                  <DeviceItem {...i} />
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          ) : (
            <div className="px-4 pt-4">
              <Alert severity="info">No devices yet!</Alert>
            </div>
          )}
        </CardContent>
        <CardActions></CardActions>
      </Card>
    </>
  );
}
