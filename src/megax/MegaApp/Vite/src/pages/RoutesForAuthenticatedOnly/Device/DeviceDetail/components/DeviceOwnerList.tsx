// import React from 'react',
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

import ListItemText from "@mui/material/ListItemText/ListItemText";

import { Fragment, useEffect, useState } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../store/store.hook";
import {
  Device,
  DeviceOwnerRecord,
} from "../../../../../lib/models/device.model";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";

import { toast } from "react-toastify";
import { getOwnersThunk } from "../../../../../store/userDevice.slice";
import Badge from "@mui/material/Badge";

import { LinearProgress, Link } from "@mui/material";

declare type DeviceOwnerListProps = {
  deviceId: number;
};

function DeviceOwnerList({ deviceId }: DeviceOwnerListProps) {
  const appDispatch = useAppDispatch();

  const { owners, loading } = useAppSelector(s => s.userDeviceSlice);

  useEffect(() => {
    deviceId > 0 && appDispatch(getOwnersThunk(deviceId));
  }, [deviceId]);

  const OwnerItem = (devices: DeviceOwnerRecord) => (
    <ListItem
      secondaryAction={<Badge badgeContent={1} color="primary"></Badge>}
    >
      <ListItemText primary={`${devices.fullName}`} secondary={devices.email} />
    </ListItem>
  );

  return (
    <>
      <Card>
        <CardHeader title={<h4 className="mr-6">Owners </h4>} />
        <CardContent className="px-0">
          {loading && <LinearProgress />}

          {owners?.length ? (
            <List>
              {owners.map(item => (
                <Fragment key={item.id}>
                  <OwnerItem {...item} />
                  <Divider />
                </Fragment>
              ))}
            </List>
          ) : (
            <div className="px-4">
              <Alert severity="info">No owner yet!</Alert>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}

export default DeviceOwnerList;
