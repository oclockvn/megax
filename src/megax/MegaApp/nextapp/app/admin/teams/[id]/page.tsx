"use client";

import React from "react";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { useQuery } from "@tanstack/react-query";
import { getTeam } from "@/lib/apis/team.api";
import TeamForm from "@/components/admin/teams/TeamForm";

export default function TeamDetailPage({ params }: { params: { id: number } }) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    // isLoading,
    // status,
    data: current,
  } = useQuery({
    queryKey: ["get-team", params.id],
    queryFn: () => getTeam(params.id),
  });

  const onDeleted = () => {
    router.push(pathname + "/..");
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
          <div>{current?.name || "..."}</div>
        </Breadcrumbs>
      </div>

      <div className="container mx-auto py-4">
        <TeamForm current={current} onDeleted={onDeleted} />
      </div>
    </>
  );
}
