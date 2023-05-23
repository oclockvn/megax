import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import { useState } from "react";

function LoginPage() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailed, setIsFailed] = useState(false);

  const defaultValue = {
    userName: "khangnguyen2019@gmail.com",
    passworld: "10091989",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit(values => {
          console.log(values);
          values.username === defaultValue.userName &&
          values.password === defaultValue.passworld
            ? setIsSuccess(true)
            : setIsFailed(true);
        })}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className=" mb-4">
          <TextField
            {...register("username", {
              required: "Thi is required.",
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
              required: "Thi is required.",
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
