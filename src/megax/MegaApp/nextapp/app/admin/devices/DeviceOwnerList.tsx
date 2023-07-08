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
import { DeviceOwnerRecord } from "@/lib/models/device.model";
import { getOwnersThunk } from "@/lib/store/userDevice.state";
import Alert from "@mui/material/Alert";
import LinearProgress from "@mui/material/LinearProgress";
import Link from "next/link";
import Grid from "@mui/material/Grid";
import dateLib from "@/lib/datetime";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import RedoIcon from "@mui/icons-material/Redo";

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

  const OwnerItem = (d: DeviceOwnerRecord) => (
    <ListItem>
      <ListItemText
        primary={
          <Grid
            container
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Grid item>
              <Link
                href={`/admin/users/${d.id}`}
                className="text-blue-400"
                title="Open user"
              >
                {d.fullName}
              </Link>
            </Grid>
            <Grid item position={"relative"}>
              <div>
                <small className="text-green-500 flex items-center">
                  <EventAvailableIcon className="mr-2" fontSize="small" />
                  Taken in {dateLib.formatDate(d.takenAt, "dd/MM/yyyy")}
                </small>
              </div>
              {d.returnedAt && (
                <small className="text-gray-400 absolute right-0 whitespace-nowrap">
                  <RedoIcon className="mr-2" fontSize="small" />
                  Returned in {dateLib.formatDate(d.returnedAt, "dd/MM/yyyy")}
                </small>
              )}
            </Grid>
          </Grid>
        }
        secondary={d.email}
      />
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
                <React.Fragment key={i.id}>
                  <OwnerItem {...i} />
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
