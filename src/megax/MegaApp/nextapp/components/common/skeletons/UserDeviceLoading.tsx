import { makeArr } from "@/lib/helpers/array";
import Divider from "@mui/material/Divider";
import Skeleton from "@mui/material/Skeleton";

export default function UserDeviceLoading({ count = 1 }: { count?: number }) {
  return (
    <>
      {makeArr(count).map(i => (
        <div key={i}>
          <div className="flex items-center gap-6 p-3">
            <div>
              <Skeleton variant="circular" width={32} height={32} />
            </div>
            <div>
              <Skeleton variant="text" width={200} />
              <Skeleton variant="text" width={120} />
            </div>
          </div>
          <Divider />
        </div>
      ))}
    </>
  );
}
