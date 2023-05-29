import * as React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import { useForm } from "react-hook-form";
import { useState } from "react";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CustomizedSnackbars() {
  const [open, setOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailed, setIsFailed] = useState(false);

  const defaultValue = {
    userName: "khangnguyen2019@gmail.com",
    passworld: "10091989",
  };

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <div className="w-full pb-8">
        <form
          onSubmit={handleSubmit(values => {
            values.username === defaultValue.userName &&
            values.password === defaultValue.passworld
              ? (setIsSuccess(true), setIsFailed(false))
              : (setIsFailed(true), setIsSuccess(false));
          })}
          className="bg-white shadow-md rounded px-8 pt-6 pb-[80px] mb-4"
        >
          <div className=" mb-4">
            <TextField
              {...register("username", {
                required: "Username is required.",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Username must be a valid email",
                },
              })}
              size="medium"
              style={{ width: 400 }}
              id="name"
              type="text"
              label="Username"
            />
            <p className="text-red-500 text-xs italic mt-3 text-left">
              {errors.username?.message}
            </p>
          </div>
          <div className="mb-6">
            <TextField
              {...register("password", {
                required: "Password is required.",
                minLength: {
                  value: 6,
                  message: "Password must greater than 6 characters",
                },
              })}
              size="medium"
              style={{ width: 400 }}
              id="password"
              label="Password"
              type="password"
            />
            <p className="text-red-500 text-xs italic mt-3 text-left">
              {errors.password?.message}
            </p>
          </div>
          <div className="flex flex-col items-start justify-between">
            <Button variant="contained" type="submit" onClick={handleClick}>
              Login In
            </Button>
            {isSuccess && (
              <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                className="absolute -top-[80%] translate-x-[300%]"
              >
                <Alert
                  onClose={handleClose}
                  severity="success"
                  sx={{ width: "100%" }}
                >
                  Login success!
                </Alert>
              </Snackbar>
            )}
            {isFailed && (
              <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                className="absolute -top-[240px] translate-x-[170%]"
              >
                <Alert
                  onClose={handleClose}
                  severity="error"
                  sx={{ width: "100%" }}
                >
                  Invalid username or password.
                </Alert>
              </Snackbar>
            )}
          </div>
        </form>
      </div>
    </Stack>
  );
}
