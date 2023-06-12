"use client";

import * as React from "react";
import {
  DataGrid,
  GridColDef,
  gridPageCountSelector,
  GridPagination,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import { useAppDispatch, useAppSelector } from "@/lib/store/state.hook";
import { fetchUsersThunk } from "@/lib/store/user.state";
import datetime from "@/lib/datetime";
import { PageModel } from "@/lib/models/common.model";

import MuiPagination from "@mui/material/Pagination";
import { TablePaginationProps } from "@mui/material/TablePagination";

function Pagination({
  page,
  onPageChange,
  className,
}: Pick<TablePaginationProps, "page" | "onPageChange" | "className">) {
  const apiRef = useGridApiContext();
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <MuiPagination
      color="primary"
      className={className}
      count={pageCount}
      page={page + 1}
      onChange={(event, newPage) => {
        onPageChange(event as any, newPage - 1);
      }}
    />
  );
}

function CustomPagination(props: any) {
  return <GridPagination ActionsComponent={Pagination} {...props} />;
}

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
        // checkboxSelection
      />
    </div>
  );
}
