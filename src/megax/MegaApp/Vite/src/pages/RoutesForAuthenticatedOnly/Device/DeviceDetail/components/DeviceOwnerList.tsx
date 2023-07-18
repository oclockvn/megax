import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText/ListItemText";
import { Fragment, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store.hook";
import { Device, DeviceOwnerRecord } from "@/lib/models/device.model";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import dateLib from "@/lib/datetime";
import { toast } from "react-toastify";
import { getOwnersThunk } from "@/store/userDevice.slice";
import Badge from "@mui/material/Badge";
import { LinearProgress, Link } from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import RedoIcon from "@mui/icons-material/Redo";

declare type DeviceOwnerListProps = {
  deviceId: number;
};

function DeviceOwnerList({ deviceId }: DeviceOwnerListProps) {
  const appDispatch = useAppDispatch();

  const { owners, loading } = useAppSelector(s => s.userDeviceSlice);

  useEffect(() => {
    deviceId > 0 && appDispatch(getOwnersThunk(deviceId));
  }, [deviceId]);

  const OwnerItem = (owners: DeviceOwnerRecord) => (
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
                href={`/users/${owners.id}`}
                className="text-blue-400"
                title="Open user"
              >
                {owners.fullName}
              </Link>
            </Grid>
            <Grid item position={"relative"}>
              <div>
                <small className="text-green-500 flex items-center">
                  <EventAvailableIcon className="mr-2" fontSize="small" />
                  Taken in{" "}
                  {dateLib.formatDate(new Date(owners.takenAt), "dd/MM/yyyy")}
                </small>
              </div>
              {owners.returnedAt && (
                <small className="text-gray-400 absolute right-0 whitespace-nowrap">
                  <RedoIcon className="mr-2" fontSize="small" />
                  Returned in{" "}
                  {dateLib.formatDate(new Date(owners.takenAt), "dd/MM/yyyy")}
                </small>
              )}
            </Grid>
          </Grid>
        }
        secondary={owners.email}
      />
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
            <div className="px-4 pt-4">
              <Alert severity="info">No owner yet!</Alert>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}

export default DeviceOwnerList;
