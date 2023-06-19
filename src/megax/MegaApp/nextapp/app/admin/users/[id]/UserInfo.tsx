import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import { User } from "@/lib/models/user.model";
import { useForm } from "react-hook-form";

export default function UserInfo({ user }: { user: User | undefined }) {
  const { register, handleSubmit } = useForm<User>({
    defaultValues: user,
    values: user,
  });
  const handleFormSubmit = (v: User) => {
    console.log(v);
  };

  console.log(user);

  return (
    <>
      <Card>
        <CardHeader sx={{ paddingBottom: 0 }} title={<h4>User detail</h4>} />
        <CardContent>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="mb-4">
              <TextField
                fullWidth
                label="Full name"
                variant="outlined"
                {...register("fullName")}
              />
            </div>

            <Grid container spacing={2} sx={{ marginBottom: "1rem" }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  {...register("email")}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  variant="outlined"
                  {...register("phone")}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ marginBottom: "1rem" }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Identity number"
                  variant="outlined"
                  {...register("identityNumber")}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Dob"
                  variant="outlined"
                  {...register("dob")}
                />
              </Grid>
            </Grid>

            <div className="mb-4">
              <TextField
                fullWidth
                label="Address"
                variant="outlined"
                {...register("address")}
              />
            </div>
          </form>
        </CardContent>

        <CardActions className="bg-slate-100">
          <Button color="primary" variant="text">
            Save Changes
          </Button>
        </CardActions>
      </Card>
    </>
  );
}
