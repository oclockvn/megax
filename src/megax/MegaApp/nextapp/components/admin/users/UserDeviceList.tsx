"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon/ListItemIcon";
import ListItemText from "@mui/material/ListItemText/ListItemText";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Badge from "@mui/material/Badge";
import LinearProgress from "@mui/material/LinearProgress";
import UndoIcon from "@mui/icons-material/Undo";
import Chip from "@mui/material/Chip";

import { Device } from "@/lib/models/device.model";
import { toast } from "react-hot-toast";
import { UserDeviceRecord } from "@/lib/models/user.model";
import { useConfirm } from "material-ui-confirm";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getDevices, returnDevice } from "@/lib/apis/user.api";
import UserDeviceListForm from "./UserDeviceListForm";

const DeviceIconSelector = dynamic(
  () => import("@/components/admin/devices/DeviceIconSelector")
);
const UserDeviceLoading = dynamic(
  () => import("@/components/common/skeletons/UserDeviceLoading")
);

type UserDeviceListProps = {
  devices?: Device[];
  userId: number;
};

export default function UserDeviceList({
  userId,
  devices,
}: UserDeviceListProps) {
  const [isAddVisible, setAddVisible] = useState(false);
  const [items, setItems] = useState<UserDeviceRecord[]>([]);
  const confirm = useConfirm();

  const toggleAddDeviceVisibility = () => {
    setAddVisible(!isAddVisible);
  };

  const returnDeviceMutation = useMutation({
    mutationFn: (deviceId: number) => returnDevice(userId, deviceId),
  });

  const handleReturn = async (deviceId: number) => {
    const result = await returnDeviceMutation.mutateAsync(deviceId);
    if (result?.data) {
      toast.success(`Successfully returned`);
      setItems(prev =>
        prev.map(d => ({
          ...d,
          returnedAt: d.id === deviceId ? new Date() : d.returnedAt,
        }))
      );
    }
  };

  const confirmReturn = (deviceId: number) => {
    confirm({
      description: "Return this device?",
      dialogProps: { maxWidth: "xs" },
    }).then(() => handleReturn(deviceId));
  };

  const { status, data } = useQuery({
    queryKey: ["admin/user-devices", userId],
    queryFn: () => getDevices(userId),
    enabled: userId > 0,
  });

  useEffect(() => {
    if (status === "success") {
      setItems(data || []);
    }
  }, [status, data]);

  const onAdded = (d: UserDeviceRecord) => {
    setItems(prev => [d, ...prev]);
    toast.success(`${d.name} is given successfully`);
  };

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
            endIcon={<UndoIcon />}
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

  const activeDeviceCount = items?.filter(d => d.returnedAt == null)?.length;

  const Header = () => (
    <div className="flex items-center">
      <h4 className="mr-6">Devices</h4>
      <Badge badgeContent={activeDeviceCount} color="primary"></Badge>
    </div>
  );

  const Body = () => {
    if (status === "pending") {
      return <UserDeviceLoading count={3} />;
    }

    return devices?.length ? (
      <List>
        {items?.map((i, idx) => (
          <React.Fragment key={idx}>
            <DeviceItem {...i} />
            <Divider />
          </React.Fragment>
        ))}
      </List>
    ) : (
      <div className="px-4 pt-4">
        <Alert severity="info">No devices yet!</Alert>
      </div>
    );
  };

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
              onClick={toggleAddDeviceVisibility}
              disabled={isAddVisible}
            >
              Add Device
            </Button>
          }
        />
        <CardContent className="px-0">
          {status === "pending" && <LinearProgress />}
          {isAddVisible && (
            <UserDeviceListForm
              userId={userId}
              devices={devices}
              onAdded={onAdded}
              onCancel={toggleAddDeviceVisibility}
            />
          )}

          <Body />
        </CardContent>
      </Card>
    </>
  );
}
