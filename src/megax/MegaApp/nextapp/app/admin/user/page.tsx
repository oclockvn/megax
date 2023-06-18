"use client";

import { useState, useEffect } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useAppDispatch, useAppSelector } from "@/lib/store/state.hook";
import { fetchUsersThunk } from "@/lib/store/user.state";
import datetime from "@/lib/datetime";
import { PageModel } from "@/lib/models/common.model";

import CustomPagination from "@/components/grid/CustomPagination";
import CommonSearch from "@/components/grid/CommonSearch";

export default function UserListPage() {
  const appDispatch = useAppDispatch();
  const { isLoading, pagedUsers } = useAppSelector(s => s.user);
  const [pageModel, setPageModel] = useState(new PageModel(0, 100));
  const [query, setQuery] = useState("");

  const columns: GridColDef[] = [
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

  useEffect(() => {
    appDispatch(
      fetchUsersThunk({
        page: pageModel.page,
        query,
      })
    );
  }, [pageModel.page, query]);

  // for initial load
  useEffect(() => {
    onPaging(new PageModel());
  }, []);

  return (
    <div className="p-4 min-h-[400px]">
      <div className="mb-4">
        <CommonSearch handleSearch={setQuery} />
      </div>

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
        }}
        rowCount={pagedUsers.total}
        paginationMode="server"
        paginationModel={pageModel}
        onPaginationModelChange={onPaging}
        pageSizeOptions={[100]}
        loading={isLoading}
        className="min-h-[400px]"
      />
    </div>
  );
}
