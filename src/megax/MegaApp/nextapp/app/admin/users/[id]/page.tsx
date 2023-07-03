"use client";

import React from "react";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/lib/store/state.hook";
import { clearUser, fetchUserDetailThunk } from "@/lib/store/users.state";
import Grid from "@mui/material/Grid";
import UserInfo from "./UserInfo";
import UserDeviceList from "./UserDeviceList";
import { fetchDevicesThunk } from "@/lib/store/devices.state";

export default function UserPage({ params }: { params: { id: number } }) {
  const pathname = usePathname();
  const appDispatch = useAppDispatch();
  const { user } = useAppSelector(s => s.users);

  useEffect(() => {
    appDispatch(fetchUserDetailThunk(params.id));
    appDispatch(fetchDevicesThunk());

    // return () => {
    //   appDispatch(clearUser());
    // };
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
              Users
            </Link>
            <div>{user?.fullName || "..."}</div>
          </Breadcrumbs>
        </div>

        <Grid container spacing={2} className="p-4">
          <Grid item xs={8}>
            <UserInfo user={user} />
          </Grid>

          <Grid item xs={4}>
            <UserDeviceList />
          </Grid>
        </Grid>
      </div>
    </>
  );
}
