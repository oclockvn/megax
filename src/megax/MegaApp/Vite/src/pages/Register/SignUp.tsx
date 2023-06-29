import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../store/store.hook";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { resetRegistration, userSignupThunk } from "../../store/signup.slice";
import { useEffect, useState } from "react";

type SignUpFormType = {
  username: string;
  password: string;
  name: string;
};

function SignUpPage() {
  const appDispatch = useAppDispatch();
  const { errorMessage, successMessage } = useAppSelector(
    state => state.signupSlice
  );
   console.log("successMessage: ", successMessage);
   console.log("errorMessage: ", errorMessage);
  // const [submitted, setSubmit] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormType>();

  const navigate = useNavigate();

  //  const handleFormSubmit = (values: SignUpFormType) => {
  //    const { username, password, name } = values;
  //    appDispatch(userSignupThunk({ username, password, name })).then(() => {
  //      setSubmit(true);
  //    });
  //  };

  const handleFormSubmit = async (values: SignUpFormType) => {
    const { username, password, name } = values;
    const res = await appDispatch(
      userSignupThunk({ username, password, name })
    ).unwrap();
    if (res && res.isSuccess) {
      toast.success(successMessage);
      navigate("/login");
    } else {
      toast.error(errorMessage);
    }
  };

  //  useEffect(() => {
  //    appDispatch(resetRegistration());
  //    // eslint-disable-next-line react-hooks/exhaustive-deps
  //  }, []);

  //  useEffect(() => {
  //    if (isRegister) {
  //      toast.success(successMessage);
  //      navigate("/login");
  //    } else if (submitted) {
  //      toast.error(errorMessage);
  //      setSubmit(false);
  //    }

  //    // eslint-disable-next-line react-hooks/exhaustive-deps
  //  }, [isRegister, submitted]);

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <div className="w-full pb-8">
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="bg-white shadow-md rounded px-8 pt-6 pb-[80px] mb-4 flex flex-col justify-center items-center"
        >
          <Typography>Sign Up</Typography>

          <div className=" mb-4 mt-4">
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
          <div className="mb-6">
            <TextField
              {...register("name", {
                required: "Name is required.",
              })}
              size="medium"
              style={{ width: 400 }}
              id="name"
              label="Name"
              type="text"
            />
            <p className="text-red-500 text-xs italic mt-3 text-left">
              {errors.password?.message}
            </p>
          </div>
          <div className="flex flex-col items-start justify-between">
            <Button variant="contained" type="submit">
              Sign Up
            </Button>
          </div>
        </form>
      </div>
    </Stack>
  );
}

export default SignUpPage;
