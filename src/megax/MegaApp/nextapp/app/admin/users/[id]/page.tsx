"use client";

import React from "react";

import { usePathname } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";

import { useQueries } from "@tanstack/react-query";
import { fetchUserDetail } from "@/lib/apis/user.api";
import { fetchDeviceList } from "@/lib/apis/devices.api";
import { PagedResult } from "@/lib/models/common.model";
import { Device } from "@/lib/models/device.model";

const UserTabs = dynamic(() => import("@/components/admin/users/UserTabs"), {
  ssr: false,
});
const UserDeviceList = dynamic(
  () => import("@/components/admin/users/UserDeviceList"),
  { ssr: false }
);

export default function UserPage({ params }: { params: { id: number } }) {
  const pathname = usePathname();

  const [userResponse, devicesResponse] = useQueries({
    queries: [
      {
        queryKey: ["admin/user/", params.id],
        queryFn: () => fetchUserDetail(params.id),
      },
      {
        queryKey: ["admin/devices"],
        queryFn: () => fetchDeviceList({}),
        select: (paged: PagedResult<Device>) => paged.items,
        staleTime: 10 * 60 * 1000 // 10 min
      }
    ],
  });

  const { data: user } = userResponse;
  const hasAccount = Number(user?.accountId) > 0;

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
              Users
            </Link>
            <div>{user?.fullName || "..."}</div>
          </Breadcrumbs>
        </div>

        <Grid container spacing={2} className="p-4">
          <Grid item xs={8} md={6}>
            {!hasAccount && (
              <Alert
                severity="error"
                className="mb-2"
                variant="filled"
                action={
                  <Button color="inherit" size="small">
                    Setup Account
                  </Button>
                }
              >
                This user doesn't have login account yet!
              </Alert>
            )}
            <UserTabs user={user} />
          </Grid>

          <Grid item xs={4} md={3}>
            Leave
          </Grid>

          <Grid item xs={6} sm={6} md={3}>
            <UserDeviceList
              devices={devicesResponse.data}
              userId={user?.id || 0}
            />
          </Grid>
        </Grid>
      </div>
    </>
  );
}
