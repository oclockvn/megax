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
  TextFieldElement,
} from "react-hook-form-mui";
import { useAppDispatch, useAppSelector } from "@/lib/store/state.hook";
import {
  clearError,
  reset as resetUser,
  updateUserDetailThunk,
} from "@/lib/store/userDetail.state";
import toast from "react-hot-toast";
import { Alert } from "@mui/material";
import { useEffect } from "react";

export default function UserInfo({ user }: { user: User | undefined }) {
  const appDispatch = useAppDispatch();
  const { loading, loadingState, error } = useAppSelector(s => s.user);

  const handleFormSubmit = async (u: User) => {
    const result = await appDispatch(updateUserDetailThunk(u)).unwrap();
    result.success && toast.success("User updated successfully");
  };

  const handleClearError = () => {
    appDispatch(clearError());
  };

  useEffect(() => {
    return () => {
      appDispatch(resetUser());
    };
  }, [appDispatch]);

  return (
    <>
      <FormContainer values={user} onSuccess={handleFormSubmit}>
        <Card>
          <CardHeader title={<h4>User detail</h4>} />
          <CardContent>
            {error && (
              <div className="mb-5">
                <Alert severity="error" onClose={handleClearError}>
                  {error}
                </Alert>
              </div>
            )}

            <div className="mb-4">
              <TextFieldElement
                fullWidth
                label="Full name"
                name="fullName"
                variant="outlined"
              />
            </div>

            <Grid container spacing={2} sx={{ marginBottom: "1rem" }}>
              <Grid item xs={6}>
                <TextFieldElement
                  fullWidth
                  label="Email"
                  variant="outlined"
                  name="email"
                  disabled
                />
              </Grid>
              <Grid item xs={6}>
                <TextFieldElement
                  fullWidth
                  label="Phone"
                  variant="outlined"
                  name="phone"
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ marginBottom: "1rem" }}>
              <Grid item xs={6}>
                <TextFieldElement
                  fullWidth
                  label="Identity number"
                  variant="outlined"
                  name="identityNumber"
                />
              </Grid>
              <Grid item xs={6}>
                <DatePickerElement name="dob" label="Dob" />
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
