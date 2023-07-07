import {
  Alert,
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
import { toast } from "react-toastify";
import { User } from "../../../../../lib/models/user.model";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../store/store.hook";
import {
  clearError,
  updateUserDetailThunk,
} from "../../../../../store/user.slice";

function UserInfo({ user }: { user: User | undefined }) {
  const appDispatch = useAppDispatch();
  const { loading, loadingState, error } = useAppSelector(
    state => state.userSlice
  );

  const handleFormSubmit = async (user: User) => {
    const res = await appDispatch(updateUserDetailThunk(user)).unwrap();
    if (res.success) {
      toast.success("User update successfully!");
    }
  };

  const handleClearError = () => {
    appDispatch(clearError());
  };

  return (
    <>
      <FormContainer values={user} onSuccess={handleFormSubmit}>
        <Card>
          <CardHeader title={<h4>User Info</h4>} />
          <CardContent>
            {error && (
              <Grid sx={{ marginBottom: "1rem" }}>
                <Alert severity="error" onClose={handleClearError}>
                  {error}
                </Alert>
              </Grid>
            )}
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
            <Button variant="outlined" color="primary" type="submit">
              Save Changes
            </Button>
          </CardActions>
        </Card>
      </FormContainer>
    </>
  );
}

export default UserInfo;
