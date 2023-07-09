import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useNavigate, useParams } from "react-router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { NavLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../store/store.hook";
import { useEffect } from "react";
import {
  clearDevice,
  fetchDeviceTypesThunk,
} from "../../../../store/device.slice";
import DeviceInfo from "../DeviceDetail/components/DeviceInfo";

function NewDevicePage() {
  const params = useParams();
  const id = params.id;
  const navigate = useNavigate();

  const appDispatch = useAppDispatch();
  const { device, error, deviceTypes } = useAppSelector(
    state => state.deviceSlice
  );

  useEffect(() => {
    appDispatch(fetchDeviceTypesThunk());
    return () => {
      appDispatch(clearDevice());
    };
  }, [id]);

  const redirectToPage = (id: number) => {
    navigate(`/devices/${id}`);
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
          <div>{device?.name || "New Device"}</div>
        </Breadcrumbs>
      </div>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <DeviceInfo deviceTypes={deviceTypes} onAdded={redirectToPage} />
        </Grid>
        <Grid item xs={4}>
          Sidebar
        </Grid>
      </Grid>
    </Box>
  );
}

export default NewDevicePage;
