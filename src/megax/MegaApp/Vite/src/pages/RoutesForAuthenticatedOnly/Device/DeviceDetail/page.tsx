import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useNavigate, useParams } from "react-router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { NavLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/store.hook";
import { useEffect } from "react";
import DeviceInfo from "./components/DeviceInfo";
import {
  clearDevice,
  fetchDeviceDetailThunk,
  fetchDeviceTypesThunk,
} from "@/store/devices.slice";
import DeviceOwnerList from "./components/DeviceOwnerList";
import { fetchSuppliersThunk } from "@/store/suppliers.slice";

function DeviceDetailPage() {
  const params = useParams();
  const id: any = params.id;
  const navigate = useNavigate();
  const appDispatch = useAppDispatch();
  const { device, error, deviceTypes } = useAppSelector(
    state => state.deviceSlice
  );
  useEffect(() => {
    appDispatch(fetchDeviceDetailThunk(id));
    appDispatch(fetchDeviceTypesThunk());
    appDispatch(fetchSuppliersThunk());
    return () => {
      appDispatch(clearDevice());
    };
  }, [id]);
  const onDeviceDeleted = () => {
    navigate("/devices");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <div role="presentation" className="bg-blue-200 py-2 px-6">
        <Breadcrumbs aria-label="breadcrumb">
          <NavLink
            color="inherit"
            to={`/devices`}
            className="text-blue-500 flex items-center"
          >
            <ArrowBackIcon className="mr-2" />
            Devices
          </NavLink>
          <div>{device?.name || "..."}</div>
        </Breadcrumbs>
      </div>
      <Grid container spacing={2} className="p-4">
        <Grid item xs={8}>
          <DeviceInfo
            device={device}
            deviceTypes={deviceTypes}
            onDeleted={onDeviceDeleted}
          />
        </Grid>
        <Grid item xs={4}>
          {id > 0 && <DeviceOwnerList deviceId={id} />}
        </Grid>
      </Grid>
    </Box>
  );
}

export default DeviceDetailPage;
