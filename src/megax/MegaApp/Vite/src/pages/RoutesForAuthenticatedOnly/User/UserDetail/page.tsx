import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import UserInfo from "./component/UserInfo";

function UserDetailPage() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <UserInfo />
        </Grid>
        <Grid item xs={4}>
          Sidebar
        </Grid>
      </Grid>
    </Box>
  );
}

export default UserDetailPage;
