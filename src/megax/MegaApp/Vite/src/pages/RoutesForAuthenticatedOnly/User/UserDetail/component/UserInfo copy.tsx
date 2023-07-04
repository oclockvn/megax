import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  TextField,
} from "@mui/material";
import Button from "@mui/material/Button";

import { User } from "../../../../../lib/models/user.model";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../store/store.hook";

function UserInfo({ user }: { user: User | undefined }) {
  console.log("user: ", user);

  const appDispatch = useAppDispatch();
  const { loading, loadingState, error } = useAppSelector(
    state => state.userSlice
  );

  return (
    <>
      <Card>
        <CardHeader title={<h4>User Info</h4>} />
        <CardContent>
          <form>
            <Grid sx={{ marginBottom: "1rem" }}>
              <TextField fullWidth label="Full Name" value={user.fullName} />
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6} sx={{ marginBottom: "1rem" }}>
                <TextField fullWidth label="Email" value={user.email} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Phone" value={user.phone} />
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ marginBottom: "1rem" }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Identity Number"
                  value={user.identityNumber}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="D.O.B" value={user.dob} />
              </Grid>
            </Grid>
            <Grid sx={{ marginBottom: "1rem" }}>
              <TextField fullWidth label="Address" value={user.address} />
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
