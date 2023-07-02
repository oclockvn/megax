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
  useForm,
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
  setLoadingState,
} from "@/lib/store/devices.state";

declare type DeviceInfoProps = {
  device?: Device;
  redirectFn?: (id: number) => void;
};

export default function DeviceInfo({ device, redirectFn }: DeviceInfoProps) {
  const appDispatch = useAppDispatch();
  const { loading, loadingState, error, deviceTypes } = useAppSelector(
    s => s.devices
  );
  const isUpdate = device && device.id > 0;
  console.log({ device, isUpdate });

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

  const formContext = useForm<Device>({
    values: device,
  });

  const onButtonSubmit = async (req: Device, redirect: boolean = false) => {
    let id = 0;
    if (isUpdate) {
      const result = await appDispatch(updateDeviceDetailThunk(req)).unwrap();
      if (result.success) {
        toast.success("Device updated successfully");
        id = device.id;
      }
    } else {
      const result = await appDispatch(addDeviceThunk(req)).unwrap();
      if (result.success) {
        toast.success("Device added successfully");
        id = result.data.id;

        if (!redirect) {
          formContext.reset();
          appDispatch(resetDevice());
        }
      }
    }

    if (redirect && !!redirectFn) {
      appDispatch(setLoadingState("Redirecting..."));
      redirectFn(id);
    }
  };

  const { handleSubmit } = formContext;

  return (
    <>
      <FormContainer formContext={formContext}>
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
            {isUpdate && (
              <Button
                color="primary"
                variant="text"
                type="button"
                onClick={handleSubmit(e => onButtonSubmit(e))}
                disabled={loading}
              >
                Save Changes
              </Button>
            )}
            {!isUpdate && (
              <>
                <Button
                  color="primary"
                  variant="text"
                  type="button"
                  disabled={loading}
                  onClick={handleSubmit(e => onButtonSubmit(e))}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  type="button"
                  className="bg-blue-500 text-white hover:!bg-blue-600"
                  onClick={handleSubmit(e => onButtonSubmit(e, true))}
                  disabled={loading}
                >
                  Save and Redirect
                </Button>
              </>
            )}

            {loading && <div className="ml-4">{loadingState}</div>}
          </CardActions>
        </Card>
      </FormContainer>
    </>
  );
}
