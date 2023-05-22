"use client";

import { Typography } from "@mui/material";
import Image from "next/image";

import imgAllInOne from "../../../public/images/all-in-one.png";
import imgDevice from "../../../public/images/device.png";
import imgSchedule from "../../../public/images/schedule.png";

import style from "./about.module.css";

export default function AboutPage() {
  return (
    <div className="max-w-[60%] mx-auto">
      <Typography variant="h4" component={"h4"} className="my-8">
        About MegaX
      </Typography>

      <div
        className={
          "flex items-center gap-8 min-h-[350px] bg-blue-100 " + style.fullBg
        }
      >
        <div className="flex-1">
          <Typography variant="h5" component="h5" className="mb-5">
            All in one app
          </Typography>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores
            perferendis incidunt vero reprehenderit ullam, asperiores sunt,
            animi praesentium cumque quo nesciunt sed ipsa quam blanditiis, nam
            hic eius labore fuga?
          </p>
        </div>

        <Image alt="all-in-1" width={256} height={318} src={imgAllInOne} />
      </div>

      <div className="flex items-center gap-8 min-h-[350px]">
        <div className="flex-1 order-2">
          <Typography variant="h5" component="h5" className="mb-5">
            Devices Management made simple
          </Typography>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ullam eum
            dicta odio quasi obcaecati enim tempore, repellendus error
            veritatis, minus deleniti perspiciatis autem inventore sed aut porro
            nobis itaque ipsa!
          </p>
        </div>

        <Image
          className="order-1"
          alt="all-in-1"
          width={256}
          height={318}
          src={imgDevice}
        />
      </div>

      <div
        className={`flex items-center gap-8 min-h-[350px] bg-blue-100 ${style.fullBg}`}
      >
        <div className="flex-1">
          <Typography variant="h5" component={"h5"} className="mb-5">
            Leave Request never that easy
          </Typography>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae
            ipsam, perferendis inventore tenetur, laboriosam commodi accusamus
            eligendi tempora quaerat repudiandae impedit quasi numquam nobis,
            itaque officia ea vitae temporibus similique?
          </p>
        </div>

        <Image alt="all-in-1" width={256} height={318} src={imgSchedule} />
      </div>
    </div>
  );
}
