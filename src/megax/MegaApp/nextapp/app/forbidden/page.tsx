import Link from "next/link";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";

export default function Forbidden() {
  return (
    <div className="h-[100vh] flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <div>You don't have permission to perform the action!</div>
        <Link href="/" className="underline">
          <ArrowRightIcon />
          Dashboard
          <ArrowLeftIcon />
        </Link>
      </div>
    </div>
  );
}
