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
  SwitchElement,
  useForm,
  AutocompleteElement,
} from "react-hook-form-mui";
import { useAppDispatch, useAppSelector } from "@/lib/store/state.hook";
import { clearError, updateUserDetailThunk } from "@/lib/store/users.state";
import Alert from "@mui/material/Alert";

import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import datetime from "@/lib/datetime";
import nationalities from "@/lib/constants/nationalities";

export default function UserInfo({ user }: { user: User | undefined }) {
  const appDispatch = useAppDispatch();
  const { loading, loadingState, error } = useAppSelector(s => s.users);
  const {
    pagedBanks: { items },
  } = useAppSelector(s => s.banks);
  const banks = items.map(i => ({
    id: i.id,
    label: i.code ? `${i.code} - ${i.name}` : i.name,
  }));

  const handleFormSubmit = async (u: User) => {
    const result = await appDispatch(updateUserDetailThunk(u)).unwrap();
    result.success
      ? toast.success("User updated successfully")
      : toast.error("Something went wrong. Check details and retry.");

    if (result.success) {
      handleClearError();
    }
  };

  const handleClearError = () => {
    appDispatch(clearError());
  };

  const contractTypes = ["Official", "Contractor", "Fresher"].map(x => ({
    id: x.toLowerCase(),
    label: x,
  }));

  const genders = ["Male", "Female", "Secret"].map(x => ({
    id: x.toLowerCase(),
    label: x,
  }));

  const workingTypes = ["Remote", "Office", "Hybrid"].map(x => ({
    id: x.toLowerCase(),
    label: x,
  }));

  const roles = [
    "Developer",
    "QA",
    "Leader",
    "Tech Lead",
    "Designer",
    "Admin",
    "HR",
    "BOD",
  ].map(x => ({
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
              <TextFieldElement
                fullWidth
                required
                label="Employee ID"
                name="code"
                variant="outlined"
              />
            </div>

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
              <Grid item xs={12} md={6}>
                <TextFieldElement
                  fullWidth
                  required
                  label="Identity number"
                  variant="outlined"
                  name="identityNumber"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <AutocompleteElement
                  name="nationality"
                  label="Nationality"
                  options={nationalities}
                  autocompleteProps={{
                    renderOption(attrs, o) {
                      return (
                        <li {...attrs} key={o}>
                          {o}
                        </li>
                      );
                    },
                  }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ marginBottom: "1rem" }}>
              <Grid item xs={12} md={4}>
                <DatePickerElement
                  format="dd/MM/yyyy"
                  className="w-full"
                  name="dob"
                  required
                  label="Birthdate"
                />
              </Grid>
              <Grid item xs={12} md={8}>
                <TextFieldElement
                  fullWidth
                  name="birthPlace"
                  label="Birth place"
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ marginBottom: "1rem" }}>
              <Grid item xs={12} md={6}>
                <TextFieldElement
                  fullWidth
                  name="taxNumber"
                  label="Tax number"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextFieldElement
                  fullWidth
                  name="insuranceNumber"
                  label="Insurance number"
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
            <Grid container spacing={2} className="mb-4">
              <Grid item xs={12} md={4}>
                <DatePickerElement
                  required
                  format="dd/MM/yyyy"
                  label="Start date"
                  name="contractStart"
                  className="w-full"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <DatePickerElement
                  required
                  label="End date"
                  format="dd/MM/yyyy"
                  name="contractEnd"
                  className="w-full"
                  maxDate={new Date(9999, 11, 31)}
                  slotProps={{
                    shortcuts: {
                      items: [
                        {
                          label: "1 Year",
                          getValue: () => {
                            return datetime.addYears(
                              form.getValues("contractStart"),
                              1
                            );
                          },
                        },
                        {
                          label: "2 Years",
                          getValue: () => {
                            return datetime.addYears(
                              form.getValues("contractStart"),
                              2
                            );
                          },
                        },
                        {
                          label: "Permanent Contract",
                          getValue: () => {
                            return new Date(9999, 11, 31);
                          },
                        },
                      ],
                    },
                  }}
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

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <SelectElement
                  fullWidth
                  label="Working type"
                  name="workingType"
                  options={workingTypes}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <SelectElement
                  fullWidth
                  name="role"
                  label="Role"
                  options={roles}
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

            <div className="mb-4">
              <TextFieldElement fullWidth name="hometown" label="Hometown" />
            </div>

            <div>
              <SwitchElement label="Is married?" name="married" />
            </div>

            <h4 className="my-4 uppercase !text-[1.2rem] font-semibold">
              Bank Account
            </h4>

            <div className="mb-4">
              <AutocompleteElement
                name="bankId"
                label="Bank"
                matchId
                options={banks}
                autocompleteProps={{
                  renderOption(attrs, o) {
                    return (
                      <li {...attrs} key={o.id}>
                        {o.label}
                      </li>
                    );
                  },
                }}
              />
            </div>

            <Grid container spacing={2} className="mb-4">
              <Grid item xs={12} md={6}>
                <TextFieldElement
                  fullWidth
                  label="Account number"
                  name="bankAccountNumber"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextFieldElement
                  fullWidth
                  label="Bank branch"
                  name="bankBranch"
                />
              </Grid>
            </Grid>

            <h4 className="my-4 uppercase !text-[1.2rem] font-semibold">
              Academic
            </h4>
            <div className="mb-4">
              <TextFieldElement
                fullWidth
                name="university"
                label="University"
              />
            </div>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextFieldElement
                  fullWidth
                  name="academicLevel"
                  label="Academic level"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextFieldElement fullWidth name="major" label="Major" />
              </Grid>
            </Grid>

            {error && (
              <Alert severity="error" onClose={handleClearError}>
                {error}
              </Alert>
            )}
          </CardContent>

          <CardActions className="bg-slate-100">
            <Button
              color="primary"
              variant="outlined"
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
