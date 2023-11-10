import CircularProgress from "@mui/material/CircularProgress";

export default async function Loading() {
  return (
    <div className="flex justify-center items-center my-8">
      <CircularProgress />
    </div>
  );
}
