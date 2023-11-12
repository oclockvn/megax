"use client";

import React from "react";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import TeamForm from "@/components/admin/teams/TeamForm";

export default function TeamDetailPage({ params }: { params: { id: number } }) {
  const pathname = usePathname();
  const router = useRouter();

  const redirect = (id: number) => {
    router.push(`${pathname}/../${id}`);
  };

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
            Teams
          </Link>
          <div>New Team</div>
        </Breadcrumbs>
      </div>

      <div className="container mx-auto py-4">
        <TeamForm onSuccess={({ id }) => redirect(id)} />
      </div>
    </>
  );
}
