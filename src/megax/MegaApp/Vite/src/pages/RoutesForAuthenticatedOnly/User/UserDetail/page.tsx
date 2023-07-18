import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import UserInfo from "./components/UserInfo";
import { useParams } from "react-router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { NavLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../store/store.hook";
import { useEffect } from "react";
import { clearUser, fetchUserDetailThunk } from "../../../../store/users.slice";
import UserDeviceList from "./components/UserDeviceList";

function UserDetailPage() {
  const params = useParams();
  const id: any = params.id;
  const appDispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.userSlice);

  useEffect(() => {
    appDispatch(fetchUserDetailThunk(id));
    return () => {
      appDispatch(clearUser());
    };
  }, [id]);

  return (
    <div>
      <div role="presentation" className="bg-blue-200 py-2 px-6">
        <Breadcrumbs aria-label="breadcrumb">
          <NavLink
            color="inherit"
            to={`/users`}
            className="text-blue-500 flex items-center"
          >
            <ArrowBackIcon className="mr-2" />
            Users
          </NavLink>
          <div>{user?.fullName || "..."}</div>
        </Breadcrumbs>
      </div>

      <Grid container spacing={2} className="p-4">
        <Grid item xs={6} md={6}>
          <UserInfo user={user} />
        </Grid>

        <Grid item xs={3} md={3}>
          Leave
        </Grid>
        <Grid item xs={3} sm={6} md={3}>
          <UserDeviceList userId={user?.id || 0} />
        </Grid>
      </Grid>
    </div>
  );
}

export default UserDetailPage;
