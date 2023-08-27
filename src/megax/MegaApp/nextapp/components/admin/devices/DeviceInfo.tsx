"use client";

import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import {
  AutocompleteElement,
  DatePickerElement,
  FormContainer,
  SelectElement,
  TextFieldElement,
  useForm,
} from "react-hook-form-mui";
import { useAppDispatch, useAppSelector } from "@/lib/store/state.hook";
import toast from "react-hot-toast";
import Alert from "@mui/material/Alert";
import ClearIcon from "@mui/icons-material/Clear";
import { Device } from "@/lib/models/device.model";
import {
  updateDeviceDetailThunk,
  reset as resetDevice,
  clearError,
  addDeviceThunk,
  setLoadingState,
  deleteDeviceThunk,
} from "@/lib/store/devices.state";
import { useConfirm } from "material-ui-confirm";

declare type DeviceInfoProps = {
  device?: Device;
  onAdded?: (id: number) => void;
  onDeleted?: () => void;
};

export default function DeviceInfo({
  device,
  onAdded,
  onDeleted,
}: DeviceInfoProps) {
  const appDispatch = useAppDispatch();
  const confirm = useConfirm();
  const { loading, loadingState, error, deviceTypes } = useAppSelector(
    s => s.devices
  );
  const { pagedSuppliers } = useAppSelector(s => s.suppliers);
  const isUpdate = Number(device?.id) > 0;

  const handleClearError = () => {
    appDispatch(clearError());
  };

  const deviceTypeOptions =
    deviceTypes?.map(d => ({
      id: d.id,
      label: d.name,
    })) || [];

  const supplierOptions =
    pagedSuppliers?.items?.map(x => ({
      key: x.id,
      id: x.id,
      label: x.name + (x.website ? " - " + x.website : ""),
    })) || [];

  const formContext = useForm<Device>({
    values: device,
  });

  const disabled = device?.disabled === true;

  const onButtonSubmit = async (req: Device, redirect: boolean = false) => {
    let id = 0;
    if (isUpdate) {
      const result = await appDispatch(updateDeviceDetailThunk(req)).unwrap();
      if (result.success) {
        toast.success("Device updated successfully");
        id = result.data.id;
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

    if (redirect && !!onAdded) {
      appDispatch(setLoadingState("Redirecting..."));
      onAdded(id);
    }
  };

  const handleDeleteDevice = async () => {
    const id = Number(device?.id);
    const result = await appDispatch(deleteDeviceThunk(id)).unwrap();

    if (result.success) {
      toast.success("Successfully disabled");
      onDeleted && onDeleted();
    }
  };

  const confirmDelete = () => {
    confirm({
      description: "Disable this device?",
      dialogProps: { maxWidth: "xs" },
    })
      .then(handleDeleteDevice)
      .catch(() => {
        /* swallow error */
      });
  };

  const { handleSubmit } = formContext;

  const autocompleteProps = {
    renderOption: (props: any, option: { id: number; label: string }) => (
      <li {...props} key={option.id}>
        {option.label}
      </li>
    ),
  };

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
              <Grid item xs>
                <TextFieldElement
                  fullWidth
                  label="Price"
                  variant="outlined"
                  name="price"
                />
              </Grid>
              <Grid item xs>
                <TextFieldElement
                  fullWidth
                  label="Model"
                  variant="outlined"
                  name="model"
                />
              </Grid>
              <Grid item xs>
                <TextFieldElement
                  fullWidth
                  label="Serial Number"
                  variant="outlined"
                  name="serialNumber"
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item>
                <DatePickerElement
                  label="Purchased At"
                  name="purchasedAt"
                  required
                  slotProps={{
                    actionBar: {
                      actions: ["today", "cancel", "accept"],
                    },
                  }}
                />
              </Grid>
              <Grid item>
                <DatePickerElement
                  label="Warranty To"
                  name="warrantyToDate"
                  slotProps={{
                    actionBar: {
                      actions: ["today", "cancel", "accept"],
                    },
                  }}
                />
              </Grid>
            </Grid>

            <div className="mt-4">
              <AutocompleteElement
                label="Supplier"
                name="supplierId"
                matchId
                options={supplierOptions}
                autocompleteProps={autocompleteProps}
              />
            </div>
          </CardContent>

          <CardActions className="bg-slate-100">
            {isUpdate && (
              <Grid
                container
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Grid item>
                  <Button
                    color="primary"
                    variant="text"
                    type="button"
                    onClick={handleSubmit(e => onButtonSubmit(e))}
                    disabled={loading}
                  >
                    Save Changes
                  </Button>
                </Grid>
                <Grid item flex={1}>
                  {loading && <div className="ml-4">{loadingState}</div>}
                </Grid>
                <Grid item>
                  {disabled ? (
                    <Button
                      color="success"
                      variant="outlined"
                      type="button"
                      className="bg-green-500 text-white hover:!bg-green-600"
                      onClick={confirmDelete}
                      disabled={loading}
                    >
                      Enable
                    </Button>
                  ) : (
                    <Button
                      color="error"
                      variant="outlined"
                      type="button"
                      className="bg-red-500 text-white hover:!bg-red-600"
                      startIcon={<ClearIcon />}
                      onClick={confirmDelete}
                      disabled={loading}
                    >
                      Disable
                    </Button>
                  )}
                </Grid>
              </Grid>
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

                {loading && <div className="ml-4">{loadingState}</div>}
              </>
            )}
          </CardActions>
        </Card>
      </FormContainer>
    </>
  );
}
