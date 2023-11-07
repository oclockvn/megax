"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import { useAppDispatch, useAppSelector } from "@/lib/store/state.hook";
import { fetchUsersThunk } from "@/lib/store/users.state";
import datetime from "@/lib/datetime";
import { Filter, PageModel } from "@/lib/models/common.model";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LinearProgress from "@mui/material/LinearProgress";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";

const CustomPagination = dynamic(
  () => import("@/components/grid/CustomPagination")
);
const CommonSearch = dynamic(() => import("@/components/grid/CommonSearch"));

export default function UserListPage() {
  const pathname = usePathname();
  const appDispatch = useAppDispatch();
  const loadRef = useRef(false);
  const { loading, pagedUsers } = useAppSelector(s => s.users);
  const [filter, setFilter] = useState<Partial<Filter>>({
    page: 0,
    pageSize: 100,
  });
  const pagingModel = {
    page: filter.page || 0,
    pageSize: filter.pageSize || 100,
  };

  const columns: GridColDef[] = [
    {
      field: "fullName",
      headerName: "Full Name",
      width: 400,
      renderCell: params => (
        <Link href={`${pathname}/${params.id}`} className="text-blue-400">
          {params.value}
        </Link>
      ),
    },
    { field: "title", headerName: "Title", width: 200 },
    {
      field: "email",
      headerName: "Email",
      width: 300,
      renderCell: params => (
        <a href={`mailto:${params.value}`}>{params.value}</a>
      ),
    },
    {
      field: "dob",
      headerName: "Dob",
      width: 150,
      valueFormatter: formatter =>
        formatter.value
          ? datetime.formatDate(formatter.value, "dd/MM/yyyy")
          : "",
    },
    {
      field: "identityNumber",
      headerName: "Identity Number",
      width: 160,
    },
  ];

  const onPaging = (ev: PageModel) => {
    setFilter({
      ...filter,
      page: ev.page,
    });
  };

  const onSorting = (e: GridSortModel) => {
    const sortBy = e && e[0] ? e[0].field : undefined;
    const sortDir = e && e[0] ? e[0].sort : undefined;

    setFilter({
      ...filter,
      sortBy: sortBy,
      sortDir: sortDir,
    });
  };

  const onSearch = (q: string) => {
    if (!q) {
      setFilter({});
    } else {
      setFilter({
        ...filter,
        query: q,
        sortBy: !q ? null : filter?.sortBy,
        sortDir: !q ? null : filter?.sortDir,
      });
    }
  };

  useEffect(() => {
    appDispatch(fetchUsersThunk(filter));
  }, [filter]);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <CommonSearch handleSearch={onSearch} />
      </div>

      <TableContainer component={Paper}>
        <DataGrid
          rows={pagedUsers.items}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 100 },
            },
          }}
          pagination
          slots={{
            pagination: CustomPagination,
            loadingOverlay: LinearProgress,
          }}
          rowCount={pagedUsers.total}
          paginationMode="server"
          paginationModel={pagingModel}
          onPaginationModelChange={onPaging}
          pageSizeOptions={[100]}
          sortingMode="server"
          onSortModelChange={onSorting}
          loading={loading}
        />
      </TableContainer>
    </div>
  );
}
