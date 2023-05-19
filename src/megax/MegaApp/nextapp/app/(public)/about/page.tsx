"use client";

import { Typography } from "@mui/material";
import Image from "next/image";

import imgAllInOne from "../../../public/images/all-in-one.png";

export default function AboutPage() {
  return (
    <div className="max-w-[60%] mx-auto">
      <Typography variant="h4" component={"h4"} className="mt-8">
        About MegaX
      </Typography>

      <div className="flex items-center">
        <div className="flex-1">All in one app</div>

        <div>
          <Image alt="all-in-1" width={230} height={280} src={imgAllInOne} />
        </div>
      </div>
    </div>
  );
}
