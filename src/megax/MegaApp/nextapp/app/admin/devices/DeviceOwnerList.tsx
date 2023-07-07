"use client";

import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText/ListItemText";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/state.hook";
import { DeviceOwner } from "@/lib/models/device.model";
import { getOwnersThunk } from "@/lib/store/userDevice.state";
import Alert from "@mui/material/Alert";
import Badge from "@mui/material/Badge";
import LinearProgress from "@mui/material/LinearProgress";

declare type DeviceOwnerProps = {
  deviceId: number;
};

export default function DeviceOwnerList({ deviceId }: DeviceOwnerProps) {
  const appDispatch = useAppDispatch();
  const { owners, loading } = useAppSelector(s => s.userDevice);

  useEffect(() => {
    if (deviceId > 0) {
      appDispatch(getOwnersThunk(deviceId));
    }
  }, [deviceId]);

  const DeviceItem = (d: DeviceOwner) => (
    <ListItem
      secondaryAction={
        <Badge className="mr-3" badgeContent={d.qty} color="primary"></Badge>
      }
    >
      <ListItemText primary={`${d.fullName}`} secondary={d.email} />
    </ListItem>
  );

  return (
    <>
      <Card>
        <CardHeader title={<h4>Owners</h4>} />
        <CardContent className="px-0">
          {loading && <LinearProgress />}
          {owners?.length ? (
            <List>
              {owners.map(i => (
                <React.Fragment key={i.userId}>
                  <DeviceItem {...i} />
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          ) : (
            <div className="px-4 pt-4">
              <Alert severity="info">No owners yet!</Alert>
            </div>
          )}
        </CardContent>
        <CardActions></CardActions>
      </Card>
    </>
  );
}
