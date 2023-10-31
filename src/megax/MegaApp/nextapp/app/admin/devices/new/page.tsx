"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";

import Breadcrumbs from "@mui/material/Breadcrumbs";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Grid from "@mui/material/Grid";

import { useAppDispatch } from "@/lib/store/state.hook";
import {
  fetchDeviceTypesThunk,
  reset as resetDevice,
} from "@/lib/store/devices.state";
import { fetchSuppliersThunk } from "@/lib/store/suppliers.state";

const DeviceInfo  = dynamic(() => import( "@/components/admin/devices/DeviceInfo"));

export default function NewDevicePage() {
  const pathname = usePathname();
  const router = useRouter();
  const appDispatch = useAppDispatch();

  useEffect(() => {
    appDispatch(fetchDeviceTypesThunk());
    appDispatch(fetchSuppliersThunk());

    return () => {
      appDispatch(resetDevice());
    };
  }, [appDispatch]);

  const redirectToPage = (id: number) => {
    router.push(`${pathname}/../${id}`);
  };

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
            <div>New Device</div>
          </Breadcrumbs>
        </div>

        <Grid container className="p-4">
          <Grid item xs={8}>
            <DeviceInfo device={undefined} onAdded={redirectToPage} />
          </Grid>

          <Grid item xs={4}>
            Sidebar
          </Grid>
        </Grid>
      </div>
    </>
  );
}
