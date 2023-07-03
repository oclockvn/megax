import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  TextField,
} from "@mui/material";
import Button from "@mui/material/Button";
import { useEffect } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../store/store.hook";
import { fetchUserDetailThunk } from "../../../../../store/userDetail.slice";

function UserInfo({ id }: any) {
  console.log("id: ", id);
  const appDispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.userDetailSlice);
  console.log("user: ", user);

  useEffect(() => {
    appDispatch(fetchUserDetailThunk(id));
  }, [id]);
  return (
    <>
      <Card>
        <CardHeader title={<h4>User Info</h4>} />
        <CardContent>
          <form>
            <Grid sx={{ marginBottom: "1rem" }}>
              <TextField
                fullWidth
                label="Full Name"
                placeholder="{user.fullName}"
                defaultValue={user.fullName}
              />
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6} sx={{ marginBottom: "1rem" }}>
                <TextField fullWidth label="Email" defaultValue={user.email} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Phone" defaultValue={user.phone} />
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ marginBottom: "1rem" }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Identity Number"
                  defaultValue={user.identityNumber}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="D.O.B" defaultValue={user.dob} />
              </Grid>
            </Grid>
            <Grid sx={{ marginBottom: "1rem" }}>
              <TextField
                fullWidth
                label="Address"
                defaultValue={user.address}
              />
            </Grid>
          </form>
        </CardContent>

        <CardActions className="bg-slate-100">
          <Button variant="outlined" color="primary">
            Save Changes
          </Button>
        </CardActions>
      </Card>
    </>
  );
}

export default UserInfo;
