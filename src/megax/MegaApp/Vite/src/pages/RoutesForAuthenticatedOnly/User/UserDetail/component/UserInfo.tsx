import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
} from "@mui/material";
import Button from "@mui/material/Button";
import {
  DatePickerElement,
  FormContainer,
  TextFieldElement,
} from "react-hook-form-mui";

import { User } from "../../../../../lib/models/user.model";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../store/store.hook";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

function UserInfo({ user }: { user: User | undefined }) {
  console.log("user: ", user);

  const appDispatch = useAppDispatch();
  const { loading, loadingState, error } = useAppSelector(
    state => state.userSlice
  );

  return (
    <>
      <FormContainer values={user}>
        <Card>
          <CardHeader title={<h4>User Info</h4>} />
          <CardContent>
            <Grid sx={{ marginBottom: "1rem" }}>
              <TextFieldElement
                fullWidth
                label="Full Name"
                name="fullName"
                required
              />
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6} sx={{ marginBottom: "1rem" }}>
                <TextFieldElement
                  fullWidth
                  label="Email"
                  name="email"
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextFieldElement
                  fullWidth
                  label="Phone"
                  name="phone"
                  required
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ marginBottom: "1rem" }}>
              <Grid item xs={6}>
                <TextFieldElement
                  fullWidth
                  label="Identity Number"
                  name="identityNumber"
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <DatePickerElement label="D.O.B" name="dob" />
              </Grid>
            </Grid>
            <Grid sx={{ marginBottom: "1rem" }}>
              <TextFieldElement
                fullWidth
                label="Address"
                name="address"
                required
              />
            </Grid>
          </CardContent>

          <CardActions className="bg-slate-100">
            <Button variant="outlined" color="primary">
              Save Changes
            </Button>
          </CardActions>
        </Card>
      </FormContainer>
    </>
  );
}

export default UserInfo;
