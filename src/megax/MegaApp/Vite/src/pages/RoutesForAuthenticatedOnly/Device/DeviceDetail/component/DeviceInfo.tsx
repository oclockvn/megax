import {
  Alert,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
} from "@mui/material";
import Button from "@mui/material/Button";
import { useState } from "react";
import { useEffect } from "react";
import {
  FormContainer,
  SelectElement,
  TextFieldElement,
  useForm,
} from "react-hook-form-mui";
import { toast } from "react-toastify";
import { Device, DeviceType } from "../../../../../lib/models/device.model";
import { clearError } from "../../../../../store/device.slice";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../store/store.hook";

function DeviceInfo({
  device,
  deviceTypes,
}: {
  device: Device | undefined;
  deviceTypes: DeviceType[] | undefined;
}) {
  const appDispatch = useAppDispatch();
  const { error } = useAppSelector(state => state.deviceSlice);

  const deviceTypeOptions =
    deviceTypes?.map(type => ({
      id: type.id,
      label: type.name,
    })) || [];

  const formContext = useForm<Device>({
    values: device,
  });

  // const deviceTypeOptions = [
  //   {
  //     id: "1",
  //     label: "Label 1",
  //   },
  //   {
  //     id: "2",
  //     label: "label 2",
  //   },
  // ];

  // const handleFornmSubmit = async (deivce: Device) => {
  //   const res = await appDispatch(updateUserDetailThunk(deivce)).unwrap();
  //   if (res.success) {
  //     toast.success("User update successfully!");
  //   }
  // };

  const handleClearError = () => {
    appDispatch(clearError());
  };

  return (
    <>
      <FormContainer
        formContext={formContext}
        // onSuccess={handleFornmSubmit}
      >
        <Card>
          <CardHeader title={<h4>Device Info</h4>} />
          <CardContent>
            {error && (
              <Grid sx={{ marginBottom: "1rem" }}>
                <Alert severity="error" onClose={handleClearError}>
                  {error}
                </Alert>
              </Grid>
            )}
            <Grid container spacing={2}>
              <Grid item xs={8} sx={{ marginBottom: "1rem" }}>
                <TextFieldElement
                  fullWidth
                  label="Device Name"
                  name="name"
                  required
                />
              </Grid>
              <Grid item xs={4}>
                <SelectElement
                  fullWidth
                  label="Device Type"
                  name="deviceTypeId"
                  options={deviceTypeOptions}
                  required
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ marginBottom: "1rem" }}>
              <Grid item xs={6}>
                <TextFieldElement
                  fullWidth
                  label="Model"
                  name="model"
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextFieldElement
                  fullWidth
                  label="code"
                  name="deviceCode"
                  required
                />
              </Grid>
            </Grid>
          </CardContent>

          <CardActions className="bg-slate-100 flex justify-between">
            <Button variant="outlined" color="primary" type="submit">
              Save Changes
            </Button>
            <Button variant="outlined" color="error">
              Delete
            </Button>
          </CardActions>
        </Card>
      </FormContainer>
    </>
  );
}

export default DeviceInfo;
