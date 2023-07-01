"use client";

import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import {
  FormContainer,
  SelectElement,
  TextFieldElement,
} from "react-hook-form-mui";
import { useAppDispatch, useAppSelector } from "@/lib/store/state.hook";
import toast from "react-hot-toast";
import { Alert } from "@mui/material";
import { useEffect } from "react";
import { Device } from "@/lib/models/device.model";
import {
  updateDeviceDetailThunk,
  reset as resetDevice,
  clearError,
  addDeviceThunk,
} from "@/lib/store/devices.state";

export default function DeviceInfo({ device }: { device: Device | undefined }) {
  const appDispatch = useAppDispatch();
  const { loading, loadingState, error, deviceTypes } = useAppSelector(
    s => s.devices
  );

  const handleFormSubmit = async (req: Device) => {
    if (device && device.id) {
      const result = await appDispatch(updateDeviceDetailThunk(req)).unwrap();
      result.success && toast.success("Device updated successfully");
    } else {
      const result = await appDispatch(addDeviceThunk(req)).unwrap();
      result.success && toast.success("Device added successfully");
    }
  };

  const handleClearError = () => {
    appDispatch(clearError());
  };

  useEffect(() => {
    return () => {
      appDispatch(resetDevice());
    };
  }, [appDispatch]);

  const deviceTypeOptions = deviceTypes?.map(d => ({
    id: d.id,
    label: d.name,
  })) || [device?.deviceTypeId];

  return (
    <>
      <FormContainer values={device} onSuccess={handleFormSubmit}>
        <Card>
          <CardHeader title={<h4>Device detail</h4>} />
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
                <Grid item xs={8}>
                  <TextFieldElement
                    fullWidth
                    required
                    label="Device name"
                    name="name"
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={4}>
                  <SelectElement
                    required
                    fullWidth
                    label="Device type"
                    variant="outlined"
                    name="deviceTypeId"
                    options={deviceTypeOptions}
                  />
                </Grid>
              </Grid>
            </div>

            <Grid container spacing={2} sx={{ marginBottom: "1rem" }}>
              <Grid item xs={6}>
                <TextFieldElement
                  fullWidth
                  label="Model"
                  variant="outlined"
                  name="model"
                />
              </Grid>
              <Grid item xs={6}>
                <TextFieldElement
                  fullWidth
                  label="Code"
                  variant="outlined"
                  name="deviceCode"
                />
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
