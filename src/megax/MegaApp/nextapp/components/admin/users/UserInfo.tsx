"use client";

import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import { User } from "@/lib/models/user.model";
import {
  DatePickerElement,
  FormContainer,
  SelectElement,
  TextFieldElement,
} from "react-hook-form-mui";
import { useAppDispatch, useAppSelector } from "@/lib/store/state.hook";
import { clearError, updateUserDetailThunk } from "@/lib/store/users.state";
import toast from "react-hot-toast";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";

export default function UserInfo({ user }: { user: User | undefined }) {
  const appDispatch = useAppDispatch();
  const { loading, loadingState, error } = useAppSelector(s => s.users);

  const handleFormSubmit = async (u: User) => {
    const result = await appDispatch(updateUserDetailThunk(u)).unwrap();
    result.success && toast.success("User updated successfully");
  };

  const handleClearError = () => {
    appDispatch(clearError());
  };

  const contractTypes = [
    {
      id: 1,
      label: "Office",
    },
    {
      id: 2,
      label: "Remote",
    },
    {
      id: 3,
      label: "Hybrid",
    },
  ];

  const genders = [
    {
      id: 1,
      label: "Male",
    },
    {
      id: 2,
      label: "Female",
    },
    {
      id: 3,
      label: "Secret",
    },
  ];

  return (
    <>
      <FormContainer values={user} onSuccess={handleFormSubmit}>
        <Card>
          <CardHeader title={<h4>User details</h4>} />
          <CardContent>
            {error && (
              <div className="mb-5">
                <Alert severity="error" onClose={handleClearError}>
                  {error}
                </Alert>
              </div>
            )}

            <div className="mb-4">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={9}>
                  <TextFieldElement
                    fullWidth
                    required
                    label="Full name"
                    name="fullName"
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <SelectElement
                    fullWidth
                    label="Gender"
                    name="gender"
                    variant="outlined"
                    options={genders}
                  />
                </Grid>
              </Grid>
            </div>

            <Grid container spacing={2} sx={{ marginBottom: "1rem" }}>
              <Grid item xs={12} md={6}>
                <TextFieldElement
                  fullWidth
                  label="Email"
                  variant="outlined"
                  name="email"
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextFieldElement
                  fullWidth
                  label="Phone"
                  variant="outlined"
                  name="phone"
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ marginBottom: "1rem" }}>
              <Grid item xs={12} md={4}>
                <TextFieldElement
                  fullWidth
                  label="Identity number"
                  variant="outlined"
                  name="identityNumber"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <DatePickerElement name="dob" label="Birthdate" />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextFieldElement
                  fullWidth
                  label="Nationality"
                  name="nationality"
                />
              </Grid>
            </Grid>

            <div className="mb-4">
              <TextFieldElement
                fullWidth
                label="Address"
                variant="outlined"
                name="address"
              />
            </div>

            <div className="mb-4">
              <TextFieldElement
                fullWidth
                label="Permanent Residence"
                variant="outlined"
                name="permanentResidence"
              />
            </div>

            <h4 className="mb-4 mt-6 text-2xl">Contract details</h4>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <DatePickerElement label="Start date" name="contractStart" />
              </Grid>
              <Grid item xs={12} md={4}>
                <DatePickerElement label="End date" name="contractEnd" />
              </Grid>
              <Grid item xs={12} md={4}>
                <SelectElement
                  fullWidth
                  label="Contract type"
                  name="contractType"
                  options={contractTypes}
                />
              </Grid>
            </Grid>

            <h4 className="mb-4 mt-6 text-2xl">Personal</h4>
            <Grid container spacing={2} className="mb-4">
              <Grid item xs={12} md={6}>
                <TextFieldElement
                  fullWidth
                  label="Personal email"
                  name="personalEmail"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextFieldElement fullWidth label="Nickname" name="nickname" />
              </Grid>
            </Grid>

            <Grid container spacing={2} className="mb-4">
              <Grid item xs={12} md={6}>
                <TextFieldElement
                  fullWidth
                  label="Nation"
                  variant="outlined"
                  name="nation"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextFieldElement fullWidth name="Religion" label="Religion" />
              </Grid>
            </Grid>
          </CardContent>

          <CardActions className="bg-slate-100">
            <Button
              color="primary"
              variant="text"
              type="submit"
              disabled={loading}
            >
              Save Changes
            </Button>

            {loading && <div>{loadingState}</div>}
          </CardActions>
        </Card>
      </FormContainer>
    </>
  );
}
