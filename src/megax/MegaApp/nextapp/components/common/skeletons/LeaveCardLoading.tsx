import { makeArr } from "@/lib/helpers/array";
import Skeleton from "@mui/material/Skeleton";

export default function LeaveCardLoading({ count = 1 }: { count?: number }) {
  return (
    <>
      {makeArr(count).map(i => (
        <div key={i} className="mt-4">
          <div className="flex gap-4 items-center mb-2">
            <Skeleton variant="circular" width={50} height={50} />
            <div>
              <Skeleton variant="text" width={200} />
              <Skeleton variant="text" width={300} />
            </div>
          </div>

          <Skeleton variant="rounded" height={200} />
        </div>
      ))}
    </>
  );
}
