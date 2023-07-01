"use client";

import React from "react";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/lib/store/state.hook";
import Grid from "@mui/material/Grid";
import {
  fetchDeviceDetailThunk,
  fetchDeviceTypesThunk,
  reset as resetDevice,
} from "@/lib/store/devices.state";
import DeviceInfo from "./DeviceInfo";

export default function DevicePage({ params }: { params: { id: number } }) {
  const pathname = usePathname();
  const appDispatch = useAppDispatch();
  const { currentDevice } = useAppSelector(s => s.devices);

  useEffect(() => {
    appDispatch(fetchDeviceDetailThunk(params.id));
    appDispatch(fetchDeviceTypesThunk());

    return () => {
      appDispatch(resetDevice());
    };
  }, [params.id]);

  return (
    <>
      <div>
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
            <div>{currentDevice?.name || "..."}</div>
          </Breadcrumbs>
        </div>

        <Grid container className="p-4">
          <Grid item xs={8}>
            <DeviceInfo device={currentDevice} />
          </Grid>

          <Grid item xs={4}>
            Sidebar
          </Grid>
        </Grid>
      </div>
    </>
  );
}
