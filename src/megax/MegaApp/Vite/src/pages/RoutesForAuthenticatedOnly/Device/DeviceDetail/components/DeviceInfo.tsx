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
  FormContainer,
  SelectElement,
  TextFieldElement,
  useForm,
} from "react-hook-form-mui";
import { toast } from "react-toastify";
import { Device, DeviceType } from "../../../../../lib/models/device.model";
import {
  clearError,
  updateDeviceDetailThunk,
  reset as resetDevice,
  deleteDeviceThunk,
  addDeviceThunk,
  setLoadingState,
} from "../../../../../store/device.slice";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../store/store.hook";
import { useConfirm } from "material-ui-confirm";
import ClearIcon from "@mui/icons-material/Clear";

declare type DeviceInfoProps = {
  device?: Device;
  onAdded?: (id: number) => void;
  onDeleted?: () => void;
  deviceTypes?: DeviceType[];
};

function DeviceInfo({
  device,
  onAdded,
  onDeleted,
  deviceTypes,
}: DeviceInfoProps) {
  const appDispatch = useAppDispatch();
  const confirm = useConfirm();
  const { error, loading, loadingState } = useAppSelector(
    state => state.deviceSlice
  );

  const deviceTypeOptions =
    deviceTypes?.map(type => ({
      id: type.id,
      label: type.name,
    })) || [];

  const formContext = useForm<Device>({
    values: device,
  });

  const isUpdate = Number(device?.id) > 0;

  const handleClearError = () => {
    appDispatch(clearError());
  };

  const onButtonSubmit = async (device: Device, redirect = false) => {
    let id = 0;
    if (isUpdate) {
      const res = await appDispatch(updateDeviceDetailThunk(device)).unwrap();
      if (res.success) {
        toast.success("Device updated successfully!");
        id = res.data.id;
      }
    } else {
      const res = await await appDispatch(addDeviceThunk(device)).unwrap();
      if (res.success) {
        toast.success("Device added successfully!");
        id = res.data.id;
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
    const res = await appDispatch(deleteDeviceThunk(id)).unwrap();
    if (res.success) {
      toast.success("Successfully deleted!");
      onDeleted && onDeleted();
    }
  };
  const confirmDelete = () => {
    confirm({
      description: "Delete this device?",
    })
      .then(handleDeleteDevice)
      .catch(() => {
        //
      });
  };

  const { handleSubmit } = formContext;
  return (
    <>
      <FormContainer formContext={formContext}>
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
                    onClick={handleSubmit(State => onButtonSubmit(State))}
                    disabled={loading}
                  >
                    Save Changes
                  </Button>
                </Grid>
                <Grid item flex={1}>
                  {loading && <div className="ml-4">{loadingState}</div>}
                </Grid>
                <Grid item>
                  <Button
                    color="error"
                    variant="outlined"
                    type="button"
                    className="bg-red-500 text-white hover:!bg-red-600"
                    startIcon={<ClearIcon />}
                    onClick={confirmDelete}
                    disabled={loading}
                  >
                    Delete
                  </Button>
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
                  onClick={handleSubmit(State => onButtonSubmit(State, false))}
                >
                  Just Save
                </Button>
                <Button
                  variant="outlined"
                  type="button"
                  className="bg-blue-500 text-white hover:!bg-blue-600"
                  onClick={handleSubmit(State => onButtonSubmit(State, true))}
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

export default DeviceInfo;
