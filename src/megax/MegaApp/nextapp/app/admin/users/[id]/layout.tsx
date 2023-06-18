"use client";

import React from "react";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/lib/store/state.hook";
import { clearUser, fetchUserDetailThunk } from "@/lib/store/userDetail.state";
import NavTabs from "@/components/NavTabs";

export default function UserPageLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: number };
}) {
  const pathname = usePathname();
  const appDispatch = useAppDispatch();
  const { user } = useAppSelector(s => s.user);

  useEffect(() => {
    appDispatch(fetchUserDetailThunk(params.id));

    return () => {
      appDispatch(clearUser());
    };
  }, [params.id]);

  const basePath = pathname + "/..";

  return (
    <>
      <div role="presentation" className="bg-blue-200 py-2 px-6">
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            color="inherit"
            href={`${basePath}/..`}
            className="text-blue-500 flex items-center"
          >
            <ArrowBackIcon className="mr-2" />
            Users
          </Link>
          <div>{user?.fullName || "..."}</div>
        </Breadcrumbs>
      </div>

      <NavTabs
        links={[
          { label: "Information", href: `${basePath}/info` },
          { label: "Devices", href: `${basePath}/devices` },
          { label: "Leaves", href: `${basePath}/leave` },
        ]}
      />

      {children}
    </>
  );
}
