"use client";

import * as React from "react";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/state.hook";
import { fetchUsersThunk } from "@/lib/store/user.state";

export default function UserListPage() {
  const appDispatch = useAppDispatch();
  const { isLoading, users } = useAppSelector(s => s.user);

  React.useEffect(() => {
    appDispatch(fetchUsersThunk());
  }, []);

  const columns: GridColDef[] = [
    // { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Full Name", width: 200 },
    { field: "email", headerName: "Email", width: 150 },
    {
      field: "dob",
      headerName: "Dob",
      width: 150,
    },
    {
      field: "identityNumber",
      headerName: "Identity Number",
      width: 160,
    },
  ];

  // const rows = [
  //   { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
  //   { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
  //   { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
  //   { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
  //   { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  //   { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  //   { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  //   { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  //   { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
  // // ];

  return (
    <div style={{ width: "100%" }}>
      <DataGrid
        rows={users}
        columns={columns}
        initialState={
          {
            // pagination: {
            //   paginationModel: { page: 0, pageSize: 5 },
            // },
          }
        }
        // pageSizeOptions={[5, 10]}
        // checkboxSelection
      />
    </div>
  );
}
