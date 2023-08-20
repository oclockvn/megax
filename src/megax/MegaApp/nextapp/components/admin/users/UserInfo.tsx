"use client";

import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import { User, userSchema } from "@/lib/models/user.model";
import {
  DatePickerElement,
  FormContainer,
  SelectElement,
  TextFieldElement,
  useForm,
} from "react-hook-form-mui";
import { useAppDispatch, useAppSelector } from "@/lib/store/state.hook";
import { clearError } from "@/lib/store/users.state";
import Alert from "@mui/material/Alert";

import { yupResolver } from "@hookform/resolvers/yup";

export default function UserInfo({ user }: { user: User | undefined }) {
  const appDispatch = useAppDispatch();
  const { loading, loadingState, error } = useAppSelector(s => s.users);

  const handleFormSubmit = async (u: User) => {
    // const result = await appDispatch(updateUserDetailThunk(u)).unwrap();
    // result.success && toast.success("User updated successfully");
    console.log(u);
  };

  const handleClearError = () => {
    appDispatch(clearError());
  };

  const contractTypes = ["Office", "Remote", "Hybrid"].map(x => ({
    id: x.toLowerCase(),
    label: x,
  }));
  const genders = ["Male", "Female", "Secret"].map(x => ({
    id: x.toLowerCase(),
    label: x,
  }));

  const form = useForm<User>({
    resolver: yupResolver(userSchema),
    values: user,
  });

  return (
    <>
      <FormContainer formContext={form} onSuccess={handleFormSubmit}>
        <Card>
          <CardHeader
            title={
              <h4 className="uppercase !text-[1.2rem] font-semibold">
                User details
              </h4>
            }
          />
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
                  required
                  label="Identity number"
                  variant="outlined"
                  name="identityNumber"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <DatePickerElement
                  className="w-full"
                  name="dob"
                  required
                  label="Birthdate"
                />
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

            <h4 className="mb-4 mt-6 uppercase !text-[1.2rem] font-semibold">
              Contract details
            </h4>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <DatePickerElement
                  required
                  label="Start date"
                  name="contractStart"
                  className="w-full"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <DatePickerElement
                  label="End date"
                  name="contractEnd"
                  className="w-full"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <SelectElement
                  fullWidth
                  required
                  className="w-full"
                  label="Contract type"
                  name="contractType"
                  options={contractTypes}
                />
              </Grid>
            </Grid>

            <h4 className="mb-4 mt-6 uppercase !text-[1.2rem] font-semibold">
              Personal
            </h4>
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
                <TextFieldElement fullWidth name="religion" label="Religion" />
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
