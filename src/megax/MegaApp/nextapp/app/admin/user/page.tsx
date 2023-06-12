"use client";

import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useAppDispatch, useAppSelector } from "@/lib/store/state.hook";
import { fetchUsersThunk } from "@/lib/store/user.state";
import datetime from "@/lib/datetime";
import { PageModel } from "@/lib/models/common.model";

export default function UserListPage() {
  const appDispatch = useAppDispatch();
  const { isLoading, pagedUsers } = useAppSelector(s => s.user);
  const [pageModel, setPageModel] = React.useState(new PageModel(0, 100));

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

  const onPaging = (ev: PageModel) => {
    setPageModel({
      ...pageModel,
      page: ev.page,
    });
  };

  React.useEffect(() => {
    appDispatch(
      fetchUsersThunk({
        page: pageModel.page,
      })
    );
  }, [pageModel.page]);

  // for initial load
  React.useEffect(() => {
    onPaging(new PageModel());
  }, []);

  return (
    <div className="p-4 min-h-[400px]">
      <DataGrid
        rows={pagedUsers.items}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 100 },
          },
        }}
        rowCount={pagedUsers.total}
        paginationMode="server"
        paginationModel={pageModel}
        onPaginationModelChange={onPaging}
        pageSizeOptions={[100]}
        loading={isLoading}
        className="min-h-[400px]"
        // checkboxSelection
      />
    </div>
  );
}
