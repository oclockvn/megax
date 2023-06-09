import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { userLoginThunk } from "../../store/signin.slice";
import { useAppDispatch, useAppSelector } from "../../store/store.hook";
import storage from "../../lib/storage";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

type LoginFormType = {
  username: string;
  password: string;
};

export default function LoginPage() {
  const appDispatch = useAppDispatch();
  const { isAuthenticated, errorMessage, authToken } = useAppSelector(
    state => state.signinSlice
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormType>();

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      storage.set("token", authToken);
      toast.success("Login success!");
      navigate("/");
    }
  }, [isAuthenticated]);

  const handleFormSubmit = (values: LoginFormType) => {
    const { username, password } = values;
    appDispatch(userLoginThunk({ username, password }));
  };

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <div className="w-full pb-8">
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="bg-white shadow-md rounded px-8 pt-6 pb-[80px] mb-4 flex flex-col justify-center items-center"
        >
          <Typography>Login</Typography>

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
            <Button variant="contained" type="submit">
              Login In
            </Button>

            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          </div>
        </form>
      </div>
    </Stack>
  );
}
