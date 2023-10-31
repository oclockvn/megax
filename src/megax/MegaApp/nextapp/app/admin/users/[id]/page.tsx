"use client";

import React, { useEffect } from "react";

import { usePathname } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";

import { useAppDispatch, useAppSelector } from "@/lib/store/state.hook";
import { clearUser, fetchUserDetailThunk } from "@/lib/store/users.state";
import { fetchDevicesThunk } from "@/lib/store/devices.state";
import { fetchBanksThunk } from "@/lib/store/banks.state";
import { delay } from "@/lib/util";

const UserTabs = dynamic(() => import("@/components/admin/users/UserTabs"), {
  ssr: false,
});
const UserDeviceList = dynamic(
  () => import("@/components/admin/users/UserDeviceList"),
  { ssr: false }
);

export default function UserPage({ params }: { params: { id: number } }) {
  const pathname = usePathname();
  const appDispatch = useAppDispatch();
  const { user } = useAppSelector(s => s.users);

  useEffect(() => {
    async function load() {
      appDispatch(fetchUserDetailThunk(params.id));
      await delay(100);
      appDispatch(fetchDevicesThunk());
      await delay(100);
      appDispatch(fetchBanksThunk({ pageSize: 1000 }));
    }

    load();

    return () => {
      appDispatch(clearUser());
    };
  }, [params.id]);

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
            <UserDeviceList userId={user?.id || 0} />
          </Grid>
        </Grid>
      </div>
    </>
  );
}
