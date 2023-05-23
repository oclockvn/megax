import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import { useFormik } from "formik";
import { useState } from "react";

function LoginPage() {
  const defaultValue = {
    userName: "thanhtung",
    passworld: "10091989",
  };
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailed, setIsFailed] = useState(false);

  const form = useFormik({
    initialValues: {
      username: "",
      password: "",
    },

    onSubmit: values => {
      console.log(values);
      values.username === defaultValue.userName &&
      values.password === defaultValue.passworld
        ? setIsSuccess(true)
        : setIsFailed(true);
    },
  });

  return (
    <div className="w-full">
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        onSubmit={form.handleSubmit}
      >
        <div className=" mb-4">
          <TextField
            name="username"
            value={form.values.username}
            onChange={form.handleChange}
            size="medium"
            style={{ width: 400 }}
            id="name"
            type="text"
            label="Username"
          />
        </div>
        <div className="mb-6">
          <TextField
            size="medium"
            style={{ width: 400 }}
            name="password"
            value={form.values.password}
            onChange={form.handleChange}
            id="outlined-password-input"
            label="Password"
            type="password"
            autoComplete="current-password"
          />
          <p className="text-red-500 text-xs italic mt-3 text-left">
            Please choose a password.
          </p>
        </div>
        <div className="flex flex-col items-start justify-between">
          <Button variant="contained" type="submit">
            Login In
          </Button>
          {isSuccess && (
            <div className="absolute top-5 left-[50%] translate-x-[-50%]">
              <Alert
                className="w-full my-2"
                variant="filled"
                severity="success"
              >
                Login success!
              </Alert>
            </div>
          )}
          {isFailed && (
            <Alert className="w-full my-2" variant="filled" severity="error">
              Invalid username or password
            </Alert>
          )}
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
