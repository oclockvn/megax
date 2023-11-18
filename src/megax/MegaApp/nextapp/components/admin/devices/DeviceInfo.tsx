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
import toast from "react-hot-toast";
import Alert from "@mui/material/Alert";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import BlockIcon from "@mui/icons-material/Block";
import { Device } from "@/lib/models/device.model";
import { useConfirm } from "material-ui-confirm";
import Chip from "@mui/material/Chip";
import {
  usePopupState,
  bindTrigger,
  bindMenu,
} from "material-ui-popup-state/hooks";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import CheckIcon from "@mui/icons-material/Check";
import {
  addDevice,
  getDeviceTypes,
  toggleDevice,
  updateDevice,
} from "@/lib/apis/devices.api";
import { fetchSupplierList } from "@/lib/apis/suppliers.api";
import { useMutation, useQueries } from "@tanstack/react-query";
import { PagedResult } from "@/lib/models/common.model";
import { Supplier } from "@/lib/models/supplier.model";
import { useReducer } from "react";
import deviceInfoReducer, {
  DeviceInfoState,
} from "@/lib/states/deviceInfo.state";

declare type DeviceInfoProps = {
  device?: Device;
  onAdded?: (id: number) => void;
};

export default function DeviceInfo({ device, onAdded }: DeviceInfoProps) {
  const confirm = useConfirm();

  const [state, dispatch] = useReducer(deviceInfoReducer, {
    error: null,
    loadingState: null,
  } as DeviceInfoState);

  const [
    { data: deviceTypes, isLoading: deviceTypeLoading },
    { data: suppliers, isLoading: suppliersLoading },
  ] = useQueries({
    queries: [
      {
        queryKey: ["admin/device/types"],
        queryFn: () => getDeviceTypes(),
        staleTime: 1000 * 60 * 60 * 24, // 1 day
      },
      {
        queryKey: ["admin/suppliers"],
        queryFn: () => fetchSupplierList({}),
        staleTime: 1000 * 60 * 60 * 24, // 1 day
        select: (response: PagedResult<Supplier>) => response.items,
      },
    ],
  });

  const loading = deviceTypeLoading || suppliersLoading;
  const isUpdate = Number(device?.id) > 0;

  const handleClearError = () => {
    dispatch({
      type: "set",
      payload: { error: null },
    });
  };

  const deviceTypeOptions =
    deviceTypes?.map(d => ({
      id: d.id,
      label: d.name,
    })) || [];

  const supplierOptions =
    suppliers?.map(x => ({
      key: x.id,
      id: x.id,
      label: x.name + (x.website ? " - " + x.website : ""),
    })) || [];

  const formContext = useForm<Device>({
    values: device,
  });

  // const disabled = device?.disabled === true;
  const updateHandler = useMutation({
    mutationKey: ["admin/device/update", device?.id],
    mutationFn: (req: Device) => updateDevice(req),
    onSuccess: res =>
      res.success && toast.success(`Device updated successfully`),
  });

  const addHandler = useMutation({
    mutationKey: ["admin/device/add"],
    mutationFn: (req: Omit<Device, "id">) => addDevice(req),
    onSuccess: res => res.success && toast.success(`Device added successfully`),
  });

  const onButtonSubmit = async (req: Device, redirect: boolean = false) => {
    let id = 0;
    if (isUpdate) {
      await updateHandler.mutateAsync(req);
    } else {
      const result = await addHandler.mutateAsync(req);
      if (result.success) {
        id = result.data.id;

        if (!redirect) {
          formContext.reset();
        } else if (!!onAdded) {
          onAdded(id);
        }

        dispatch({
          type: "set",
          payload: {
            device: null,
            error: null,
            loadingState: redirect ? "Redirecting..." : null,
          },
        });
      }
    }
  };

  const toggleHandler = useMutation({
    mutationKey: ["admin/device/toggle", device?.id],
    mutationFn: (id: number) => toggleDevice(id),
  });

  const handleToggleDevice = async (disable: boolean) => {
    const result = await toggleHandler.mutateAsync(Number(device?.id));

    const status = disable ? "disable" : "enable";
    if (result.success) {
      toast.success(`Successfully ${status}d`);
    } else {
      dispatch({
        type: "set",
        payload: {
          error: `Could not ${status} device. Error code: ${result.code}`,
        },
      });
    }
  };

  const confirmAction = (disable: boolean) => {
    confirm({
      description: `${disable ? "Disable" : "Enable"} this device?`,
      dialogProps: { maxWidth: "xs" },
    })
      .then(() => handleToggleDevice(disable))
      .then(() => popupState.close());
  };

  const { handleSubmit } = formContext;

  const autocompleteProps = {
    renderOption: (props: any, option: { id: number; label: string }) => (
      <li {...props} key={option.id}>
        {option.label}
      </li>
    ),
  };

  const popupState = usePopupState({
    variant: "popover",
    popupId: "device-menu",
  });

  const isDisabled = device?.disabled === true;
  const error = state.error;

  return (
    <>
      <FormContainer formContext={formContext}>
        <Card>
          <CardHeader
            title={<h4>Device detail</h4>}
            action={
              <>
                {isDisabled && (
                  <Chip label="Device is disabled" color="warning" />
                )}

                <IconButton size="small" {...bindTrigger(popupState)}>
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  {...bindMenu(popupState)}
                  anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                  transformOrigin={{ vertical: "top", horizontal: "left" }}
                >
                  {isDisabled ? (
                    <MenuItem
                      onClick={() => confirmAction(false)}
                      className="!bg-green-500 text-white"
                    >
                      <ListItemIcon>
                        <CheckIcon className="text-white" />
                      </ListItemIcon>
                      Enable
                    </MenuItem>
                  ) : (
                    <MenuItem onClick={() => confirmAction(true)}>
                      <ListItemIcon>
                        <BlockIcon color="warning" />
                      </ListItemIcon>
                      Disable
                    </MenuItem>
                  )}
                </Menu>
              </>
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
                    variant="contained"
                    type="button"
                    onClick={handleSubmit(e => onButtonSubmit(e))}
                    disabled={loading}
                  >
                    Save Changes
                  </Button>
                </Grid>
                <Grid item flex={1}>
                  {state.loadingState && (
                    <div className="ml-4">{state.loadingState}</div>
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
                  variant="contained"
                  type="button"
                  onClick={handleSubmit(e => onButtonSubmit(e, true))}
                  disabled={loading}
                >
                  Save and Redirect
                </Button>

                {state.loadingState && (
                  <div className="ml-4">{state.loadingState}</div>
                )}
              </>
            )}
          </CardActions>
        </Card>
      </FormContainer>
    </>
  );
}
