import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  TextField,
} from "@mui/material";
import Button from "@mui/material/Button";

function UserInfo() {
  return (
    <>
      <Card>
        <CardHeader title={<h4>User Info</h4>} />
        <CardContent>
          <form>
            <Grid sx={{ marginBottom: "1rem" }}>
              <TextField fullWidth label="Full Name" />
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6} sx={{ marginBottom: "1rem" }}>
                <TextField fullWidth label="Email" />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Phone" />
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ marginBottom: "1rem" }}>
              <Grid item xs={6}>
                <TextField fullWidth label="Identity Number" />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="D.O.B" />
              </Grid>
            </Grid>
            <Grid sx={{ marginBottom: "1rem" }}>
              <TextField fullWidth label="Address" />
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
