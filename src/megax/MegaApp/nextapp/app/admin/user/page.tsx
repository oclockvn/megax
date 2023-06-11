"use client";

import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useAppDispatch, useAppSelector } from "@/lib/store/state.hook";
import { fetchUsersThunk } from "@/lib/store/user.state";
import datetime from "@/lib/datetime";

export default function UserListPage() {
  const appDispatch = useAppDispatch();
  const { isLoading, users } = useAppSelector(s => s.user);

  React.useEffect(() => {
    appDispatch(fetchUsersThunk());
  }, []);

  const columns: GridColDef[] = [
    // { field: "id", headerName: "ID", width: 70 },
    { field: "fullName", headerName: "Full Name", width: 400 },
    { field: "email", headerName: "Email", width: 300 },
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

  return (
    <div className="p-4">
      <DataGrid
        rows={users}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 100 },
          },
        }}
        pageSizeOptions={[100]}
        // checkboxSelection
      />
    </div>
  );
}
