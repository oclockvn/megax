"use client";

import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Breadcrumbs from "@mui/material/Breadcrumbs";

import Grid from "@mui/material/Grid";
import { useQuery } from "@tanstack/react-query";
import { fetchDeviceDetail } from "@/lib/apis/devices.api";

const DeviceOwnerTimeline = dynamic(
  () => import("@/components/admin/devices/DeviceOwnerTimeline"),
  { ssr: false }
);

const DeviceInfo = dynamic(
  () => import("@/components/admin/devices/DeviceInfo"),
  { ssr: false }
);

export default function DevicePage({ params }: { params: { id: number } }) {
  const pathname = usePathname();

  const { data: device } = useQuery({
    queryKey: ["admin/device", params.id],
    queryFn: () => fetchDeviceDetail(params.id),
    enabled: params.id > 0,
  });

  return (
    <>
      <div role="presentation" className="bg-blue-200 py-2 px-6">
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            color="inherit"
            href={`${pathname}/..`}
            className="text-blue-500 flex items-center"
          >
            <ArrowBackIcon className="mr-2" />
            Devices
          </Link>
          <div>{device?.name || "..."}</div>
        </Breadcrumbs>
      </div>

      <div className="container mx-auto">
        <Grid container spacing={2} className="py-4">
          <Grid item xs={8}>
            <DeviceInfo device={device} />
          </Grid>

          <Grid item xs={4}>
            {params.id > 0 && <DeviceOwnerTimeline deviceId={params.id} />}
          </Grid>
        </Grid>
      </div>
    </>
  );
}
