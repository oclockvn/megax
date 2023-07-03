import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import UserInfo from "./component/UserInfo";
import { useParams } from "react-router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { NavLink } from "react-router-dom";

function UserDetailPage() {
  const params = useParams();
  const id = params.id;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <div role="presentation" className="bg-blue-200 py-2 px-6">
        <Breadcrumbs aria-label="breadcrumb">
          <NavLink
            color="inherit"
            to={`${"pathname"}/..`}
            className="text-blue-500 flex items-center"
          >
            <ArrowBackIcon className="mr-2" />
            Users
          </NavLink>
          {/* <div>{user?.fullName || "..."}</div> */}
        </Breadcrumbs>
      </div>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <UserInfo id={id} />
        </Grid>
        <Grid item xs={4}>
          Sidebar
        </Grid>
      </Grid>
    </Box>
  );
}

export default UserDetailPage;
